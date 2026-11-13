import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { CategoryDirectory } from "@/components/category-directory";
import { ProductCatalogue } from "@/components/product-catalogue";
import { RangeQuotePanel } from "@/components/rfq/range-quote-panel";
import { getDivision } from "@/config/divisions";
import { getCatalog } from "@/lib/catalog/visibility";
import { pendingRanges } from "@/lib/catalog/pending";
import { loadCatalogQuery } from "@/sanity/lib/fetch";
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
  const allCategories = await loadCatalogQuery<ProductCategory[]>(CATEGORIES_QUERY);

  // Products hidden, or on but none of this division's categories is ready
  // yet: just its ranges, each leading to a quote request.
  const divisionCategories = allCategories.filter((category) => category.division === division.sanityDivision);
  const listingBase = `/${division.slug}/products`;
  // Ranges not listed yet: offered as "add to my quote" instead of products.
  const pending = pendingRanges(divisionCategories, catalog.isBrowsable);
  const chosen = pending.find((category) => category.slug === sp.category);

  if (!catalog.enabled || !divisionCategories.some((category) => catalog.isBrowsable(category))) {
    return (
      <>
        {chosen && (
          <section className="bg-background pt-12">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
              <RangeQuotePanel name={chosen.label ?? "this range"} slug={chosen.slug ?? ""} />
            </div>
          </section>
        )}
        <CategoryDirectory
          heading={`${division.name} product ranges`}
          items={divisionCategories.map((category) => ({ category, href: catalog.hrefFor(category, listingBase) }))}
        />
      </>
    );
  }

  // Only categories marked ready show their products.
  const categories = allCategories.filter((category) => catalog.isBrowsable(category));
  const products = (await loadCatalogQuery<ProductWithCategory[]>(ALL_PRODUCTS_QUERY)).filter((product) =>
    catalog.isBrowsable(product.category),
  );

  return (
    <>
      {/* Visually hidden — keeps a page heading for a11y/SEO without adding
          a headline block; mirrors app/products/page.tsx. */}
      <h1 className="sr-only">{division.name} Products</h1>
      <ProductCatalogue
        basePath={listingBase}
        categories={categories}
        initialCategory={sp.category ?? "all"}
        initialOnPromotion={sp.promotion === "true"}
        initialQuery={sp.q ?? ""}
        initialSort={sp.sort ?? "name"}
        lockedDivision={division.sanityDivision}
        pendingCategories={pending}
        products={products}
      />
    </>
  );
}
