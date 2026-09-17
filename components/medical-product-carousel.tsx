"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";

import { MedicalProductCard } from "@/components/medical-product-card";
import type { Product } from "@/lib/products";

type MedicalProduct = {
  tag: string;
  product: Product;
};

const medicalProducts: MedicalProduct[] = [
  {
    tag: "Imaging",
    product: {
      name: "CombiDiagnost R90",
      description: "Ceiling-mounted digital radiography and fluoroscopy system for high-throughput diagnostic imaging.",
      grade: "Digital Radiography",
      packSizes: ["Ceiling-Mounted", "Floor-Mounted"],
      image: "/product_lines/diagnostic-imaging.jpg",
    },
  },
  {
    tag: "Diagnostics",
    product: {
      name: "Automated Hematology Analyzer",
      description: "High-throughput cellular analysis platform for rapid, reliable blood diagnostics in pathology labs.",
      grade: "Clinical Chemistry",
      packSizes: ["Bench-Top", "Floor-Standing"],
      image: "/product_lines/lab-diagnostics.jpg",
    },
  },
  {
    tag: "Chemistry",
    product: {
      name: "Ion Chromatography System",
      description: "Precision separation and detection system for rigorous chemical and environmental analysis.",
      grade: "Analytical Instrumentation",
      packSizes: ["Single-Column", "Dual-Column"],
      image: "/product_lines/analytical-chemistry.jpg",
    },
  },
  {
    tag: "Surgery",
    product: {
      name: "Disposable Surgical Scalpel Set",
      description: "Sterile, single-use scalpel blades for open, minimally invasive, and micro-surgery procedures.",
      grade: "Sterile, Single-Use",
      packSizes: ["#10 Blade", "#11 Blade", "#15 Blade"],
      image: "/product_lines/surgery.jpg",
    },
  },
  {
    tag: "Patient Care",
    product: {
      name: "Trilogy Portable Ventilator",
      description: "Philips Respironics portable ventilator for critical, sub-acute, and home respiratory care.",
      grade: "Portable Ventilator",
      packSizes: ["Trilogy 100", "Trilogy 200", "Trilogy 202"],
      image: "/product_lines/patient-care.jpg",
    },
  },
  {
    tag: "Renal Care",
    product: {
      name: "Hemodialysis Bloodline Set",
      description: "Sterile, single-use bloodline set engineered for precise fluid management during dialysis.",
      grade: "Sterile, Single-Use",
      packSizes: ["Adult", "Pediatric"],
      image: "/product_lines/renal-care.jpg",
    },
  },
];

export const MedicalProductCarousel = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // How many cards are visible at once — measured, not assumed, since it
  // depends on the track's actual rendered width and breakpoint-driven card
  // width (280px / 320px), not something derivable from a single class.
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const handleScroll = () => {
      const trackRect = track.getBoundingClientRect();
      const cards = Array.from(track.children) as HTMLElement[];
      let closest = 0;
      let closestDist = Infinity;

      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - trackRect.left);

        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });

      setActive(closest);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const measure = () => {
      const cards = Array.from(track.children) as HTMLElement[];

      if (cards.length === 0) return;

      // Distance between two cards' left edges already accounts for the
      // gap, so it doesn't need to duplicate the `gap-5` value here.
      const step =
        cards.length > 1
          ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left
          : cards[0].getBoundingClientRect().width;

      setVisibleCount(Math.max(1, Math.round(track.clientWidth / step)));
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;

    if (!track || !card) return;

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const targetLeft = track.scrollLeft + (cardRect.left - trackRect.left);

    track.scrollTo({ behavior: "smooth", left: targetLeft });
  };

  // The track can't scroll a leading card past `length - visibleCount` —
  // once that many cards remain, they already fill the rest of the width
  // and the browser clamps scrollLeft there. "Last" has to mean that clamp
  // point, not `length - 1`, which `active` (a leading-card index) can
  // never actually reach once more than one card is visible at a time.
  const maxLeadingIndex = Math.max(0, medicalProducts.length - visibleCount);
  const isFirst = active === 0;
  const isLast = active >= maxLeadingIndex;

  // Dots represent pages (groups of `visibleCount` cards that scroll
  // together), not individual products — one dot per product would
  // overstate how much distinct content is behind the carousel when
  // several cards are visible at once, since adjacent stops would mostly
  // show the same cards with just one swapped in or out.
  //
  // Page starts can't just be `page * visibleCount` either, for the same
  // clamping reason: with 6 items and 4 visible, "page 1" would compute to
  // index 4, but the track can never scroll there — it clamps at index 2.
  // floor(2 / 4) is always 0, so the last dot could never light up. Instead,
  // each page's start is clamped the same way the browser clamps scroll, so
  // it always matches a position the track can actually reach.
  const pageCount = Math.max(1, Math.ceil(medicalProducts.length / visibleCount));
  const pageStarts = Array.from({ length: pageCount }, (_, page) =>
    Math.min(page * visibleCount, maxLeadingIndex),
  );
  const activePage = pageStarts.reduce(
    (closest, start, page) =>
      Math.abs(start - active) < Math.abs(pageStarts[closest] - active) ? page : closest,
    0,
  );

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-heading lg:text-4xl">
            A closer look at each line.
          </h2>
          <NextLink
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-medical transition-colors hover:text-medical/80"
            href="/products?division=medical"
          >
            View All Products
            <span aria-hidden="true">→</span>
          </NextLink>
        </div>

        <div className="relative">
          {/* Scroll controls */}
          <button
            aria-label="Previous product"
            className="absolute top-1/2 left-0 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-separator bg-background shadow-md transition-colors hover:bg-surface-secondary disabled:pointer-events-none disabled:opacity-30 sm:flex"
            disabled={isFirst}
            type="button"
            onClick={() => scrollToCard(active - 1)}
          >
            <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            aria-label="Next product"
            className="absolute top-1/2 right-0 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-separator bg-background shadow-md transition-colors hover:bg-surface-secondary disabled:pointer-events-none disabled:opacity-30 sm:flex"
            disabled={isLast}
            type="button"
            onClick={() => scrollToCard(active + 1)}
          >
            <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {medicalProducts.map(({ tag, product }) => (
              <div key={product.name} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
                <MedicalProductCard product={product} tag={tag} />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots — one per page, not per product (see pageCount) */}
        {pageCount > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pageCount }, (_, page) => (
              <button
                key={page}
                aria-label={`Go to page ${page + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  page === activePage ? "w-6 bg-medical" : "w-2 bg-separator"
                }`}
                type="button"
                onClick={() => scrollToCard(pageStarts[page])}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
