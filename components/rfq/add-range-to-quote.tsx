"use client";

import * as React from "react";
import { Button } from "@heroui/react";
import NextLink from "next/link";

import { RFQ_MAX_RANGES } from "@/lib/rfq/schema";
import { useRfq } from "@/lib/rfq/store";

type Props = {
  /** Plain-text slug and name of the range (no stega). */
  slug: string;
  name: string;
};

/**
 * Adds a product range to the quote request and stays on the page, with a
 * small "Added · View quote" confirmation (like adding a product). The range
 * is saved with the request, so it survives browsing and refreshes.
 */
export const AddRangeToQuote = ({ slug, name }: Props) => {
  const { ranges, addRange, hydrated } = useRfq();
  const added = hydrated && ranges.includes(slug);
  const [full, setFull] = React.useState(false);

  const handleAdd = () => {
    setFull(addRange(slug) === "full");
  };

  return (
    <div className="flex flex-col items-start gap-3">
      {added ? (
        <div aria-live="polite" className="flex flex-wrap items-center gap-x-4 gap-y-2" role="status">
          <span className="inline-flex h-12 items-center gap-2 rounded border border-accent px-5 font-mono text-sm font-semibold uppercase tracking-wider text-accent">
            <svg aria-hidden="true" fill="none" height={16} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" width={16}>
              <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Added
          </span>
          <NextLink
            className="font-mono text-sm font-semibold uppercase tracking-wider text-accent underline-offset-4 hover:underline"
            href="/rfq"
          >
            View quote
          </NextLink>
        </div>
      ) : (
        <Button className="h-12 px-6 font-mono text-sm uppercase tracking-wider" isDisabled={!hydrated} variant="primary" onPress={handleAdd}>
          Add {name} to my quote
        </Button>
      )}
      {full && (
        <p className="text-sm text-muted" role="alert">
          You can ask about up to {RFQ_MAX_RANGES} ranges in one request. Remove one on the{" "}
          <NextLink className="font-semibold text-accent underline-offset-2 hover:underline" href="/rfq">
            quote page
          </NextLink>{" "}
          to add another.
        </p>
      )}
    </div>
  );
};
