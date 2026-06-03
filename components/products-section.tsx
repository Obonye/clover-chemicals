"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";

const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";

export const ProductsSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">

        {/* Section header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              What We Manufacture
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Our Product Lines
            </h2>
          </div>
          <NextLink
            className="hidden text-sm font-semibold uppercase tracking-widest text-muted transition-colors duration-200 hover:text-foreground md:block"
            href="/products"
          >
            View all →
          </NextLink>
        </div>

        {/* Catalogue list */}
        <div className="border-t border-separator">
          {siteConfig.products.map((product, index) => {
            const isHovered = hoveredIndex === index;
            const isCompressed = hoveredIndex !== null && !isHovered;
            const py = isHovered ? "9rem" : isCompressed ? "1.25rem" : "2.5rem";

            return (
              <NextLink
                key={product.href}
                className="product-row relative flex items-center justify-between overflow-hidden border-b border-separator px-4"
                href={product.href}
                style={{
                  animationDelay: `${index * 90}ms`,
                  paddingTop: py,
                  paddingBottom: py,
                  transition: `padding 500ms ${EASE}`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Category background image */}
                <Image
                  alt=""
                  className="object-cover object-center"
                  fill
                  sizes="100vw"
                  src={product.image}
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transition: `opacity 500ms ${EASE}`,
                    scale: isHovered ? "1.03" : "1",
                  }}
                />

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
                <div className="relative flex items-baseline gap-6 lg:gap-10">
                  <span
                    aria-hidden="true"
                    className="w-8 shrink-0 font-mono text-xs font-medium tabular-nums lg:text-sm"
                    style={{
                      color: isHovered ? "var(--accent)" : "var(--muted)",
                      transition: `color 300ms ${EASE}`,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-xl font-bold tracking-tight lg:text-3xl"
                    style={{
                      color: isHovered ? "white" : "var(--foreground)",
                      transition: `color 300ms ${EASE}`,
                    }}
                  >
                    {product.label}
                  </h3>
                </div>

                {/* Right — description + arrow */}
                <div className="relative hidden items-center gap-10 md:flex">
                  <p
                    className="max-w-[28ch] text-sm leading-relaxed"
                    style={{
                      color: isHovered ? "rgba(255,255,255,0.65)" : "var(--muted)",
                      transition: `color 300ms ${EASE}`,
                    }}
                  >
                    {product.description}
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

                {/* Mobile — arrow only */}
                <span
                  aria-hidden="true"
                  className="relative text-base md:hidden"
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

        {/* Mobile view-all */}
        <div className="mt-8 md:hidden">
          <NextLink
            className="text-sm font-semibold uppercase tracking-widest text-muted transition-colors hover:text-foreground"
            href="/products"
          >
            View all products →
          </NextLink>
        </div>

      </div>
    </section>
  );
};
