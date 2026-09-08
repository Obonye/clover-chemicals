import NextLink from "next/link";

import { Spotlight } from "@/components/ui/spotlight-new";
import { MedicalHighlights } from "@/components/medical-highlights";

export const HeroMedical = () => {
  return (
    <section className="relative -mt-16 overflow-hidden bg-background">
      {/* Light-theme spotlight — same sweeping-beam mechanic as the
          Aceternity original, re-tuned (higher alpha, no near-white base)
          so the purple actually reads against a light background instead
          of the light-glow-on-dark treatment it ships with by default.
          Covers the whole section (text + highlights below), so there's
          no seam where the glow would otherwise stop dead. */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(252, 90%, 60%, .22) 0, hsla(252, 90%, 55%, .08) 50%, hsla(252, 90%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(252, 90%, 60%, .16) 0, hsla(252, 90%, 55%, .06) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(252, 90%, 60%, .12) 0, hsla(252, 90%, 45%, .05) 80%, transparent 100%)"
      />

      {/* Text — centered */}
      <div className="relative mx-auto max-w-[1280px] px-6 pt-32 pb-16 text-center md:pt-40 md:pb-20 lg:px-12">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-medical">
          A Division of Clover Industries
        </p>

        <h1
          className="mx-auto mb-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-heading lg:text-5xl"
          style={{ maxWidth: "20ch" }}
        >
          Welcome to Clover Medical.
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted">
          Botswana&apos;s leading partner in advanced medical, life sciences,
          and laboratory solutions.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <NextLink
            className="rounded-full bg-medical px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-medical-foreground transition-colors hover:bg-medical/90"
            href="#product-lines"
          >
            Explore Product Lines
          </NextLink>
          <NextLink
            className="rounded-full border-2 border-separator px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-surface-secondary"
            href="/contact?division=medical"
          >
            Contact Us
          </NextLink>
        </div>
      </div>

      <MedicalHighlights />
    </section>
  );
};
