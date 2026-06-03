import Image from "next/image";
import NextLink from "next/link";

import { categories } from "@/lib/products";

export default function ProductsPage() {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Product Catalogue
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            All Products
          </h1>
          <p className="text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
            Explore our complete range of agricultural, medical, laboratory, and
            industrial chemical solutions. Contact us for specifications, pricing,
            and availability.
          </p>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-16 z-30 border-b border-separator bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <nav className="flex gap-0 overflow-x-auto">
            {categories.map((cat) => (
              <a
                key={cat.id}
                className="shrink-0 border-b-2 border-transparent px-4 py-4 font-mono text-sm font-medium uppercase tracking-wider text-muted transition-colors hover:text-foreground"
                href={`#${cat.id}`}
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
            key={cat.id}
            id={cat.id}
            className="border-b border-separator py-20"
          >
            <div className="mx-auto max-w-[1280px] px-6 lg:px-12">

              {/* Category header */}
              <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                    {String(catIndex + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                    {cat.label}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
                    {cat.description}
                  </p>
                </div>
                <NextLink
                  className="shrink-0 font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                  href={cat.href}
                >
                  View full range →
                </NextLink>
              </div>

              {/* Product grid */}
              <div className="grid grid-cols-1 gap-px bg-separator sm:grid-cols-2 lg:grid-cols-4">
                {cat.products.map((product) => (
                  <article
                    key={product.name}
                    className="flex flex-col bg-background"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        alt={product.name}
                        className="object-cover object-center transition-transform duration-500 hover:scale-105"
                        fill
                        src={cat.image}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      {/* Grade badge */}
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
                        <div className="flex flex-wrap gap-1.5">
                          {product.packSizes.map((size) => (
                            <span
                              key={size}
                              className="rounded-sm border border-separator px-2 py-0.5 font-mono text-xs text-muted"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <NextLink
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:text-accent/75"
                        href="/contact"
                      >
                        Request Quote
                        <span aria-hidden="true">→</span>
                      </NextLink>
                    </div>
                  </article>
                ))}
              </div>

            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="border-b border-separator bg-surface py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-1 text-xl font-bold tracking-tight text-foreground">
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
    </>
  );
}
