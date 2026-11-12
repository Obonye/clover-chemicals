import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { CategoryDirectory } from "@/components/category-directory";
import { ProductCatalogue } from "@/components/product-catalogue";
import { getDivision } from "@/config/divisions";
import { getCatalog } from "@/lib/catalog/visibility";
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

// Overrides the division layout's own canonical (its home page's), since
// every ?q=/?category=/?promotion=/?sort= combination here is still the
// same logical listing page — not the division home.
export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { division: slug } = await params;
  const division = getDivision(slug);

  if (!division) return {};

  return {
    title: "Products",
    alternates: {
      canonical: `/${division.slug}/products`,
    },
  };
}

export default async function DivisionProductsPage({ params, searchParams }: Props) {
  const [{ division: slug }, sp] = await Promise.all([params, searchParams]);
  const division = getDivision(slug);

  if (!division) notFound();

  const catalog = await getCatalog();
  const allCategories = await loadQuery<ProductCategory[]>(CATEGORIES_QUERY);

  // Products hidden, or on but none of this division's categories is ready
  // yet: just its ranges, each leading to a quote request.
  const divisionCategories = allCategories.filter((category) => category.division === division.sanityDivision);

  if (!catalog.enabled || !divisionCategories.some((category) => catalog.isBrowsable(category))) {
    return (
      <CategoryDirectory
        heading={`${division.name} product ranges`}
        items={divisionCategories.map((category) => ({ category, href: catalog.hrefFor(category) }))}
      />
    );
  }

  // Only categories marked ready show their products.
  const categories = allCategories.filter((category) => catalog.isBrowsable(category));
  const products = (await loadQuery<ProductWithCategory[]>(ALL_PRODUCTS_QUERY)).filter((product) =>
    catalog.isBrowsable(product.category),
  );

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
