import { notFound } from "next/navigation";

import { ProductCatalogue } from "@/components/product-catalogue";
import { getDivision } from "@/config/divisions";
import { loadQuery } from "@/sanity/lib/fetch";
import { ALL_PRODUCTS_QUERY, CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory, ProductWithCategory } from "@/sanity/lib/types";

type Props = {
  params: Promise<{ division: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    promotion?: string;
    sort?: string;
  }>;
};

export default async function DivisionProductsPage({ params, searchParams }: Props) {
  const [{ division: slug }, sp] = await Promise.all([params, searchParams]);
  const division = getDivision(slug);

  if (!division) notFound();

  const [products, categories] = await Promise.all([
    loadQuery<ProductWithCategory[]>(ALL_PRODUCTS_QUERY),
    loadQuery<ProductCategory[]>(CATEGORIES_QUERY),
  ]);

  return (
    <>
      {/* Visually hidden — keeps a page heading for a11y/SEO without adding
          a headline block; mirrors app/products/page.tsx. */}
      <h1 className="sr-only">{division.name} Products</h1>
      <ProductCatalogue
        basePath={`/${division.slug}/products`}
        categories={categories}
        initialCategory={sp.category ?? "all"}
        initialOnPromotion={sp.promotion === "true"}
        initialQuery={sp.q ?? ""}
        initialSort={sp.sort ?? "name"}
        lockedDivision={division.sanityDivision}
        products={products}
      />
    </>
  );
}
