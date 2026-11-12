import "server-only";

import { cache } from "react";

import { productCatalog } from "@/flags";
import { browsable, categoryHref, type CategoryReadiness } from "@/lib/catalog/rules";

/**
 * The one place that decides whether products are shown (CI-70). Nav, category
 * cards, route guards and the sitemap all ask here; nothing else reads the
 * `product-catalog` flag.
 *
 * Evaluated once per request (React `cache`) and fails closed: if the flag
 * service errors or can't be reached, products stay hidden.
 */
export const isCatalogEnabled = cache(async (): Promise<boolean> => {
  try {
    return (await productCatalog()) === true;
  } catch {
    return false;
  }
});

/**
 * Everything a page needs to apply the rules to many categories without
 * awaiting once per category.
 */
export async function getCatalog() {
  const enabled = await isCatalogEnabled();

  return {
    enabled,
    isBrowsable: (category: CategoryReadiness | null | undefined) => browsable(enabled, category),
    hrefFor: (category: CategoryReadiness, listingBase?: string) => categoryHref(enabled, category, listingBase),
  };
}

/** True when the catalogue is on and this category has been marked ready. */
export async function isCategoryBrowsable(category: CategoryReadiness | null | undefined): Promise<boolean> {
  return browsable(await isCatalogEnabled(), category);
}

/** The category's product listing when browsable, otherwise `/rfq?category=<slug>`. */
export async function getCategoryHref(category: CategoryReadiness, listingBase?: string): Promise<string> {
  return categoryHref(await isCatalogEnabled(), category, listingBase);
}
