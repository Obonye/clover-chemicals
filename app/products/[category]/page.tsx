"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";

import { categories } from "@/lib/products";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.category as string;

  const active = categories.find((c) => c.id === slug);

  if (!active) {
    notFound();
    return null;
  }

  return (
    <>
      {/* Category hero */}
      <section className="relative -mt-16 flex min-h-[40vh] items-end overflow-hidden">
        <Image
          alt={active.label}
          className="object-cover object-center"
          fill
          priority
          src={active.image}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-12 pt-24 lg:px-12">
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
            {active.label}
          </h1>
          <p className="mt-3 text-base text-white/70" style={{ maxWidth: "52ch" }}>
            {active.description}
          </p>
        </div>
      </section>

      {/* Category filter tabs */}
      <div className="sticky top-16 z-30 border-b border-separator bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <nav className="flex overflow-x-auto">
            {categories.map((cat) => {
              const isActive = cat.id === slug;
              return (
                <NextLink
                  key={cat.id}
                  className={`shrink-0 border-b-2 px-4 py-4 font-mono text-sm font-medium uppercase tracking-wider transition-colors ${
                    isActive
                      ? "border-accent text-accent"
                      : "border-transparent text-muted hover:text-foreground"
                  }`}
                  href={`/products/${cat.id}`}
                >
                  {cat.label}
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
            {active.products.length} products
          </p>

          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {active.products.map((product) => (
              <article key={product.name} className="flex flex-col overflow-hidden rounded bg-background">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    alt={product.name}
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    fill
                    src={product.image ?? active.image}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <span className="mb-3 inline-block font-mono text-xs font-medium uppercase tracking-wider text-accent">
                    {product.grade}
                  </span>

                  <h2 className="mb-3 text-lg font-bold leading-snug tracking-tight text-foreground">
                    {product.name}
                  </h2>

                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                    {product.description}
                  </p>

                  {/* Pack sizes */}
                  <div className="mb-6 border-t border-separator pt-5">
                    <p className="mb-2 font-mono text-xs uppercase tracking-widest text-foreground/35">
                      Available Pack Sizes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.packSizes.map((size) => (
                        <span
                          key={size}
                          className="rounded-sm border border-separator px-2.5 py-1 font-mono text-xs text-muted"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <NextLink
                    className="inline-flex w-full items-center justify-center rounded border border-accent px-4 py-2.5 font-mono text-sm font-medium uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                    href="/contact"
                  >
                    Request a Quote
                  </NextLink>
                </div>
              </article>
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
                We source on request. Speak to our technical team about custom
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
