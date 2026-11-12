/**
 * The catalogue visibility rules, as plain functions with no framework
 * imports so they can be tested on their own (rules.test.ts). Pages and
 * components never call these directly: they use lib/catalog/visibility.ts,
 * which feeds in the Vercel flag.
 */

/** The part of a Sanity category the rules need. */
export type CategoryReadiness = {
  slug?: string | null;
  /** Set by editors once a category's products are ready to show (CI-69).
   *  Missing counts as not ready. */
  catalogReady?: boolean | null;
};

/** A category is browsable only when the catalogue is on AND it's ready. */
export function browsable(catalogEnabled: boolean, category: CategoryReadiness | null | undefined): boolean {
  return catalogEnabled && category?.catalogReady === true;
}

/** Where a category's link goes: its product listing when browsable,
 *  otherwise the RFQ entry for that category. */
export function categoryHref(
  catalogEnabled: boolean,
  category: CategoryReadiness,
  listingBase = "/products",
): string {
  const slug = category.slug ?? "";

  if (browsable(catalogEnabled, category)) return `${listingBase}/${slug}`;

  return slug ? `/rfq?category=${encodeURIComponent(slug)}` : "/rfq";
}
