import Image from "next/image";
import NextLink from "next/link";

import { siteConfig } from "@/config/site";

export const HeroChemicals = () => {
  const years = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <section className="relative -mt-16 flex min-h-screen items-center">
      {/* Background image */}
      <Image
        alt="Clover Chemical Industries facility"
        className="object-cover object-center"
        fill
        priority
        src="/clover large.jpg"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {years}+ Years · 100% Citizen-Owned
          </p>

          <h1 className="mb-6 font-display text-5xl font-extrabold leading-none tracking-normal text-white lg:text-6xl">
            Botswana&apos;s <span className="text-accent">One Stop</span>{" "}
            Chemical &amp; Equipment Partner.
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/75">
            Chemicals, equipment, and PPE for agriculture, healthcare, and
            industry.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <NextLink
              className="rounded bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
              href="/products"
            >
              Browse Products
            </NextLink>
            <NextLink
              className="rounded border-2 border-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
              href="/contact"
            >
              Get a Quote
            </NextLink>
          </div>
        </div>
      </div>
    </section>
  );
};
