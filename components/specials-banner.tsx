import Image from "next/image";
import NextLink from "next/link";

import { loadQuery } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { ACTIVE_PROMOTION_QUERY } from "@/sanity/lib/queries";
import type { Promotion } from "@/sanity/lib/types";

export const SpecialsBanner = async () => {
  const promotion = await loadQuery<Promotion | null>(ACTIVE_PROMOTION_QUERY, {
    params: { division: "chemicals" },
  });

  if (!promotion) return null;

  const validUntil = promotion.endDate
    ? new Date(promotion.endDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Africa/Gaborone",
      })
    : null;
  const bannerImage = imageUrl(promotion.image, { width: 1200, height: 600 });

  return (
    <section className="bg-background py-12">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid overflow-hidden rounded-lg bg-surface lg:grid-cols-2">
          {/* Dither filter def — black-and-white posterize */}
          <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
            <filter colorInterpolationFilters="sRGB" id="sale-dither">
              <feColorMatrix
                type="matrix"
                values="0.3 0.3 0.3 0 0
                        0.3 0.3 0.3 0 0
                        0.3 0.3 0.3 0 0
                        0   0   0   1 0"
              />
              <feComponentTransfer>
                <feFuncR tableValues="0 0.25 0.5 0.75 1" type="discrete" />
                <feFuncG tableValues="0 0.25 0.5 0.75 1" type="discrete" />
                <feFuncB tableValues="0 0.25 0.5 0.75 1" type="discrete" />
              </feComponentTransfer>
            </filter>
          </svg>

          {/* Image */}
          <div className="relative h-64 lg:h-auto">
            <Image
              alt={promotion.image?.alt ?? promotion.headline ?? "Current specials"}
              className="object-cover object-center"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={bannerImage ?? "/CTA/sale.jpg"}
              style={{ filter: "url(#sale-dither) contrast(1.1)" }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-block w-fit rounded-sm bg-specials px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-specials-foreground">
                Current Specials
              </span>
              {validUntil && (
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  Valid until {validUntil}
                </span>
              )}
            </div>

            <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
              {promotion.headline}
            </h3>

            {promotion.description && (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
                {promotion.description}
              </p>
            )}

            <NextLink
              className="mt-6 inline-flex w-fit items-center gap-1.5 rounded bg-specials px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-specials-foreground transition-colors hover:bg-specials/90"
              href="/products?promotion=true"
            >
              Browse Products
              <span aria-hidden="true">→</span>
            </NextLink>
          </div>
        </div>
      </div>
    </section>
  );
};
