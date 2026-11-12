import Image from "next/image";
import NextLink from "next/link";

type CtaBannerProps = {
  /** Duotone highlight colour as 0–1 sRGB channels for the photo. Defaults to
   *  Clover Green; the group home passes a neutral grey (CI-15). */
  tint?: [number, number, number];
  /** Show the "Browse Products" link. Off on the group home, which only
   *  keeps the quote shortcut (CI-32). */
  showBrowse?: boolean;
};

const CLOVER_GREEN: [number, number, number] = [0.57, 0.79, 0.03];

/**
 * The closing "Work with us" call to action. Light, like the rest of the
 * site (CI-33): black text on the page surface, with the duotone photo as a
 * framed image beside it rather than a dark full-bleed background.
 */
export const CtaBanner = ({ tint = CLOVER_GREEN, showBrowse = true }: CtaBannerProps) => {
  const [r, g, b] = tint;

  return (
    <section className="border-t border-separator bg-surface">
      {/* Duotone filter def — shadows to near-black, highlights to `tint` */}
      <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <filter colorInterpolationFilters="sRGB" id="cta-duotone">
          <feColorMatrix
            type="matrix"
            values="0.3 0.3 0.3 0 0
                    0.3 0.3 0.3 0 0
                    0.3 0.3 0.3 0 0
                    0   0   0   1 0"
          />
          <feComponentTransfer>
            <feFuncR tableValues={`0.02 ${r}`} type="table" />
            <feFuncG tableValues={`0.02 ${g}`} type="table" />
            <feFuncB tableValues={`0.02 ${b}`} type="table" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-12 lg:py-24">
        {/* Headline, subtext and actions */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Work With Us
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl" style={{ maxWidth: "22ch" }}>
              Ready to source with confidence?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted" style={{ maxWidth: "48ch" }}>
              Tell us what you need. Our team responds within one business day
              with specifications, pricing, and availability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <NextLink
              className="inline-flex items-center justify-center rounded bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
              href="/contact"
            >
              Request a Quote
            </NextLink>
            {showBrowse && (
              <NextLink
                className="inline-flex items-center justify-center rounded border border-separator px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors duration-200 hover:border-foreground/30"
                href="/products"
              >
                Browse Products →
              </NextLink>
            )}
          </div>
        </div>

        {/* Photo */}
        <div className="relative h-64 overflow-hidden rounded-2xl bg-surface-secondary lg:h-80">
          <Image
            alt=""
            className="object-cover object-center"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            src="/engineers_2.png"
            style={{ filter: "url(#cta-duotone) brightness(0.85) contrast(1.1)" }}
          />
        </div>
      </div>
    </section>
  );
};
