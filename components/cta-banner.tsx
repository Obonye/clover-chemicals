import Image from "next/image";
import NextLink from "next/link";

export const CtaBanner = () => {
  return (
    <section className="relative overflow-hidden bg-accent">
      {/* Background image */}
      <Image
        alt=""
        className="object-cover object-center mix-blend-luminosity opacity-60"
        fill
        src="/CTA/CTA2.jpg"
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-32 lg:px-12">
        <div className="flex flex-col gap-8">

          {/* Headline + subtext */}
          <div>
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/60">
              Work With Us
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white lg:text-4xl" style={{ maxWidth: "22ch" }}>
              Ready to source with confidence?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/70" style={{ maxWidth: "48ch" }}>
              Tell us what you need. Our technical team responds within one business
              day with specifications, pricing, and availability.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <NextLink
              className="inline-flex items-center justify-center rounded border-2 border-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/20"
              href="/contact"
            >
              Request a Quote
            </NextLink>
            <NextLink
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white/70 transition-colors duration-200 hover:text-white"
              href="/products"
            >
              Browse Products →
            </NextLink>
          </div>

        </div>
      </div>
    </section>

  );
};
