import Image from "next/image";
import NextLink from "next/link";

import { ProductCard } from "@/components/product-card";
import { getBranch } from "@/config/branches";
import { isCatalogEnabled } from "@/lib/catalog/visibility";
import { loadCatalogQuery } from "@/sanity/lib/fetch";
import { ALL_PRODUCTS_QUERY } from "@/sanity/lib/queries";
import type { ProductWithCategory } from "@/sanity/lib/types";
import type { DivisionConfig } from "@/config/divisions";

type GenericDivisionHomeProps = {
  division: DivisionConfig;
};

// Fallback home for any division added to config/divisions.ts that has no
// bespoke composition wired into app/[division]/page.tsx's HOME_COMPONENTS —
// built entirely from that entry's own fields, so a new division gets a
// working home page with zero other code changes.
export async function GenericDivisionHome({ division }: GenericDivisionHomeProps) {
  // Rendered per request: the flag decides which product surfaces exist (CI-72).
  const catalogEnabled = await isCatalogEnabled();
  const allProducts = catalogEnabled ? await loadCatalogQuery<ProductWithCategory[]>(ALL_PRODUCTS_QUERY) : [];
  const products = allProducts
    .filter((product) => product.category?.division === division.sanityDivision && product.category.catalogReady === true)
    .slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[var(--navbar-h)] flex min-h-[55vh] items-end overflow-hidden">
        <Image
          alt={division.name}
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src={division.image}
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-16 pt-[var(--header-h)] lg:px-12">
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-white lg:text-5xl" style={{ maxWidth: "20ch" }}>
            {division.name}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-white/75">
            {division.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {catalogEnabled && (
              <NextLink
                className="rounded bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
                href={`/${division.slug}/products`}
              >
                Browse Products
              </NextLink>
            )}
            <NextLink
              className="rounded border-2 border-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
              href="/contact"
            >
              Get a Quote
            </NextLink>
          </div>
        </div>
      </section>

      {/* Products teaser */}
      {products.length > 0 && (
        <section className="border-b border-separator bg-background py-20">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                Products
              </h2>
              <NextLink
                className="hidden shrink-0 font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75 sm:block"
                href={`/${division.slug}/products`}
              >
                View all →
              </NextLink>
            </div>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  category={product.category ?? { label: null, slug: null, image: null }}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacts & branches */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            <div>
              <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
                Contacts
              </p>
              <ul className="flex flex-col gap-3">
                {division.contacts.map((contact) => (
                  <li key={contact.email}>
                    <p className="mb-1 text-sm font-semibold text-foreground">{contact.label}</p>
                    <a
                      className="text-sm text-muted transition-colors hover:text-accent"
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
                Branches
              </p>
              <ul className="flex flex-col gap-2">
                {division.branches.map((slug) => {
                  const branch = getBranch(slug);

                  if (!branch) return null;

                  return (
                    <li key={slug}>
                      <NextLink
                        className="text-sm text-muted transition-colors hover:text-accent"
                        href={`/locations#${branch.slug}`}
                      >
                        {branch.name}
                      </NextLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
