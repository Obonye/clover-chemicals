"use client";

import { AddRangeToQuote } from "@/components/rfq/add-range-to-quote";

type Props = {
  /** Plain-text slug and name of the range (no stega). */
  slug: string;
  name: string;
};

/** Shown in place of a range's products while they aren't listed online yet. */
export const RangeQuotePanel = ({ slug, name }: Props) => (
  <div className="max-w-[56ch] rounded-xl border border-separator bg-surface p-8">
    <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{name}</p>
    <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
      We&apos;re still listing these online
    </h2>
    <p className="mt-3 text-base text-muted">Tell us what you need and we&apos;ll quote it.</p>
    <div className="mt-6">
      <AddRangeToQuote name={name} slug={slug} />
    </div>
  </div>
);
