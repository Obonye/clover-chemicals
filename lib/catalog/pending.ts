import { stegaClean } from "next-sanity";

import type { ProductCategory } from "@/sanity/lib/types";

/**
 * Ranges whose products aren't browsable yet, with plain-text slug and label
 * so they can be matched against `?category=` and stored in the quote.
 * Medical ranges are left out: they use the Medical enquiry form (CI-41).
 */
export function pendingRanges(
  categories: ProductCategory[],
  isBrowsable: (category: ProductCategory) => boolean,
): ProductCategory[] {
  return categories
    .filter((category) => !isBrowsable(category) && stegaClean(category.division ?? "") !== "medical")
    .map((category) => ({
      ...category,
      slug: category.slug ? stegaClean(category.slug) : category.slug,
      label: category.label ? stegaClean(category.label) : category.label,
    }));
}
