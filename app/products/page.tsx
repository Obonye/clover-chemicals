import NextLink from "next/link";

import { ProductCatalogue } from "@/components/product-catalogue";
import { loadQuery } from "@/sanity/lib/fetch";
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

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    loadQuery<ProductWithCategory[]>(ALL_PRODUCTS_QUERY),
    loadQuery<ProductCategory[]>(CATEGORIES_QUERY),
  ]);

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
              We source on request. Speak to our technical team about custom
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
