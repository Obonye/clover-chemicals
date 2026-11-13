import type { Metadata } from "next";

import NextLink from "next/link";

import { CategoryDirectory } from "@/components/category-directory";
import { ProductCatalogue } from "@/components/product-catalogue";
import { RangeQuotePanel } from "@/components/rfq/range-quote-panel";
import { getCatalog } from "@/lib/catalog/visibility";
import { pendingRanges } from "@/lib/catalog/pending";
import { loadCatalogQuery } from "@/sanity/lib/fetch";
import { ALL_PRODUCTS_QUERY, CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory, ProductWithCategory } from "@/sanity/lib/types";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    division?: string;
    promotion?: string;
    sort?: string;
  }>;
};

// Every ?q=/?category=/?promotion=/?sort= combination is the same logical
// listing page for search engines — point them all at the clean URL rather
// than indexing one canonical per filter combination.
export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse the full Clover Industries catalogue — chemicals, equipment, PPE, and medical and laboratory supplies across every division.",
  alternates: {
    canonical: "/products",
  },
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const catalog = await getCatalog();
  const allCategories = await loadCatalogQuery<ProductCategory[]>(CATEGORIES_QUERY);
  // Ranges not listed yet: offered as "add to my quote" instead of products.
  const pending = pendingRanges(allCategories, catalog.isBrowsable);
  const chosen = pending.find((category) => category.slug === params.category);

  // Products hidden, or on but no category is ready yet: just the ranges,
  // each leading to a quote request.
  if (!catalog.enabled || !allCategories.some((category) => catalog.isBrowsable(category))) {
    return (
      <>
        {chosen && (
          <section className="bg-background pt-12">
            <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
              <RangeQuotePanel description={chosen.description} name={chosen.label ?? "this range"} slug={chosen.slug ?? ""} />
            </div>
          </section>
        )}
        <CategoryDirectory
          heading="Our product ranges"
          items={allCategories.map((category) => ({ category, href: catalog.hrefFor(category) }))}
        />
        <BottomCta />
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
      {/* Visually hidden — keeps a page heading for a11y/SEO without the
          headline block the page no longer shows. */}
      <h1 className="sr-only">All Products</h1>
      <ProductCatalogue
        categories={categories}
        initialCategory={params.category ?? "all"}
        initialDivision={params.division ?? "all"}
        initialOnPromotion={params.promotion === "true"}
        initialQuery={params.q ?? ""}
        initialSort={params.sort ?? "name"}
        pendingCategories={pending}
        products={products}
      />
      <BottomCta />
    </>
  );
}

function BottomCta() {
  return (
    <section className="border-b border-separator bg-surface py-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-1 font-display text-xl font-extrabold tracking-tight text-foreground">
              Can&apos;t find what you need?
            </h2>
            <p className="text-sm text-muted">
              We source on request. Speak to our team about custom
              formulations and specialist procurement.
            </p>
          </div>
          <NextLink
            className="shrink-0 rounded bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
            href="/contact"
          >
            Contact Us
          </NextLink>
        </div>
      </div>
    </section>
  );
}
