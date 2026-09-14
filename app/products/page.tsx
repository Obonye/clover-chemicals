import NextLink from "next/link";
import { stegaClean } from "next-sanity";

import { ProductCard } from "@/components/product-card";
import { loadQuery } from "@/sanity/lib/fetch";
import { ALL_PRODUCTS_QUERY, CATALOGUE_QUERY } from "@/sanity/lib/queries";
import type { CategoryWithProducts, ProductWithCategory } from "@/sanity/lib/types";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  if (query) {
    const products =
      await loadQuery<ProductWithCategory[]>(ALL_PRODUCTS_QUERY);
    const needle = query.toLowerCase();

    const results = products.filter((product) => {
      const haystack = stegaClean(
        `${product.name ?? ""} ${product.description ?? ""} ${
          product.category?.label ?? ""
        }`,
      ).toLowerCase();

      return haystack.includes(needle);
    });

    return (
      <>
        <PageHeader />
        <section className="bg-background">
          <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
            <div className="mb-10 flex flex-col gap-2 border-b border-separator pb-8 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-sm text-muted">
                {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                <span className="font-semibold text-foreground">
                  &quot;{query}&quot;
                </span>
              </p>
              <NextLink
                className="font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                href="/products"
              >
                Clear search
              </NextLink>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((product) => (
                  <ProductCard
                    key={product._id}
                    category={
                      product.category ?? {
                        label: null,
                        slug: null,
                        image: null,
                      }
                    }
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4 py-4">
                <p className="text-base text-muted">
                  No products matched &quot;{query}&quot;. Try a different term,
                  or speak to our technical team about custom sourcing.
                </p>
                <NextLink
                  className="font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                  href="/contact"
                >
                  Contact Us →
                </NextLink>
              </div>
            )}
          </div>
        </section>
        <BottomCta />
      </>
    );
  }

  const categories =
    await loadQuery<CategoryWithProducts[]>(CATALOGUE_QUERY);

  return (
    <>
      <PageHeader />

      {/* Sticky category nav */}
      <div className="sticky top-24 z-30 border-b border-separator bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <nav className="flex gap-0 overflow-x-auto">
            {categories.map((cat) => (
              <a
                key={cat._id}
                className="shrink-0 border-b-2 border-transparent px-4 py-4 font-mono text-sm font-medium uppercase tracking-wider text-muted transition-colors hover:text-foreground"
                href={`#${stegaClean(cat.slug ?? cat._id)}`}
              >
                {cat.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Category sections */}
      <div className="bg-background">
        {categories.map((cat, catIndex) => (
          <section
            key={cat._id}
            id={stegaClean(cat.slug ?? cat._id)}
            className="border-b border-separator py-20"
          >
            <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
              <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                    {String(catIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
                    {cat.label}
                  </h2>
                  <p
                    className="text-sm leading-relaxed text-muted"
                    style={{ maxWidth: "52ch" }}
                  >
                    {cat.description}
                  </p>
                </div>
                <NextLink
                  className="shrink-0 font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                  href={`/products/${stegaClean(cat.slug ?? "")}`}
                >
                  View full range →
                </NextLink>
              </div>

              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
                {cat.products.map((product) => (
                  <ProductCard
                    key={product._id}
                    category={cat}
                    eyebrow={product.grade}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <BottomCta />
    </>
  );
}

function PageHeader() {
  return (
    <section className="border-b border-separator bg-background">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Product Catalogue
        </p>
        <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
          All Products
        </h1>
        <p
          className="text-base leading-relaxed text-muted"
          style={{ maxWidth: "52ch" }}
        >
          Explore our complete range of agricultural, medical, laboratory, and
          industrial chemical solutions. Contact us for specifications, pricing,
          and availability.
        </p>
      </div>
    </section>
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
