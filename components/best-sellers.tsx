import Image from "next/image";
import NextLink from "next/link";

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
        <div className="grid grid-cols-1 gap-px bg-separator sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(({ category, product }) => (
            <article className="flex flex-col bg-background" key={product.name}>
              {/* Image — links to the product's category */}
              <NextLink
                className="relative block h-48 overflow-hidden"
                href={category.href}
              >
                <Image
                  alt={product.name}
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  fill
                  src={product.image ?? category.image}
                />
              </NextLink>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <span className="mb-3 inline-block font-mono text-xs font-medium uppercase tracking-wider text-accent">
                  {product.grade}
                </span>

                <h3 className="mb-2 text-base font-bold leading-snug tracking-tight text-foreground">
                  {product.name}
                </h3>

                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>

                {/* Pack sizes */}
                <div className="mb-5 border-t border-separator pt-4">
                  <p className="mb-1.5 font-mono text-xs uppercase tracking-widest text-foreground/30">
                    Pack Sizes
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {product.packSizes.join(" / ")}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <NextLink
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:text-accent/75"
                    href="/contact"
                  >
                    Request Quote
                    <span aria-hidden="true">→</span>
                  </NextLink>

                  <span aria-hidden="true" className="h-3 w-px bg-separator" />

                  <NextLink
                    className="font-mono text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:text-foreground"
                    href="#"
                  >
                    Spec Sheet
                  </NextLink>
                </div>
              </div>
            </article>
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
