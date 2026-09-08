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

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;

    if (!track || !card) return;

    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const targetLeft = track.scrollLeft + (cardRect.left - trackRect.left);

    track.scrollTo({ behavior: "smooth", left: targetLeft });
  };

  const isFirst = active === 0;
  const isLast = active === medicalProducts.length - 1;

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-heading lg:text-4xl">
            A closer look at each line.
          </h2>
          <NextLink
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-medical transition-colors hover:text-medical/80"
            href="#product-lines"
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

        {/* Pagination dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {medicalProducts.map(({ product }, i) => (
            <button
              key={product.name}
              aria-label={`Go to ${product.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-medical" : "w-2 bg-separator"
              }`}
              type="button"
              onClick={() => scrollToCard(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
