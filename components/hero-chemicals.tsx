import Image from "next/image";
import NextLink from "next/link";

type HeroChemicalsProps = {
  /** Show "Browse Products". Off while the catalogue is hidden (CI-72). */
  showBrowse?: boolean;
};

export const HeroChemicals = ({ showBrowse = true }: HeroChemicalsProps) => {
  return (
    <section className="relative -mt-[var(--navbar-h)] flex min-h-screen items-center">
      {/* Background image */}
      <Image
        alt="Clover Chemicals facility"
        className="object-cover object-center"
        fill
        priority
        sizes="100vw"
        src="/clover-chemicals.jpg"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            A Division of Clover Industries
          </p>

          <h1 className="mb-6 font-display text-5xl font-extrabold leading-none tracking-normal text-white">
            Botswana&apos;s <span className="text-accent">One Stop</span>{" "}
            Chemical &amp; Equipment Partner.
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-white/75">
            Chemicals, equipment, and PPE for agriculture, healthcare, and
            industry.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {showBrowse && (
              <NextLink
                className="rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors press hover:bg-accent/90"
                href="/products"
              >
                Browse Products
              </NextLink>
            )}
            <NextLink
              className="wipe rounded-lg border-2 border-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white"
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
