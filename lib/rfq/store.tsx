"use client";

import type { RfqLineItem } from "./types";

import * as React from "react";
import { z } from "zod";

import {
  RFQ_MAX_ITEMS,
  RFQ_MAX_QUANTITY,
  RfqLineItemSchema,
  rfqLineKey,
} from "./schema";

const STORAGE_KEY = "clover:rfq:v1";
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

const StoredSchema = z.object({
  updatedAt: z.number(),
  items: z.array(z.unknown()),
});

export type AddItemResult = "added" | "merged" | "full";

type RfqContextValue = {
  items: RfqLineItem[];
  count: number;
  /** False until localStorage has been read on the client. Gate any
   *  count-dependent UI on this to avoid SSR hydration mismatches. */
  hydrated: boolean;
  /** Adding a line that already exists (same product + pack) bumps its quantity. */
  addItem: (item: RfqLineItem) => AddItemResult;
  updateItem: (key: string, patch: Partial<RfqLineItem>) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

const RfqContext = React.createContext<RfqContextValue | null>(null);

const capQuantity = (n: number) => Math.min(RFQ_MAX_QUANTITY, n);

/** Merges lines that share a product + pack size, keeping first-seen order. */
function foldLines(lines: RfqLineItem[]): RfqLineItem[] {
  const byKey = new Map<string, RfqLineItem>();

  for (const line of lines) {
    const key = rfqLineKey(line);
    const existing = byKey.get(key);

    if (!existing) {
      byKey.set(key, line);
    } else if (existing.type === "product" && line.type === "product") {
      byKey.set(key, { ...existing, quantity: capQuantity(existing.quantity + line.quantity) });
    }
    // The same category can't be listed twice: the first one stays.
  }

  return Array.from(byKey.values());
}

/** Reads and validates the stored list. Returns [] for anything missing,
 *  malformed, expired or unreadable (storage can throw when blocked). */
export function readRfqStorage(): RfqLineItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return [];

    const stored = StoredSchema.safeParse(JSON.parse(raw));

    if (!stored.success) return [];
    if (Date.now() - stored.data.updatedAt > EXPIRY_MS) {
      window.localStorage.removeItem(STORAGE_KEY);

      return [];
    }

    const items: RfqLineItem[] = [];

    for (const candidate of stored.data.items) {
      const parsed = RfqLineItemSchema.safeParse(candidate);

      if (parsed.success) items.push(parsed.data);
    }

    return foldLines(items).slice(0, RFQ_MAX_ITEMS);
  } catch {
    return [];
  }
}

function writeRfqStorage(items: RfqLineItem[]) {
  try {
    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);

      return;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ updatedAt: Date.now(), items }),
    );
  } catch {
    // Storage blocked or full: the list keeps working in memory for the session.
  }
}

export function RfqProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<RfqLineItem[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  // Mirror of `items` so callbacks read the latest list synchronously
  // (addItem has to report "full" without waiting for a re-render).
  const itemsRef = React.useRef<RfqLineItem[]>([]);

  const replace = React.useCallback((next: RfqLineItem[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const commit = React.useCallback(
    (next: RfqLineItem[]) => {
      replace(next);
      writeRfqStorage(next);
    },
    [replace],
  );

  React.useEffect(() => {
    replace(readRfqStorage());
    setHydrated(true);

    const onStorage = (event: StorageEvent) => {
      // `key` is null when another tab calls localStorage.clear().
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      replace(readRfqStorage());
    };

    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, [replace]);

  const addItem = React.useCallback(
    (item: RfqLineItem): AddItemResult => {
      const current = itemsRef.current;
      const key = rfqLineKey(item);
      const exists = current.some((line) => rfqLineKey(line) === key);

      if (!exists && current.length >= RFQ_MAX_ITEMS) return "full";
      commit(foldLines([...current, item]));

      return exists ? "merged" : "added";
    },
    [commit],
  );

  const updateItem = React.useCallback(
    (key: string, patch: Partial<RfqLineItem>) => {
      const next = itemsRef.current.map((line) => {
        if (rfqLineKey(line) !== key) return line;
        const parsed = RfqLineItemSchema.safeParse({ ...line, ...patch, type: line.type });

        // Ignore edits that would make the line invalid (e.g. quantity 0).
        // A line's `type` never changes.
        return parsed.success && parsed.data.type === line.type ? parsed.data : line;
      });

      // A pack-size change can make two lines identical: fold them together.
      commit(foldLines(next));
    },
    [commit],
  );

  const removeItem = React.useCallback(
    (key: string) => {
      commit(itemsRef.current.filter((line) => rfqLineKey(line) !== key));
    },
    [commit],
  );

  const clear = React.useCallback(() => commit([]), [commit]);

  const value = React.useMemo<RfqContextValue>(
    () => ({
      items,
      count: items.length,
      hydrated,
      addItem,
      updateItem,
      removeItem,
      clear,
    }),
    [items, hydrated, addItem, updateItem, removeItem, clear],
  );

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfq(): RfqContextValue {
  const ctx = React.useContext(RfqContext);

  if (!ctx) throw new Error("useRfq must be used inside <RfqProvider>");

  return ctx;
}
