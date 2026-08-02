import type { ReactNode } from "react";

import Image from "next/image";
import NextLink from "next/link";

import { DocumentIcon } from "@/components/icons";
import type { Category, Product } from "@/lib/products";

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
  category: Category;
  /** Small label above the product name. Defaults to the category name. */
  eyebrow?: ReactNode;
};

export const ProductCard = ({ product, category, eyebrow }: ProductCardProps) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl border border-separator bg-surface transition-shadow duration-200 hover:shadow-md">
    {/* Image — links to the product's category */}
    <NextLink
      className="relative block h-44 shrink-0 overflow-hidden bg-surface-secondary"
      href={category.href}
    >
      <Image
        alt={product.name}
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        fill
        src={product.image ?? category.image}
      />
    </NextLink>

    {/* Content */}
    <div className="flex flex-1 flex-col p-5">
      <span className="mb-2 inline-block w-fit font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
        {eyebrow ?? category.label}
      </span>

      <h3 className="mb-1 text-base font-bold leading-snug tracking-tight text-foreground">
        {product.name}
      </h3>

      <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
        {product.description}
      </p>

      {/* Grade + pack sizes */}
      <div className="mb-4 border-t border-separator pt-4">
        <p className="mb-0.5 font-mono text-[10px] uppercase tracking-widest text-foreground/30">
          {product.grade}
        </p>
        <p className="font-mono text-xs text-muted">
          {product.packSizes.join(" / ")}
        </p>
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
          href="#"
        >
          <DocumentIcon />
          Spec Sheet
        </NextLink>
      </div>
    </div>
  </article>
);
