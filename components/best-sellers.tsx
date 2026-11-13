import NextLink from "next/link";

import { ProductCard } from "@/components/product-card";
import { loadCatalogQuery } from "@/sanity/lib/fetch";
import { HOMEPAGE_FEATURED_QUERY } from "@/sanity/lib/queries";
import type { ProductWithCategory } from "@/sanity/lib/types";

export const BestSellers = async () => {
  const featured =
    (await loadCatalogQuery<ProductWithCategory[] | null>(HOMEPAGE_FEATURED_QUERY, {
      params: { id: "homepage-chemicals" },
    })) ?? [];

  if (featured.length === 0) return null;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              Popular.
            </h2>
          </div>
          <NextLink
            className="hidden text-sm font-semibold uppercase tracking-widest text-muted transition-colors duration-200 hover:text-accent md:block"
            href="/products"
          >
            View full catalogue →
          </NextLink>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product._id}
              category={
                product.category ?? { label: null, slug: null, image: null }
              }
              product={product}
            />
          ))}
        </div>

        {/* Mobile view-all */}
        <div className="mt-8 md:hidden">
          <NextLink
            className="text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:text-foreground"
            href="/products"
          >
            View full catalogue →
          </NextLink>
        </div>
      </div>
    </section>
  );
};
