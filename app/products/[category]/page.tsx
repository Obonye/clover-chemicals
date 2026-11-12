import type { Metadata } from "next";

import { notFound } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { stegaClean } from "next-sanity";

import { ProductCard } from "@/components/product-card";
import { loadQuery } from "@/sanity/lib/fetch";
import {
  CATEGORIES_QUERY,
  CATEGORY_QUERY,
  CATEGORY_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { imageUrl } from "@/sanity/lib/image";
import type { CategoryWithProducts, ProductCategory } from "@/sanity/lib/types";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const slugs = await loadQuery<{ slug: string | null }[]>(CATEGORY_SLUGS_QUERY, {
    perspective: "published",
    stega: false,
  });

  return slugs
    .map((c) => c.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const data = await loadQuery<CategoryWithProducts | null>(CATEGORY_QUERY, {
    params: { slug: category },
    stega: false,
  });

  if (!data) return {};

  return {
    title: data.label ?? "Products",
    description: data.description ?? undefined,
    // The canonical, unfiltered landing page for this category — distinct
    // from /products?category=<slug>, the same listing pre-filtered from
    // the unified catalogue, which points its own canonical back here.
    alternates: {
      canonical: `/products/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const [active, allCategories] = await Promise.all([
    loadQuery<CategoryWithProducts | null>(CATEGORY_QUERY, {
      params: { slug: category },
    }),
    loadQuery<ProductCategory[]>(CATEGORIES_QUERY),
  ]);

  if (!active) notFound();

  const cat = active;
  const categories = allCategories;
  const heroSrc = imageUrl(cat.image, { width: 1920, height: 900 });

  return (
    <>
      {/* Category hero */}
      <section className="relative -mt-[var(--navbar-h)] flex min-h-[40vh] items-end overflow-hidden">
        {heroSrc && (
          <Image
            alt={cat.image?.alt ?? cat.label ?? ""}
            className="object-cover object-center"
            fill
            priority
            sizes="100vw"
            src={heroSrc}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-12 pt-[var(--header-h)] lg:px-12">
          <NextLink
            className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 transition-colors hover:text-white/80"
            href="/products"
          >
            ← All Products
          </NextLink>
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Product Range
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
            {cat.label}
          </h1>
          <p className="mt-3 text-base text-white/70" style={{ maxWidth: "52ch" }}>
            {cat.description}
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <div className="sticky top-[var(--header-h)] z-30 border-b border-separator bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <nav className="flex overflow-x-auto">
            {categories.map((tab) => {
              const isActive = stegaClean(tab.slug ?? "") === category;

              return (
                <NextLink
                  key={tab._id}
                  className={`shrink-0 border-b-2 px-4 py-4 font-mono text-sm font-medium uppercase tracking-wider transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                  href={`/products/${stegaClean(tab.slug ?? "")}`}
                >
                  {tab.label}
                </NextLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Product grid */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-8 font-mono text-xs uppercase tracking-widest text-muted">
            {cat.products.length} products
          </p>

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

      {/* Bottom CTA */}
      <section className="border-t border-separator bg-surface py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-1 font-display text-xl font-extrabold tracking-tight text-foreground">
                Need something specific?
              </h2>
              <p className="text-sm text-muted">
                We source on request. Speak to our team about custom
                grades, pack sizes, and specialist procurement.
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
    </>
  );
}
