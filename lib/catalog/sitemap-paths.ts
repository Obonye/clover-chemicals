import { browsable } from "./rules.ts";

// Relative import (not "@/…") so the plain Node test runner can load this file.

type SitemapCategory = { slug: string | null; catalogReady: boolean | null };
type SitemapProduct = { category: string | null; product: string | null; categoryReady: boolean | null };

/**
 * The product-related URLs the sitemap may list (CI-77). Only categories that
 * are browsable (catalogue on AND the category marked ready) appear, and so do
 * only their products: a category that redirects to the quote form, and its
 * products, stay out of the index.
 */
export function catalogSitemapPaths({
  enabled,
  categories,
  products,
}: {
  enabled: boolean;
  categories: SitemapCategory[];
  products: SitemapProduct[];
}): string[] {
  const categoryPaths = categories
    .filter((category) => browsable(enabled, category))
    .map((category) => category.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/products/${slug}`);

  const productPaths = products
    .filter((item) => browsable(enabled, { catalogReady: item.categoryReady }))
    .filter((item): item is SitemapProduct & { category: string; product: string } =>
      Boolean(item.category) && Boolean(item.product),
    )
    .map((item) => `/products/${item.category}/${item.product}`);

  return [...categoryPaths, ...productPaths];
}
