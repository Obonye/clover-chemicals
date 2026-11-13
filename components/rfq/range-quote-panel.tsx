"use client";

import { AddRangeToQuote } from "@/components/rfq/add-range-to-quote";

type Props = {
  /** Plain-text slug and name of the range (no stega). */
  slug: string;
  name: string;
  /** The range's own description from Sanity, if it has one. */
  description?: string | null;
};

const STEPS = [
  { title: "Add the range", body: "It's saved with your quote, alongside any products you've picked." },
  { title: "Tell us what you need", body: "Products, grades, quantities, how often: one message covers it." },
  { title: "Get your quote", body: "We reply with a quotation, usually within one business day." },
];

/** Shown in place of a range's products while they aren't listed online yet. */
export const RangeQuotePanel = ({ slug, name, description }: Props) => (
  <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-separator bg-surface md:grid-cols-2">
    <div className="flex flex-col p-8">
      <p className="mb-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{name}</p>
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
        We&apos;re still listing these online
      </h2>
      <p className="mt-3 text-base text-muted">Tell us what you need and we&apos;ll quote it.</p>
      {description && <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted">{description}</p>}
      <div className="mt-6">
        <AddRangeToQuote name={name} slug={slug} />
      </div>
    </div>

    <div className="border-t border-separator bg-background/60 p-8 md:border-l md:border-t-0">
      <h3 className="mb-5 font-mono text-xs font-medium uppercase tracking-widest text-muted">How it works</h3>
      <ol className="flex flex-col gap-5">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-separator font-mono text-sm font-semibold text-foreground"
            >
              {index + 1}
            </span>
            <span>
              <span className="block font-semibold text-foreground">{step.title}</span>
              <span className="block text-sm text-muted">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  </div>
);
