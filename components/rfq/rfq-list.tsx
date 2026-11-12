"use client";

import * as React from "react";
import { Button } from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { RfqDetailsForm, type RfqSubmitSuccess } from "@/components/rfq/rfq-details-form";
import { RfqTableRow } from "@/components/rfq/rfq-table-row";
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
      <Button
        ref={triggerRef}
        className="h-11 font-mono text-xs uppercase tracking-wider text-muted hover:text-danger"
        variant="ghost"
        onPress={() => setConfirming(true)}
      >
        Clear list
      </Button>
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
      <Button
        ref={confirmRef}
        className="h-11"
        variant="danger"
        onPress={() => {
          clear();
          setConfirming(false);
        }}
      >
        Yes, clear
      </Button>
      <Button className="h-11" variant="tertiary" onPress={cancel}>
        Cancel
      </Button>
    </div>
  );
};

export const RfqList = () => {
  const { items, hydrated, clear } = useRfq();
  const freshness = useRfqFreshness();
  const router = useRouter();
  const [sent, setSent] = React.useState(false);

  // The list is cleared only once the server has confirmed the send, then
  // the buyer lands on the confirmation page (CI-24). `sent` keeps the
  // empty-list state from flashing while that navigation happens.
  const handleSent = React.useCallback(
    (result: RfqSubmitSuccess) => {
      const params = new URLSearchParams({ ref: result.reference });

      for (const name of result.dropped) params.append("dropped", name);
      setSent(true);
      clear();
      router.push(`/rfq/sent?${params.toString()}`);
    },
    [clear, router],
  );

  if (sent) return <LoadingState />;
  if (!hydrated) return <LoadingState />;
  if (items.length === 0) return <EmptyState />;

  const flagged = freshness.status === "ready" ? items.length - freshness.sendable.length : 0;

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_240px]">
      <div className="flex min-w-0 flex-col gap-8">
        {freshness.status === "error" && (
          <p className="rounded-lg bg-warning-soft px-4 py-3 text-sm text-warning-soft-foreground" role="alert">
            We couldn&apos;t check your list against our latest catalogue.{" "}
            <Button className="h-auto p-0 font-semibold underline underline-offset-2" variant="ghost" onPress={freshness.retry}>
              Try again
            </Button>
          </p>
        )}

        <div className="table-root table-root--primary max-md:bg-transparent max-md:p-0">
          <table className="table__content table-fixed max-md:block">
            <caption className="sr-only">Products in your request for quote</caption>
            <colgroup className="max-md:hidden">
              <col />
              <col className="w-36" />
              <col className="w-40" />
              <col className="w-[28%]" />
              <col className="w-12" />
            </colgroup>
            <thead className="table__header max-md:hidden">
              <tr>
                <th className="table__column" scope="col">Product</th>
                <th className="table__column" scope="col">Pack size</th>
                <th className="table__column" scope="col">Quantity</th>
                <th className="table__column" scope="col">Note</th>
                <th className="table__column" scope="col">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody className="table__body max-md:flex max-md:flex-col max-md:gap-2 max-md:shadow-none">
              {items.map((line) => (
                <RfqTableRow key={rfqLineKey(line)} check={freshness.checks.get(rfqLineKey(line))} line={line} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-separator pt-4">
          <NextLink
            className="min-h-11 content-center font-mono text-xs font-semibold uppercase tracking-wider text-foreground underline-offset-2 hover:text-accent hover:underline"
            href="/products"
          >
            ← Add more products
          </NextLink>
          <ClearList count={items.length} />
        </div>

        <div className="rounded-2xl border border-separator bg-surface p-5 lg:p-8">
          <RfqDetailsForm
            items={freshness.sendable}
            ready={freshness.status === "ready" || freshness.status === "error"}
            onSuccess={handleSent}
          />
        </div>
      </div>

      <aside aria-label="RFQ summary" className="w-full sm:ml-auto sm:max-w-sm xl:sticky xl:top-36 xl:max-w-none xl:self-start">
        <div className="rounded-2xl border border-separator bg-surface p-5">
          <h2 className="mb-3 font-display text-base font-extrabold tracking-tight text-foreground">Summary</h2>
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
          <p className="text-xs leading-relaxed text-muted">
            There are no prices online: we quote every request individually,
            based on your quantities and delivery location.
          </p>
          {flagged > 0 && (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Items marked as needing attention won&apos;t be sent until they&apos;re fixed.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
};
