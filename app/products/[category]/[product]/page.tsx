import type { Metadata } from "next";

import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";

import { BodyTheme } from "@/components/body-theme";
import { DocumentIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { AddToRfq } from "@/components/rfq/add-to-rfq";
import { divisionCssVars, getDivisionBySanityValue } from "@/config/divisions";
import { getCatalog } from "@/lib/catalog/visibility";
import { loadQuery } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { documentDownloadHref, documentLabel, formatFileSize, packLabel } from "@/sanity/lib/format";
import { CATEGORY_QUERY, PRODUCT_QUERY, PRODUCT_SLUGS_QUERY } from "@/sanity/lib/queries";
import type { CategoryWithProducts, ProductDetail, ProductDocument } from "@/sanity/lib/types";

const formatRevisionDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const DocumentsSection = ({ documents }: { documents: ProductDocument[] }) => (
  <section aria-labelledby="documents-heading" className="scroll-mt-[var(--header-h)] border-t border-separator bg-background py-12" id="documents">
    <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
      <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight text-heading" id="documents-heading">
        Documents
      </h2>
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {documents.map((doc) => {
          const meta = [
            doc.revisionDate && `Revised ${formatRevisionDate(doc.revisionDate)}`,
            doc.language,
            formatFileSize(doc.size),
            "PDF",
          ].filter(Boolean);

          return (
            <li key={doc._key}>
              <a
                className="group flex min-h-16 items-center gap-4 rounded-xl border border-separator bg-surface px-4 py-3 transition-colors hover:border-accent"
                download
                href={documentDownloadHref(doc)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-xl text-accent-soft-foreground">
                  <DocumentIcon />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground group-hover:text-accent">
                    {documentLabel(doc)}
                  </span>
                  <span className="block font-mono text-xs text-muted">{meta.join(" · ")}</span>
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  Download
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

type Props = {
  params: Promise<{ category: string; product: string }>;
};

export async function generateStaticParams() {
  const slugs = await loadQuery<{ category: string | null; product: string | null }[]>(
    PRODUCT_SLUGS_QUERY,
    { perspective: "published", stega: false },
  );

  return slugs
    .filter(
      (s): s is { category: string; product: string } => Boolean(s.category) && Boolean(s.product),
    )
    .map((s) => ({ category: s.category, product: s.product }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product: productSlug } = await params;
  const product = await loadQuery<ProductDetail | null>(PRODUCT_QUERY, {
    params: { slug: productSlug },
    stega: false,
  });

  if (!product) return {};

  const categorySlug = product.category?.slug ?? category;
  const ogImage = imageUrl(product.image, { width: 1200, height: 630 });

  return {
    title: `${product.name} (${product.grade}) | ${product.category?.label ?? "Products"}`,
    description: product.description ?? undefined,
    alternates: {
      canonical: `/products/${categorySlug}/${productSlug}`,
    },
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, product: productSlug } = await params;

  const product = await loadQuery<ProductDetail | null>(PRODUCT_QUERY, {
    params: { slug: productSlug },
  });

  if (!product) notFound();

  // Hidden or not-yet-ready: send the visitor to the RFQ for that category,
  // before anything about the product is rendered. Temporary (307) so it
  // isn't cached for after launch (CI-71).
  const catalog = await getCatalog();

  if (!catalog.isBrowsable(product.category)) redirect(catalog.hrefFor(product.category ?? {}));

  const categorySlug = product.category?.slug;

  // The URL's category segment is only ever a display/breadcrumb concern —
  // the product itself is looked up by slug alone (see PRODUCT_QUERY). If
  // a link (old, shared, or just mistyped) names the wrong category,
  // redirect to the real one instead of 404ing on a product that exists.
  if (categorySlug && categorySlug !== category) {
    redirect(`/products/${categorySlug}/${productSlug}`);
  }

  const division = product.category?.division
    ? getDivisionBySanityValue(product.category.division)
    : undefined;

  const relatedCategory = categorySlug
    ? await loadQuery<CategoryWithProducts | null>(CATEGORY_QUERY, {
        params: { slug: categorySlug },
      })
    : null;
  const relatedProducts = (relatedCategory?.products ?? [])
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  const heroSrc =
    imageUrl(product.image, { width: 900, height: 900 }) ??
    imageUrl(product.category?.image ?? null, { width: 900, height: 900 });
  const packSizes = (product.packSizes ?? []).filter((size) => packLabel(size));
  const documents = product.documents ?? [];
  const quoteHref = `/contact?product=${encodeURIComponent(productSlug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: heroSrc ?? undefined,
    sku: product.slug,
    category: product.category?.label ?? undefined,
    // No `offers` — Clover doesn't publish fixed prices; see CI-26.
  };

  const themeVars = divisionCssVars(division?.theme);

  return (
    <div style={themeVars}>
      {division?.theme && <BodyTheme vars={themeVars} />}
      {/* eslint-disable-next-line react/no-danger */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />

      {/* Breadcrumb */}
      <div className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 pt-[var(--header-h)] pb-4 lg:px-12">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
            <NextLink className="transition-colors hover:text-foreground" href="/products">
              Products
            </NextLink>
            <span aria-hidden="true">/</span>
            {product.category && (
              <>
                <NextLink
                  className="transition-colors hover:text-foreground"
                  href={`/products/${categorySlug}`}
                >
                  {product.category.label}
                </NextLink>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-secondary">
              {product.isOnPromotion && (
                <span className="absolute left-4 top-4 z-10 rounded-sm bg-specials px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-specials-foreground">
                  On Promotion
                </span>
              )}
              {heroSrc ? (
                <Image
                  alt={product.image?.alt ?? product.name ?? ""}
                  className="object-cover object-center"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  src={heroSrc}
                />
              ) : null}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              {product.tag && (
                <span className="mb-3 inline-block w-fit rounded-sm bg-accent-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-soft-foreground">
                  {product.tag}
                </span>
              )}

              <h1 className="mb-2 font-display text-3xl font-extrabold tracking-tight text-heading lg:text-4xl">
                {product.name}
              </h1>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-muted">
                  {product.grade}
                </p>
                {product.available !== null && (
                  <span
                    className={`font-mono text-xs font-semibold uppercase tracking-widest ${
                      product.available ? "text-accent" : "text-muted"
                    }`}
                  >
                    {product.available ? "Available to Order" : "Contact for Availability"}
                  </span>
                )}
              </div>

              <p className="mb-8 text-base leading-relaxed text-muted">{product.description}</p>

              {packSizes.length > 0 && (
                <div className="mb-8">
                  <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
                    Pack Sizes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {packSizes.map((size) => (
                      <span
                        key={size._key}
                        className="rounded-sm border border-separator px-3 py-1.5 font-mono text-sm text-foreground"
                      >
                        {packLabel(size)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex max-w-md flex-col gap-3">
                <AddToRfq division={product.category?.division} product={product} size="lg" />
                <NextLink
                  className="w-fit text-sm text-muted underline-offset-2 hover:text-foreground hover:underline"
                  href={quoteHref}
                >
                  Or send a one-off enquiry about this product
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {documents.length > 0 && <DocumentsSection documents={documents} />}

      {/* Related products */}
      {relatedProducts.length > 0 && relatedCategory && (
        <section className="border-t border-separator bg-surface py-16">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
            <h2 className="mb-8 font-display text-2xl font-extrabold tracking-tight text-heading">
              More in {relatedCategory.label}
            </h2>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <ProductCard key={related._id} category={relatedCategory} product={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
