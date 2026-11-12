"use server";

import type { RfqProductSnapshot } from "@/sanity/lib/types";

import { z } from "zod";

import { isCatalogEnabled } from "@/lib/catalog/visibility";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/lib/queries";

import { RFQ_MAX_ITEMS } from "./schema";

const IdsSchema = z.array(z.string().min(1).max(200)).max(RFQ_MAX_ITEMS);

/**
 * Current published state of the given products. Products that no longer
 * exist are simply absent from the result. Always a fresh read (no CDN, no
 * stega), since this is what decides whether a line can still be sent.
 */
export async function lookupRfqProducts(ids: string[]): Promise<RfqProductSnapshot[]> {
  const parsed = IdsSchema.safeParse(Array.from(new Set(ids)));

  if (!parsed.success || parsed.data.length === 0) return [];
  // This returns product data, so it returns none while the catalogue is off (CI-71).
  if (!(await isCatalogEnabled())) return [];

  return client.fetch<RfqProductSnapshot[]>(
    PRODUCTS_BY_IDS_QUERY,
    { ids: parsed.data },
    { perspective: "published", stega: false, cache: "no-store" },
  );
}
