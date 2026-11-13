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
 * Where a category's links go while it isn't browsable: its own range page,
 * which shows an "add to my quote" panel instead of products. Medical ranges
 * go to the simple Medical enquiry form with the range named (CI-41).
 */
export function rangeHref(slug: string | null | undefined, division?: string | null): string {
  if (division === "medical") {
    return slug ? `/contact?enquiry=medical&category=${encodeURIComponent(slug)}` : "/contact?enquiry=medical";
  }

  return slug ? `/products/${encodeURIComponent(slug)}` : "/products";
}

/** Where a category's link goes: its product listing when browsable,
 *  otherwise its range page (or the Medical form). */
export function categoryHref(
  catalogEnabled: boolean,
  category: CategoryReadiness,
  listingBase = "/products",
): string {
  if (browsable(catalogEnabled, category)) return `${listingBase}/${category.slug ?? ""}`;

  return rangeHref(category.slug, category.division);
}
