import type { ReactNode } from "react";

import Image from "next/image";
import NextLink from "next/link";

import { DocumentIcon } from "@/components/icons";
import { imageUrl } from "@/sanity/lib/image";
import { categoryHref, packLabel, productHref } from "@/sanity/lib/format";
import type { Product, ProductCategory } from "@/sanity/lib/types";

const ArrowRightIcon = () => (
  <svg
    fill="none"
    height={14}
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
    width={14}
  >
    <path
      d="M5 12h14M13 6l6 6-6 6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type ProductCardProps = {
  product: Product;
  category: Pick<ProductCategory, "label" | "slug" | "image">;
  /** Small label above the product name. Defaults to the category name. */
  eyebrow?: ReactNode;
};

export const ProductCard = ({ product, category, eyebrow }: ProductCardProps) => {
  const detailHref = productHref(category.slug, product.slug);
  const src =
    imageUrl(product.image, { width: 600, height: 360 }) ??
    imageUrl(category.image, { width: 600, height: 360 });
  const packSizes = (product.packSizes ?? []).filter((size) => packLabel(size));

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-separator bg-surface transition-shadow duration-200 hover:shadow-md">
      {/* Image — links to the product's own detail page */}
      <NextLink
        className="relative block h-44 shrink-0 overflow-hidden bg-surface-secondary"
        href={detailHref}
      >
        {product.isOnPromotion && (
          <span className="absolute left-3 top-3 z-10 rounded-sm bg-specials px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-specials-foreground">
            On Promotion
          </span>
        )}
        {src ? (
          <Image
            alt={product.image?.alt ?? product.name ?? ""}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            src={src}
          />
        ) : null}
      </NextLink>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <NextLink
          className="mb-2 inline-block w-fit font-mono text-[10px] font-semibold uppercase tracking-wider text-accent transition-colors hover:text-accent/80"
          href={categoryHref(category.slug)}
        >
          {eyebrow ?? category.label}
        </NextLink>

        <h3 className="mb-1 text-base font-bold leading-snug tracking-tight text-foreground">
          <NextLink className="hover:text-accent" href={detailHref}>
            {product.name}
          </NextLink>
        </h3>

        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {product.description}
        </p>

        {/* Grade + pack sizes */}
        <div className="mb-4 border-t border-separator pt-4">
          <p className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/30">
            {product.grade}
          </p>
          {packSizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {packSizes.map((size) => (
                <span
                  key={size._key}
                  className="rounded-sm border border-separator px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {packLabel(size)}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTAs — side by side */}
        <div className="flex items-center justify-between">
          <NextLink
            className="inline-flex shrink-0 items-center gap-1.5 rounded border border-accent px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
            href="/contact"
          >
            Quote
            <ArrowRightIcon />
          </NextLink>

          <NextLink
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-muted transition-colors hover:text-foreground"
            href={detailHref}
          >
            <DocumentIcon />
            View Details
          </NextLink>
        </div>
      </div>
    </article>
  );
};
