"use client";

import type { RfqLineItem } from "./types";

import * as React from "react";
import { z } from "zod";

import {
  RFQ_MAX_ITEMS,
  RFQ_MAX_QUANTITY,
  RFQ_MAX_RANGES,
  RfqLineItemSchema,
  RfqRangeSlugSchema,
  rfqLineKey,
} from "./schema";

const STORAGE_KEY = "clover:rfq:v1";
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;

const StoredSchema = z.object({
  updatedAt: z.number(),
  items: z.array(z.unknown()),
  /** Slugs of the product ranges the buyer asked about. Absent in older saves. */
  ranges: z.array(z.unknown()).optional(),
});

export type AddItemResult = "added" | "merged" | "full";
export type AddRangeResult = "added" | "exists" | "full";

type StoredRfq = { items: RfqLineItem[]; ranges: string[] };

type RfqContextValue = {
  items: RfqLineItem[];
  /** Product ranges the buyer asked about (slugs). Tags on the request, not cart lines. */
  ranges: string[];
  count: number;
  /** False until localStorage has been read on the client. Gate any
   *  count-dependent UI on this to avoid SSR hydration mismatches. */
  hydrated: boolean;
  /** Adding a line that already exists (same product + pack) bumps its quantity. */
  addItem: (item: RfqLineItem) => AddItemResult;
  updateItem: (key: string, patch: Partial<RfqLineItem>) => void;
  removeItem: (key: string) => void;
  addRange: (slug: string) => AddRangeResult;
  removeRange: (slug: string) => void;
  setRanges: (slugs: string[]) => void;
  /** Empties the whole request: products and ranges. */
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

    byKey.set(
      key,
      existing
        ? { ...existing, quantity: capQuantity(existing.quantity + line.quantity) }
        : line,
    );
  }

  return Array.from(byKey.values());
}

const EMPTY: StoredRfq = { items: [], ranges: [] };

/** Only well-formed, unique slugs, capped: anything else in storage is ignored. */
function cleanRanges(candidates: unknown[]): string[] {
  const slugs: string[] = [];

  for (const candidate of candidates) {
    const parsed = RfqRangeSlugSchema.safeParse(candidate);

    if (parsed.success && !slugs.includes(parsed.data)) slugs.push(parsed.data);
  }

  return slugs.slice(0, RFQ_MAX_RANGES);
}

/** Reads and validates the stored request. Returns empty for anything missing,
 *  malformed, expired or unreadable (storage can throw when blocked). */
export function readRfqStorage(): StoredRfq {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return EMPTY;

    const stored = StoredSchema.safeParse(JSON.parse(raw));

    if (!stored.success) return EMPTY;
    if (Date.now() - stored.data.updatedAt > EXPIRY_MS) {
      window.localStorage.removeItem(STORAGE_KEY);

      return EMPTY;
    }

    const items: RfqLineItem[] = [];

    for (const candidate of stored.data.items) {
      const parsed = RfqLineItemSchema.safeParse(candidate);

      if (parsed.success) items.push(parsed.data);
    }

    return {
      items: foldLines(items).slice(0, RFQ_MAX_ITEMS),
      ranges: cleanRanges(stored.data.ranges ?? []),
    };
  } catch {
    return EMPTY;
  }
}

function writeRfqStorage({ items, ranges }: StoredRfq) {
  try {
    if (items.length === 0 && ranges.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);

      return;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ updatedAt: Date.now(), items, ranges }),
    );
  } catch {
    // Storage blocked or full: the list keeps working in memory for the session.
  }
}

export function RfqProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<RfqLineItem[]>([]);
  const [ranges, setRangesState] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  // Mirrors of the state so callbacks read the latest values synchronously
  // (addItem has to report "full" without waiting for a re-render).
  const itemsRef = React.useRef<RfqLineItem[]>([]);
  const rangesRef = React.useRef<string[]>([]);

  const replace = React.useCallback((next: StoredRfq) => {
    itemsRef.current = next.items;
    rangesRef.current = next.ranges;
    setItems(next.items);
    setRangesState(next.ranges);
  }, []);

  const commit = React.useCallback(
    (nextItems: RfqLineItem[], nextRanges: string[] = rangesRef.current) => {
      const next = { items: nextItems, ranges: nextRanges };

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
        const parsed = RfqLineItemSchema.safeParse({ ...line, ...patch });

        // Ignore edits that would make the line invalid (e.g. quantity 0).
        return parsed.success ? parsed.data : line;
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

  const addRange = React.useCallback(
    (slug: string): AddRangeResult => {
      const current = rangesRef.current;

      if (current.includes(slug)) return "exists";
      if (current.length >= RFQ_MAX_RANGES) return "full";
      commit(itemsRef.current, [...current, slug]);

      return "added";
    },
    [commit],
  );

  const removeRange = React.useCallback(
    (slug: string) => {
      commit(itemsRef.current, rangesRef.current.filter((existing) => existing !== slug));
    },
    [commit],
  );

  const setRanges = React.useCallback(
    (slugs: string[]) => {
      commit(itemsRef.current, cleanRanges(slugs));
    },
    [commit],
  );

  const clear = React.useCallback(() => commit([], []), [commit]);

  const value = React.useMemo<RfqContextValue>(
    () => ({
      items,
      ranges,
      count: items.length,
      hydrated,
      addItem,
      updateItem,
      removeItem,
      addRange,
      removeRange,
      setRanges,
      clear,
    }),
    [items, ranges, hydrated, addItem, updateItem, removeItem, addRange, removeRange, setRanges, clear],
  );

  return <RfqContext.Provider value={value}>{children}</RfqContext.Provider>;
}

export function useRfq(): RfqContextValue {
  const ctx = React.useContext(RfqContext);

  if (!ctx) throw new Error("useRfq must be used inside <RfqProvider>");

  return ctx;
}
