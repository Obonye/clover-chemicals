"use client";

import type { RfqLineItem as RfqLine } from "@/lib/rfq/types";

import * as React from "react";
import NextLink from "next/link";

import { RfqLineItem } from "@/components/rfq/rfq-line-item";
import { divisions } from "@/config/divisions";
import { rfqLineKey } from "@/lib/rfq/schema";
import { useRfq } from "@/lib/rfq/store";
import { useRfqFreshness } from "@/lib/rfq/use-rfq-freshness";

const STEPS = [
  { title: "Add products", body: "Use “Add to RFQ” on any product, with the pack size and quantity you need." },
  { title: "Review your list", body: "Adjust quantities and add notes here. Your list is saved on this device." },
  { title: "Send it to us", body: "We price every request for you and reply with a quotation." },
];

const EmptyState = () => (
  <div className="flex flex-col gap-10">
    <div>
      <h2 className="mb-3 font-display text-2xl font-extrabold tracking-tight text-foreground">
        Your RFQ list is empty
      </h2>
      <p className="max-w-[52ch] text-base leading-relaxed text-muted">
        A Request for Quote lets you collect several products, from either
        division, and send them to us in one go.
      </p>
    </div>

    <ol className="grid gap-4 sm:grid-cols-3">
      {STEPS.map((step, i) => (
        <li key={step.title} className="rounded-2xl border border-separator bg-surface p-5">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
            Step {i + 1}
          </p>
          <p className="mb-1 font-bold text-foreground">{step.title}</p>
          <p className="text-sm leading-relaxed text-muted">{step.body}</p>
        </li>
      ))}
    </ol>

    <div className="flex flex-wrap gap-3">
      {divisions.map((division) => (
        <NextLink
          key={division.slug}
          className="inline-flex min-h-11 items-center rounded bg-accent px-5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
          href={`/${division.slug}/products`}
        >
          Browse {division.name}
        </NextLink>
      ))}
    </div>
    <p className="text-sm text-muted">
      Just have a single question?{" "}
      <NextLink className="font-semibold text-foreground underline underline-offset-2 hover:text-accent" href="/contact">
        Send us an enquiry
      </NextLink>
      .
    </p>
  </div>
);

const LoadingState = () => (
  <div aria-busy="true" aria-label="Loading your RFQ list" className="flex flex-col gap-4">
    {[0, 1].map((i) => (
      <div key={i} className="h-40 animate-pulse rounded-2xl border border-separator bg-surface-secondary" />
    ))}
  </div>
);

const ClearList = ({ count }: { count: number }) => {
  const { clear } = useRfq();
  const [confirming, setConfirming] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const confirmRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  if (!confirming) {
    return (
      <button
        ref={triggerRef}
        className="min-h-11 font-mono text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-danger"
        type="button"
        onClick={() => setConfirming(true)}
      >
        Clear list
      </button>
    );
  }

  const cancel = () => {
    setConfirming(false);
    // The trigger re-mounts after this render; focus it once it's back.
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div
      aria-label="Confirm clearing the list"
      className="flex flex-wrap items-center gap-3 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2"
      role="group"
      onKeyDown={(event) => {
        if (event.key === "Escape") cancel();
      }}
    >
      <span className="text-sm text-danger-soft-foreground">
        Remove all {count} item{count === 1 ? "" : "s"}?
      </span>
      <button
        ref={confirmRef}
        className="min-h-11 rounded bg-danger px-4 text-sm font-semibold text-danger-foreground"
        type="button"
        onClick={() => {
          clear();
          setConfirming(false);
        }}
      >
        Yes, clear
      </button>
      <button className="min-h-11 px-2 text-sm font-semibold text-foreground" type="button" onClick={cancel}>
        Cancel
      </button>
    </div>
  );
};

/** Orders lines by division (in config order), keeping add order inside each. */
function groupByDivision(items: RfqLine[]) {
  return divisions
    .map((division) => ({
      division,
      lines: items.filter((line) => line.division === division.sanityDivision),
    }))
    .filter((group) => group.lines.length > 0);
}

export const RfqList = () => {
  const { items, hydrated } = useRfq();
  const freshness = useRfqFreshness();

  if (!hydrated) return <LoadingState />;
  if (items.length === 0) return <EmptyState />;

  const flagged = freshness.status === "ready" ? items.length - freshness.sendable.length : 0;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px] lg:gap-16">
      <div className="flex min-w-0 flex-col gap-8">
        {freshness.status === "error" && (
          <p className="rounded-lg bg-warning-soft px-4 py-3 text-sm text-warning-soft-foreground" role="alert">
            We couldn&apos;t check your list against our latest catalogue.{" "}
            <button className="font-semibold underline underline-offset-2" type="button" onClick={freshness.retry}>
              Try again
            </button>
          </p>
        )}

        {groupByDivision(items).map(({ division, lines }) => (
          <section key={division.slug} aria-labelledby={`rfq-group-${division.slug}`}>
            <h2
              className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted"
              id={`rfq-group-${division.slug}`}
            >
              {division.name} · {lines.length} item{lines.length === 1 ? "" : "s"}
            </h2>
            <ul className="flex flex-col gap-3">
              {lines.map((line) => (
                <RfqLineItem
                  key={rfqLineKey(line)}
                  check={freshness.checks.get(rfqLineKey(line))}
                  line={line}
                />
              ))}
            </ul>
          </section>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-separator pt-4">
          <NextLink
            className="min-h-11 content-center font-mono text-xs font-semibold uppercase tracking-wider text-foreground underline-offset-2 hover:text-accent hover:underline"
            href="/products"
          >
            ← Add more products
          </NextLink>
          <ClearList count={items.length} />
        </div>
      </div>

      <aside aria-label="RFQ summary" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-separator bg-surface p-6">
          <h2 className="mb-4 font-display text-lg font-extrabold tracking-tight text-foreground">Summary</h2>
          <dl className="mb-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Items</dt>
              <dd className="font-mono font-semibold text-foreground" aria-live="polite">
                {items.length}
              </dd>
            </div>
            {flagged > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Need attention</dt>
                <dd className="font-mono font-semibold text-warning">{flagged}</dd>
              </div>
            )}
          </dl>
          <p className="text-sm leading-relaxed text-muted">
            There are no prices online: we quote every request individually,
            based on your quantities and delivery location.
          </p>
          {flagged > 0 && (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Items marked as needing attention won&apos;t be sent until they&apos;re fixed.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};
