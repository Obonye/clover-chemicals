import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config/site";
import { divisions } from "@/config/divisions";
import { loadQuery } from "@/sanity/lib/fetch";
import { CATEGORY_SLUGS_QUERY } from "@/sanity/lib/queries";

// News articles aren't included: app/news/page.tsx still reads a hardcoded
// placeholder list, and there's no app/news/[slug] route to point at yet
// (see CI-13). Add "/news/${slug}" here once that route ships.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categorySlugs = await loadQuery<{ slug: string | null }[]>(CATEGORY_SLUGS_QUERY, {
    perspective: "published",
    stega: false,
  });

  const staticPaths = ["/", "/about", "/contact", "/news", "/products"];

  const divisionPaths = divisions.flatMap((d) => [`/${d.slug}`, `/${d.slug}/products`]);

  const categoryPaths = categorySlugs
    .map((c) => c.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => `/products/${slug}`);

  const lastModified = new Date();

  return [...staticPaths, ...divisionPaths, ...categoryPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
  }));
}
