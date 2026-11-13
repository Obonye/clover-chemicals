import type { RfqLineItem } from "./types";
import type { PackSize, RfqProductSnapshot } from "@/sanity/lib/types";

import { packLabel } from "@/sanity/lib/format";

/**
 * Why a line can't be sent as it stands:
 * - `missing`: the product was deleted (or lost its slug/name/division).
 * - `unavailable`: the product is marked unavailable in Sanity.
 * - `pack-missing`: the chosen pack size no longer exists, or the product
 *   now has pack sizes and none is chosen. Fixable by picking one.
 */
export type RfqLineProblem = "missing" | "unavailable" | "pack-missing";

export type RfqLineCheck = {
  problem: RfqLineProblem | null;
  /** Fields that changed in Sanity (rename, re-grade, new pack label…) and
   *  should be written back to the stored line. Empty when nothing changed. */
  patch: Partial<RfqLineItem>;
  /** The product's current, labelled pack sizes (for the pack select). */
  packSizes: PackSize[];
  snapshot: RfqProductSnapshot | null;
};

export function reconcileRfqLine(
  line: RfqLineItem,
  snapshot: RfqProductSnapshot | undefined,
): RfqLineCheck {
  const division = snapshot?.category?.division ?? null;

  if (!snapshot || !snapshot.slug || !snapshot.name || !division) {
    return { problem: "missing", patch: {}, packSizes: [], snapshot: snapshot ?? null };
  }

  const packSizes = (snapshot.packSizes ?? []).filter((pack) => packLabel(pack));
  const pack = line.packSizeKey
    ? (packSizes.find((p) => p._key === line.packSizeKey) ?? null)
    : null;

  const current: Partial<RfqLineItem> = {
    name: snapshot.name,
    slug: snapshot.slug,
    grade: snapshot.grade ?? null,
    division,
    ...(pack ? { packLabel: packLabel(pack) } : {}),
  };
  const patch: Partial<RfqLineItem> = {};

  for (const [field, value] of Object.entries(current) as [keyof RfqLineItem, unknown][]) {
    if (line[field] !== value) (patch as Record<string, unknown>)[field] = value;
  }

  let problem: RfqLineProblem | null = null;

  if (snapshot.available === false) problem = "unavailable";
  else if (line.packSizeKey ? !pack : packSizes.length > 0) problem = "pack-missing";

  return { problem, patch, packSizes, snapshot };
}
