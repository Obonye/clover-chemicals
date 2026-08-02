import NextLink from "next/link";

import { ProductCard } from "@/components/product-card";
import { getCategoryById } from "@/lib/products";

const featured = [
  { categoryId: "agro", productName: "Clover Pure Lawn" },
  { categoryId: "medical", productName: "Isopropyl Alcohol 70%" },
  { categoryId: "laboratory", productName: "Hydrochloric Acid 37%" },
  { categoryId: "industrial", productName: "Clover Multi-Surface Cleaner" },
]
  .map(({ categoryId, productName }) => {
    const category = getCategoryById(categoryId);
    const product = category?.products.find((p) => p.name === productName);

    return category && product ? { category, product } : null;
  })
  .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

export const BestSellers = () => {
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
          {featured.map(({ category, product }) => (
            <ProductCard category={category} key={product.name} product={product} />
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
