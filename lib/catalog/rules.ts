/**
 * The catalogue visibility rules, as plain functions with no framework
 * imports so they can be tested on their own (rules.test.ts). Pages and
 * components never call these directly: they use lib/catalog/visibility.ts,
 * which feeds in the Vercel flag.
 */

/** The part of a Sanity category the rules need. */
export type CategoryReadiness = {
  slug?: string | null;
  /** "chemicals" or "medical". Medical requests go to the Medical enquiry form. */
  division?: string | null;
  /** Set by editors once a category's products are ready to show (CI-69).
   *  Missing counts as not ready. */
  catalogReady?: boolean | null;
};

/** A category is browsable only when the catalogue is on AND it's ready. */
export function browsable(catalogEnabled: boolean, category: CategoryReadiness | null | undefined): boolean {
  return catalogEnabled && category?.catalogReady === true;
}

/**
 * Where a category's links go while it isn't browsable: the RFQ with that
 * range added (CI-74), or, for Medical, the simple Medical enquiry form
 * with the range named (CI-41).
 */
export function rfqEntryHref(slug: string | null | undefined, division?: string | null): string {
  if (!slug) return division === "medical" ? "/contact?enquiry=medical" : "/rfq";
  if (division === "medical") return `/contact?enquiry=medical&category=${encodeURIComponent(slug)}`;

  return `/rfq?category=${encodeURIComponent(slug)}`;
}

/** Where a category's link goes: its product listing when browsable,
 *  otherwise the RFQ entry for that category. */
export function categoryHref(
  catalogEnabled: boolean,
  category: CategoryReadiness,
  listingBase = "/products",
): string {
  if (browsable(catalogEnabled, category)) return `${listingBase}/${category.slug ?? ""}`;

  return rfqEntryHref(category.slug, category.division);
}
