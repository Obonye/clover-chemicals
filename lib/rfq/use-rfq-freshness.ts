"use client";

import type { RfqLineCheck } from "./reconcile";
import type { RfqLineItem, RfqProductLine } from "./types";
import type { RfqProductSnapshot } from "@/sanity/lib/types";

import * as React from "react";

import { lookupRfqProducts } from "./lookup";
import { reconcileRfqLine } from "./reconcile";
import { rfqLineKey } from "./schema";
import { useRfq } from "./store";

export type RfqFreshness = {
  /** "error" means the check failed: lines are shown unchecked, not blocked. */
  status: "idle" | "loading" | "ready" | "error";
  checks: Map<string, RfqLineCheck>;
  /** Lines with no problem (or all lines, if the check couldn't run). */
  sendable: RfqLineItem[];
  retry: () => void;
};

/**
 * Re-checks the stored RFQ list against Sanity whenever the set of products
 * in it changes: flags deleted/unavailable products and vanished pack sizes,
 * and writes renames back to the stored lines.
 */
export function useRfqFreshness(enabled = true): RfqFreshness {
  const { items: allItems, hydrated, updateItem } = useRfq();
  // Only products are checked against Sanity here; category lines are
  // validated when the request is sent.
  const items = React.useMemo(
    () => allItems.filter((line): line is RfqProductLine => line.type === "product"),
    [allItems],
  );
  const categoryLines = React.useMemo(() => allItems.filter((line) => line.type === "category"), [allItems]);
  const [status, setStatus] = React.useState<RfqFreshness["status"]>("idle");
  const [snapshots, setSnapshots] = React.useState<Map<string, RfqProductSnapshot> | null>(null);
  const [attempt, setAttempt] = React.useState(0);

  // Only a change in *which* products are listed needs a new lookup —
  // quantity/note edits don't.
  const idsKey = React.useMemo(
    () => Array.from(new Set(items.map((line) => line.productId))).sort().join("|"),
    [items],
  );

  React.useEffect(() => {
    // While the catalogue is off no product is looked up (CI-72).
    if (!enabled || !hydrated || idsKey === "") {
      setStatus("idle");

      return;
    }
    let cancelled = false;

    setStatus("loading");
    lookupRfqProducts(idsKey.split("|"))
      .then((result) => {
        if (cancelled) return;
        setSnapshots(new Map(result.map((product) => [product._id, product])));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, hydrated, idsKey, attempt]);

  const checks = React.useMemo(() => {
    const map = new Map<string, RfqLineCheck>();

    if (status !== "ready" || !snapshots) return map;
    for (const line of items) {
      map.set(rfqLineKey(line), reconcileRfqLine(line, snapshots.get(line.productId)));
    }

    return map;
  }, [items, snapshots, status]);

  // Write renames/re-grades back so the stored list (and the eventual
  // submission) carries the current names. Each patch is applied once: if
  // the store were to reject one, re-applying it on every render would loop.
  const appliedPatches = React.useRef(new Set<string>());

  React.useEffect(() => {
    for (const [key, check] of Array.from(checks)) {
      if (check.problem === "missing" || Object.keys(check.patch).length === 0) continue;
      const signature = `${key}:${JSON.stringify(check.patch)}`;

      if (appliedPatches.current.has(signature)) continue;
      appliedPatches.current.add(signature);
      updateItem(key, check.patch);
    }
  }, [checks, updateItem]);

  const sendable = React.useMemo<RfqLineItem[]>(() => {
    const products =
      status === "ready"
        ? items.filter((line) => !checks.get(rfqLineKey(line))?.problem)
        : status === "error"
          ? items
          : [];

    return [...products, ...categoryLines];
  }, [items, categoryLines, checks, status]);

  const retry = React.useCallback(() => setAttempt((n) => n + 1), []);

  return { status, checks, sendable, retry };
}
