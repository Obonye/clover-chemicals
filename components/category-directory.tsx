import Image from "next/image";
import NextLink from "next/link";

import { imageUrl } from "@/sanity/lib/image";
import type { ProductCategory } from "@/sanity/lib/types";

export type CategoryDirectoryItem = {
  category: ProductCategory;
  /** Where the card goes: the listing when browsable, otherwise the RFQ. */
  href: string;
};

type CategoryDirectoryProps = {
  heading: string;
  items: CategoryDirectoryItem[];
};

/**
 * The product ranges as plain cards, with no product listing behind them.
 * Shown in place of the catalogue while products are hidden: each card
 * leads to a quote request for that range (CI-71).
 */
export const CategoryDirectory = ({ heading, items }: CategoryDirectoryProps) => (
  <section className="bg-background py-12 lg:py-16">
    <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{heading}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
        Choose a range and tell us what you need. We quote every request individually and reply within one business
        day.
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-px bg-separator sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ category, href }) => {
          const src = imageUrl(category.image, { width: 800, height: 520 });

          return (
            <li key={category._id} className="bg-background">
              <NextLink className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden p-6" href={href}>
                {src && (
                  <Image
                    alt=""
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={src}
                  />
                )}
                <div className="absolute inset-0 bg-black/60 transition-colors duration-300 group-hover:bg-black/70" />
                <div className="relative z-10">
                  <h2 className="font-display text-xl font-extrabold tracking-tight text-white">{category.label}</h2>
                  {category.description && (
                    <p className="mt-1 line-clamp-2 text-sm leading-snug text-white/75">{category.description}</p>
                  )}
                  <span className="mt-3 inline-block font-mono text-xs font-medium uppercase tracking-widest text-white">
                    Request a quote →
                  </span>
                </div>
              </NextLink>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);
