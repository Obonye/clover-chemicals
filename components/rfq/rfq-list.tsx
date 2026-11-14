"use client";

import type { RfqRange } from "@/lib/rfq/types";

import * as React from "react";
import { Button } from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { useCatalogState } from "@/components/catalog-state";
import { RfqDetailsForm, type RfqSubmitSuccess } from "@/components/rfq/rfq-details-form";
import { RfqTableRow } from "@/components/rfq/rfq-table-row";
import { divisions } from "@/config/divisions";
import { rfqLineKey } from "@/lib/rfq/schema";
import { useRfq } from "@/lib/rfq/store";
import { useRfqFreshness } from "@/lib/rfq/use-rfq-freshness";

const LoadingState = () => (
  <div aria-busy="true" aria-label="Loading your request" className="flex flex-col gap-4">
    {[0, 1].map((i) => (
      <div key={i} className="h-40 animate-pulse rounded-2xl border border-separator bg-surface-secondary" />
    ))}
  </div>
);

/** With the catalogue on and nothing in the cart: a pointer to the product listings. */
const BrowseHint = () => (
  <p className="text-sm leading-relaxed text-muted">
    Want to add specific products?{" "}
    {divisions.map((division, index) => (
      <React.Fragment key={division.slug}>
        {index > 0 && " · "}
        <NextLink
          className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
          href={`/${division.slug}/products`}
        >
          Browse {division.name}
        </NextLink>
      </React.Fragment>
    ))}
    .
  </p>
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

type RfqListProps = {
  /** The product ranges Sanity lists. Also the allow-list for `?category=` and saved ranges. */
  ranges: RfqRange[];
};

export const RfqList = ({ ranges }: RfqListProps) => {
  const { items, hydrated, clear } = useRfq();
  const catalog = useCatalogState();
  const catalogEnabled = catalog.enabled;
  const freshness = useRfqFreshness(catalogEnabled);
  const router = useRouter();
  const [sent, setSent] = React.useState(false);
  const [chosenRanges, setChosenRanges] = React.useState<string[]>([]);
  const entryHandled = React.useRef(false);

  // `?category=<slug>` (from a range card) preselects that range once, then the
  // URL is cleaned so a refresh or back/forward can't select it again. Only a
  // slug Sanity actually lists is accepted: anything else is ignored (CI-74).
  React.useEffect(() => {
    if (entryHandled.current) return;
    entryHandled.current = true;

    const slug = new URLSearchParams(window.location.search).get("category");

    if (slug === null) return;
    window.history.replaceState(null, "", "/rfq");
    if (ranges.some((range) => range.slug === slug)) setChosenRanges([slug]);
  }, [ranges]);

  // Ranges are tags on this form only, not saved with the list.
  const selectedRanges = chosenRanges.filter((slug) => ranges.some((range) => range.slug === slug));

  // The list is cleared only once the server has confirmed the send, then
  // the buyer lands on the confirmation page (CI-24). `sent` keeps the form
  // from flashing back while that navigation happens.
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

  if (sent || !hydrated || !catalog.ready) return <LoadingState />;

  // Saved products are only shown (and checked) while the catalogue is on.
  const productLines = catalogEnabled ? items : [];
  const hasProducts = productLines.length > 0;
  const flagged = freshness.status === "ready" ? productLines.length - freshness.sendable.length : 0;
  // With no products to check, there's nothing to wait for.
  const checkDone = !hasProducts || freshness.status === "ready" || freshness.status === "error";

  const form = (
    <div className="rounded-2xl border border-separator bg-surface p-5 lg:p-8">
      <RfqDetailsForm
        items={freshness.sendable}
        ranges={ranges}
        ready={checkDone}
        selectedRanges={selectedRanges}
        onRangesChange={setChosenRanges}
        onSuccess={handleSent}
      />
    </div>
  );

  // No products: the page is just the request form.
  if (!hasProducts) {
    return (
      <div className="flex max-w-3xl flex-col gap-6">
        {catalogEnabled && <BrowseHint />}
        {form}
      </div>
    );
  }

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
              {productLines.map((line) => (
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
          <ClearList count={productLines.length} />
        </div>

        {form}
      </div>

      <aside aria-label="RFQ summary" className="w-full sm:ml-auto sm:max-w-sm xl:sticky xl:top-36 xl:max-w-none xl:self-start">
        <div className="rounded-2xl border border-separator bg-surface p-5">
          <h2 className="mb-3 font-display text-base font-extrabold tracking-tight text-foreground">Summary</h2>
          <dl className="mb-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Items</dt>
              <dd className="font-mono font-semibold text-foreground" aria-live="polite">
                {productLines.length}
              </dd>
            </div>
            {selectedRanges.length > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Ranges</dt>
                <dd className="font-mono font-semibold text-foreground">{selectedRanges.length}</dd>
              </div>
            )}
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
