"use client";

import { useEffect } from "react";
import NextLink from "next/link";

import { eyebrow } from "@/components/primitives";
import { siteConfig } from "@/config/site";

const arrow = <span aria-hidden="true" className="arrow-nudge">→</span>;

/**
 * Shown when something throws while rendering a page. Same layout and voice as
 * the 404: say what happened, offer a retry, and give a way to reach a person.
 * It sits inside the normal layout, so the navbar and footer are still there.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the error in the browser console for debugging.
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 text-center lg:px-12">
        <div className="group mb-8 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="h-14 w-14 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-[8deg] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0"
            src="/clover-logo.svg"
          />
        </div>

        <p className={eyebrow()}>Something went wrong</p>
        <h1 className="mx-auto font-display text-4xl font-extrabold tracking-tight text-foreground" style={{ maxWidth: "20ch" }}>
          That didn&apos;t work. Let&apos;s try again.
        </h1>
        <p className="mx-auto mt-4 text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
          Something went wrong on our side while loading this page. It is usually brief: try again, or head back to
          the home page.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90"
            type="button"
            onClick={() => reset()}
          >
            Try again
          </button>
          <NextLink
            className="wipe wipe-dark inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-separator px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground"
            href="/"
          >
            Go to the home page {arrow}
          </NextLink>
        </div>

        <div className="mt-12 border-t border-separator pt-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Still stuck? Reach us</p>
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <li>
              <a
                className="link-draw text-sm font-semibold text-foreground transition-colors hover:text-accent"
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              >
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                className="link-draw text-sm font-semibold text-foreground transition-colors hover:text-accent"
                href={`mailto:${siteConfig.contact.email}`}
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <NextLink
                className="link-draw text-sm font-semibold text-foreground transition-colors hover:text-accent"
                href="/contact"
              >
                Contact form
              </NextLink>
            </li>
          </ul>
          {error.digest && (
            <p className="mt-6 text-xs text-muted">
              If you contact us, quote this reference: <span className="font-semibold tabular-nums">{error.digest}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
