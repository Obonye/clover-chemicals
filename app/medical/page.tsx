import NextLink from "next/link";

import { HeroMedical } from "@/components/hero-medical";
import { MedicalPartners } from "@/components/medical-partners";
import { MedicalHighlights } from "@/components/medical-highlights";
import { MedicalQuote } from "@/components/medical-quote";
import { MedicalWhyPartner } from "@/components/medical-why-partner";
import { MedicalProductBento } from "@/components/medical-product-bento";
import { MedicalProductCarousel } from "@/components/medical-product-carousel";
import { MedicalServices } from "@/components/medical-services";

export default function MedicalPage() {
  return (
    <>
      <HeroMedical />

      <MedicalHighlights />

      <MedicalPartners />

      <MedicalQuote />

      <MedicalProductCarousel />

      <MedicalWhyPartner />

      <div id="product-lines">
        <MedicalProductBento />
      </div>

      <MedicalServices />

      {/* CTA */}
      <section className="bg-surface">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-6 py-16 lg:flex-row lg:items-center lg:px-12">
          <div>
            <h2 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-heading lg:text-3xl">
              Talk to our medical equipment team.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Reach out to discuss equipment, installation, or after-sales
              support for your facility.
            </p>
          </div>
          <NextLink
            className="inline-flex w-fit items-center gap-1.5 rounded bg-medical px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-medical-foreground transition-colors hover:bg-medical/90"
            href="/contact?division=medical"
          >
            Contact Us
            <span aria-hidden="true">→</span>
          </NextLink>
        </div>
      </section>
    </>
  );
}
