import Image from "next/image";
import NextLink from "next/link";

import type { Product } from "@/lib/products";

type MedicalProductCardProps = {
  product: Product;
  tag: string;
};

export const MedicalProductCard = ({ product, tag }: MedicalProductCardProps) => (
  <article className="group relative flex h-96 flex-col justify-end overflow-hidden rounded-2xl">
    <Image
      alt={product.name}
      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
      fill
      sizes="(min-width: 640px) 320px, 280px"
      src={product.image!}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />

    <span className="absolute top-4 left-4 w-fit rounded-full bg-medical px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-medical-foreground">
      {tag}
    </span>

    <div className="relative p-5">
      <h3 className="mb-1 font-display text-lg font-bold text-white">
        {product.name}
      </h3>
      <p className="mb-4 line-clamp-2 text-sm leading-snug text-white/70">
        {product.description}
      </p>

      <div className="mb-4 border-t border-white/15 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
          {product.grade}
        </p>
      </div>

      {/* Single CTA — these are hand-authored product-line highlights for
          the Medical homepage (see medical-product-carousel.tsx), not real
          Sanity products, so there's no spec sheet to link to and no
          detail page they could point at (see CI-26). */}
      <NextLink
        className="inline-flex w-fit shrink-0 items-center rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-white/90"
        href="/contact"
      >
        Request Quote
      </NextLink>
    </div>
  </article>
);
