import type { Metadata } from "next";

import NextLink from "next/link";
import { redirect } from "next/navigation";

import { divisions } from "@/config/divisions";
import { siteConfig } from "@/config/site";
import { isCatalogEnabled } from "@/lib/catalog/visibility";

export const metadata: Metadata = {
  title: "Request sent",
  alternates: { canonical: "/rfq/sent" },
  robots: { index: false, follow: false },
};

// `PREFIX-YYMMDD-XXXX` (lib/rfq/reference.ts). Anything else in the URL is
// ignored, so the page can't be made to display arbitrary text.
const REFERENCE_PATTERN = /^RFQ-\d{6}-[0-9A-Z]{4}$/;

type SentPageProps = {
  searchParams: Promise<{ ref?: string | string[]; dropped?: string | string[] }>;
};

const asList = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

export default async function RfqSentPage({ searchParams }: SentPageProps) {
  const params = await searchParams;
  const reference = asList(params.ref)[0];

  // Opened directly, with no (or a made-up) reference: there is nothing to confirm.
  if (!reference || !REFERENCE_PATTERN.test(reference)) redirect("/rfq");

  const catalogEnabled = await isCatalogEnabled();
  const dropped = asList(params.dropped)
    .map((name) => name.slice(0, 120))
    .slice(0, 50);

  return (
    <>
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 pb-5 pt-8 lg:px-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">Request sent</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            Thank you. We&apos;ll be in touch with your quotation.
          </h1>
        </div>
      </section>

      <section className="bg-background py-8 lg:py-12">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-6 px-6 lg:px-12">
          <p className="max-w-[60ch] text-base leading-relaxed text-muted">
            Your reference is <span className="font-mono font-semibold text-foreground">{reference}</span>. Please
            quote it if you contact us about this request.
          </p>

          <div className="max-w-[60ch]">
            <h2 className="mb-2 font-display text-lg font-extrabold tracking-tight text-foreground">
              What happens next
            </h2>
            <p className="text-base leading-relaxed text-muted">
              A confirmation is on its way to your email. Our team prices every request individually and replies
              with a quotation, usually within one business day ({siteConfig.contact.hours}). If you need to add or
              change something, reply to the confirmation email or call{" "}
              <a
                className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              >
                {siteConfig.contact.phone}
              </a>
              .
            </p>
          </div>

          {dropped.length > 0 && (
            <p className="max-w-[60ch] rounded-lg bg-warning-soft px-4 py-3 text-sm text-warning-soft-foreground">
              {dropped.length === 1 ? "One item was" : `${dropped.length} items were`} left out because{" "}
              {dropped.length === 1 ? "it's" : "they're"} no longer available as listed: {dropped.join(", ")}.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {catalogEnabled && divisions.map((division) => (
              <NextLink
                key={division.slug}
                className="inline-flex min-h-11 items-center rounded bg-accent px-5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
                href={`/${division.slug}/products`}
              >
                Browse {division.name}
              </NextLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
