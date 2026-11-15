import type { Metadata } from "next";

import NextLink from "next/link";

import { eyebrow } from "@/components/primitives";
import { divisions } from "@/config/divisions";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const arrow = <span aria-hidden="true" className="arrow-nudge">→</span>;

/**
 * The 404 page. Plain and helpful: say what happened, then put the three things
 * most visitors want (home, a quote, a person) within one click. It sits inside
 * the normal layout, so the navbar and footer are still there.
 */
export default function NotFound() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="group mb-8 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="h-14 w-14 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-[8deg] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0"
            src="/clover-logo.svg"
          />
          <span aria-hidden="true" className="font-display text-5xl font-extrabold tabular-nums tracking-tight text-foreground/15 lg:text-6xl">
            404
          </span>
        </div>

        <p className={eyebrow()}>Page not found</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground" style={{ maxWidth: "20ch" }}>
          Let&apos;s get you back on track.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
          We can&apos;t find that page: the link may be out of date, or the page may have moved. Start from the home
          page, or tell us what you need and we&apos;ll point you to the right place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <NextLink
            className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            href="/"
          >
            Go to the home page {arrow}
          </NextLink>
          <NextLink
            className="wipe wipe-dark inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-separator px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground"
            href="/rfq"
          >
            Request a quote {arrow}
          </NextLink>
        </div>

        <div className="mt-12 border-t border-separator pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Or go straight to</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {divisions.map((division) => (
              <li key={division.slug}>
                <NextLink
                  className="link-draw text-sm font-semibold text-foreground transition-colors hover:text-accent"
                  href={`/${division.slug}`}
                >
                  {division.name}
                </NextLink>
              </li>
            ))}
            <li>
              <NextLink
                className="link-draw text-sm font-semibold text-foreground transition-colors hover:text-accent"
                href="/contact"
              >
                Contact us
              </NextLink>
            </li>
            <li>
              <NextLink
                className="link-draw text-sm font-semibold text-foreground transition-colors hover:text-accent"
                href="/locations"
              >
                Our branches
              </NextLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
