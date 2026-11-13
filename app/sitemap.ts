import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";
import { divisions } from "@/config/divisions";
import { getCatalog } from "@/lib/catalog/visibility";
import { loadCatalogQuery } from "@/sanity/lib/fetch";
import { CATEGORY_SLUGS_QUERY, PRODUCT_SLUGS_QUERY } from "@/sanity/lib/queries";

// Per request, because which product pages exist depends on the catalogue
// flag and on each category's `catalogReady` (CI-77).
export const dynamic = "force-dynamic";

// News articles aren't included: app/news/page.tsx still reads a hardcoded
// placeholder list, and there's no app/news/[slug] route to point at yet
// (see CI-13). Add "/news/${slug}" here once that route ships.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const [categorySlugs, productSlugs] = await Promise.all([
    loadCatalogQuery<{ slug: string | null; catalogReady: boolean | null }[]>(CATEGORY_SLUGS_QUERY, {
      perspective: "published",
      stega: false,
    }),
    loadCatalogQuery<{ category: string | null; product: string | null; categoryReady: boolean | null }[]>(PRODUCT_SLUGS_QUERY, {
      perspective: "published",
      stega: false,
    }),
  ]);

  const staticPaths = ["/", "/about", "/contact", "/news", "/products", "/locations"];

  const divisionPaths = divisions.flatMap((d) => [`/${d.slug}`, `/${d.slug}/products`]);

  // Only browsable categories: a category that redirects to the RFQ, and its
  // products, stay out of the sitemap (and so out of the index).
  const categoryPaths = categorySlugs
    .filter((c) => catalog.isBrowsable(c))
    .map((c) => c.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/products/${slug}`);

  const productPaths = productSlugs
    .filter((s) => catalog.isBrowsable({ catalogReady: s.categoryReady }))
    .filter(
      (s): s is typeof s & { category: string; product: string } => Boolean(s.category) && Boolean(s.product),
    )
    .map((s) => `/products/${s.category}/${s.product}`);

  const lastModified = new Date();

  return [...staticPaths, ...divisionPaths, ...categoryPaths, ...productPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
}
