"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";

import { rfqEntryHref } from "@/lib/catalog/rules";
import { categoryHref } from "@/sanity/lib/format";
import { imageUrl } from "@/sanity/lib/image";
import type { ProductCategory } from "@/sanity/lib/types";

const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";
const EXPANDED_BASIS = 46;

type ProductsSectionProps = {
  categories: ProductCategory[];
  /** Category `_id` to whether it's browsable right now. A category that
   *  isn't links to the RFQ instead of its product listing (CI-72). */
  categoryLinks: Record<string, boolean>;
  /** Show the "View all" link to the product listing. */
  showViewAll: boolean;
};

export const ProductsSection = ({ categories, categoryLinks, showViewAll }: ProductsSectionProps) => {
  const linkFor = (cat: ProductCategory) =>
    categoryLinks[cat._id] ? categoryHref(cat.slug) : rfqEntryHref(cat.slug);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (categories.length === 0) return null;

  const total = categories.length;
  const compressedBasis = (100 - EXPANDED_BASIS) / (total - 1);

  return (
    <section className="bg-background py-20">
      {/* Duotone filter def, shared by every panel's resting-state image */}
      <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <filter colorInterpolationFilters="sRGB" id="product-line-dither">
          <feColorMatrix
            type="matrix"
            values="0.3 0.3 0.3 0 0
                    0.3 0.3 0.3 0 0
                    0.3 0.3 0.3 0 0
                    0   0   0   1 0"
          />
          {/* Duotone — shadows to near-black, highlights to the site's accent green */}
          <feComponentTransfer>
            <feFuncR tableValues="0.04 0.57" type="table" />
            <feFuncG tableValues="0.04 0.79" type="table" />
            <feFuncB tableValues="0.04 0.03" type="table" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-12">
          <div className="flex flex-col items-start justify-between gap-4 lg:items-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
              Our Product Lines.
            </h2>
            {showViewAll && (
              <NextLink
                className="hidden text-sm font-semibold uppercase tracking-widest text-muted transition-colors duration-200 hover:text-accent md:block"
                href="/products"
              >
                View all →
              </NextLink>
            )}
          </div>
        </div>
      </div>

      {/* Full-width horizontal accordion — desktop/tablet */}
      <div className="hidden h-[480px] w-full gap-1 border-y border-separator py-1 lg:flex lg:h-[560px]">
        {categories.map((cat, index) => {
          const isHovered = hoveredIndex === index;
          const isCompressed = hoveredIndex !== null && !isHovered;
          const basis = isHovered
            ? EXPANDED_BASIS
            : isCompressed
              ? compressedBasis
              : 100 / total;
          const src = imageUrl(cat.image, { width: 1200, height: 800 });

          return (
            <NextLink
              key={cat._id}
              className="product-row relative flex flex-col justify-end overflow-hidden rounded"
              href={linkFor(cat)}
              style={{
                animationDelay: `${index * 90}ms`,
                flexBasis: `${basis}%`,
                transition: `flex-basis 500ms ${EASE}`,
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Dithered resting-state image */}
              {src && (
                <Image
                  alt=""
                  className="object-cover object-center"
                  fill
                  sizes="50vw"
                  src={src}
                  style={{
                    filter:
                      "url(#product-line-dither) brightness(0.55) contrast(1.1)",
                    opacity: isHovered ? 0 : 1,
                    transition: `opacity 500ms ${EASE}`,
                  }}
                />
              )}

              {/* Full-color image — revealed on hover */}
              {src && (
                <Image
                  alt=""
                  className="object-cover object-center"
                  fill
                  sizes="50vw"
                  src={src}
                  style={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? "1.03" : "1",
                    transition: `opacity 500ms ${EASE}`,
                  }}
                />
              )}

              {/* Dark overlay so text stays legible */}
              <div
                className="absolute inset-0 bg-black/70"
                style={{
                  opacity: isHovered ? 1 : 0,
                  transition: `opacity 500ms ${EASE}`,
                }}
              />

              {/* Green accent line — grows bottom-to-top on hover */}
              <div
                className="absolute inset-y-0 left-0 w-[2px] origin-bottom bg-accent"
                style={{
                  transform: isHovered ? "scaleY(1)" : "scaleY(0)",
                  transition: `transform 500ms ${EASE}`,
                }}
              />

              {/* Index number */}
              <span
                aria-hidden="true"
                className="absolute left-6 top-6 font-mono text-xs font-medium tabular-nums lg:text-sm"
                style={{
                  color: isHovered ? "var(--accent)" : "rgba(255,255,255,0.55)",
                  transition: `color 300ms ${EASE}`,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Vertical label — shown only while this tile is compressed */}
              <h3
                aria-hidden={!isCompressed}
                className="pointer-events-none absolute bottom-6 left-6 whitespace-nowrap text-lg font-bold tracking-tight text-white lg:text-xl"
                style={{
                  opacity: isCompressed ? 1 : 0,
                  transform: "rotate(180deg)",
                  transition: `opacity 300ms ${EASE}`,
                  writingMode: "vertical-rl",
                }}
              >
                {cat.label}
              </h3>

              {/* Label + description + arrow */}
              <div className="relative flex flex-col gap-3 p-6">
                <h3
                  className="text-xl font-bold leading-tight tracking-tight text-white lg:text-2xl"
                  style={{
                    opacity: isCompressed ? 0 : 1,
                    transition: `opacity 300ms ${EASE}`,
                  }}
                >
                  {cat.label}
                </h3>

                <p
                  className="max-w-[26ch] text-sm leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    opacity: isHovered ? 1 : 0,
                    transition: `opacity 300ms ${EASE}`,
                  }}
                >
                  {cat.description}
                </p>

                <span
                  aria-hidden="true"
                  className="text-base"
                  style={{
                    color: isHovered
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.55)",
                    opacity: isCompressed ? 0 : 1,
                    transform: isHovered ? "translateX(4px)" : "translateX(0)",
                    transition: `color 300ms ${EASE}, transform 300ms ${EASE}, opacity 300ms ${EASE}`,
                  }}
                >
                  →
                </span>
              </div>
            </NextLink>
          );
        })}
      </div>

      {/* Vertical accordion — mobile/tablet */}
      <div className="mx-auto max-w-[1280px] px-6 lg:hidden">
        <div className="flex flex-col gap-1">
          {categories.map((cat, index) => {
            const isHovered = hoveredIndex === index;
            const py = isHovered ? "6rem" : "1.75rem";
            const src = imageUrl(cat.image, { width: 1200, height: 800 });

            return (
              <NextLink
                key={cat._id}
                className="product-row relative flex items-center justify-between overflow-hidden rounded px-4"
                href={linkFor(cat)}
                style={{
                  animationDelay: `${index * 90}ms`,
                  paddingBottom: py,
                  paddingTop: py,
                  transition: `padding 500ms ${EASE}`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Category background image */}
                {src && (
                  <Image
                    alt=""
                    className="object-cover object-center"
                    fill
                    sizes="100vw"
                    src={src}
                    style={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? "1.03" : "1",
                      transition: `opacity 500ms ${EASE}`,
                    }}
                  />
                )}

                {/* Dark overlay so text stays legible */}
                <div
                  className="absolute inset-0 bg-black/70"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: `opacity 500ms ${EASE}`,
                  }}
                />

                {/* Green accent line — grows left-to-right on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent"
                  style={{
                    transform: isHovered ? "scaleX(1)" : "scaleX(0)",
                    transition: `transform 500ms ${EASE}`,
                  }}
                />

                {/* Left — index + category name */}
                <div className="relative flex items-baseline gap-6">
                  <span
                    aria-hidden="true"
                    className="w-8 shrink-0 font-mono text-xs font-medium tabular-nums"
                    style={{
                      color: isHovered ? "var(--accent)" : "var(--muted)",
                      transition: `color 300ms ${EASE}`,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-lg font-bold tracking-tight sm:text-xl"
                    style={{
                      color: isHovered ? "white" : "var(--foreground)",
                      transition: `color 300ms ${EASE}`,
                    }}
                  >
                    {cat.label}
                  </h3>
                </div>

                {/* Right — description + arrow */}
                <div className="relative hidden items-center gap-6 sm:flex">
                  <p
                    className="max-w-[24ch] text-sm leading-relaxed"
                    style={{
                      color: isHovered ? "rgba(255,255,255,0.65)" : "var(--muted)",
                      transition: `color 300ms ${EASE}`,
                    }}
                  >
                    {cat.description}
                  </p>
                  <span
                    aria-hidden="true"
                    className="text-base"
                    style={{
                      color: isHovered ? "var(--accent)" : "var(--muted)",
                      transform: isHovered ? "translateX(6px)" : "translateX(0)",
                      transition: `color 300ms ${EASE}, transform 300ms ${EASE}`,
                    }}
                  >
                    →
                  </span>
                </div>

                {/* Small screens — arrow only */}
                <span
                  aria-hidden="true"
                  className="relative text-base sm:hidden"
                  style={{
                    color: isHovered ? "var(--accent)" : "var(--muted)",
                    transform: isHovered ? "translateX(6px)" : "translateX(0)",
                    transition: `color 300ms ${EASE}, transform 300ms ${EASE}`,
                  }}
                >
                  →
                </span>
              </NextLink>
            );
          })}
        </div>
      </div>
    </section>
  );
};
