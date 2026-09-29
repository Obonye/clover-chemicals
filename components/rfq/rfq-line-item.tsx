"use client";

import type { RfqLineCheck } from "@/lib/rfq/reconcile";
import type { RfqLineItem as RfqLine } from "@/lib/rfq/types";

import * as React from "react";
import Image from "next/image";
import NextLink from "next/link";
import clsx from "clsx";

import { QuantityStepper } from "@/components/rfq/quantity-stepper";
import { rfqLineKey } from "@/lib/rfq/schema";
import { useRfq } from "@/lib/rfq/store";
import { packLabel, productHref } from "@/sanity/lib/format";
import { imageUrl } from "@/sanity/lib/image";

const PROBLEM_TEXT = {
  missing: "This product is no longer in our catalogue, so it won't be included. Remove it, or mention it in your message.",
  unavailable: "Currently unavailable, so it won't be included. Remove it, or ask us about alternatives in your message.",
  "pack-missing": "The pack size you chose is no longer offered. Pick another to include this item.",
} as const;

const TrashIcon = () => (
  <svg aria-hidden="true" fill="none" height={18} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={18}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type RfqLineItemProps = {
  line: RfqLine;
  /** Undefined while the Sanity check is running or if it failed. */
  check: RfqLineCheck | undefined;
};

export const RfqLineItem = ({ line, check }: RfqLineItemProps) => {
  const { updateItem, removeItem } = useRfq();
  const key = rfqLineKey(line);
  const idPrefix = React.useId();
  const problem = check?.problem ?? null;

  const snapshot = check?.snapshot ?? null;
  const src = snapshot
    ? (imageUrl(snapshot.image, { width: 160, height: 160 }) ??
      imageUrl(snapshot.category?.image ?? null, { width: 160, height: 160 }))
    : null;
  const href = snapshot?.slug ? productHref(snapshot.category?.slug, snapshot.slug) : null;
  const packSizes = check?.packSizes ?? [];
  const canEditPack = problem !== "missing" && problem !== "unavailable" && packSizes.length > 1;
  const needsPack = problem === "pack-missing";

  // The stored note is trimmed by the schema, so while typing the input keeps
  // its own text (otherwise spaces would vanish as they're typed). It re-syncs
  // from the store on blur, or when another tab edits it.
  const [noteText, setNoteText] = React.useState(line.note ?? "");
  const noteFocused = React.useRef(false);

  React.useEffect(() => {
    if (!noteFocused.current) setNoteText(line.note ?? "");
  }, [line.note]);

  return (
    <li
      className={clsx(
        "flex flex-col gap-4 rounded-2xl border bg-surface p-4 sm:p-5",
        problem ? "border-warning" : "border-separator",
      )}
    >
      <div className="flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-secondary sm:h-20 sm:w-20">
          {src && <Image fill alt="" className="object-cover" sizes="80px" src={src} />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-snug tracking-tight text-foreground">
            {href && problem !== "missing" ? (
              <NextLink className="hover:text-accent" href={href}>
                {line.name}
              </NextLink>
            ) : (
              line.name
            )}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted">
            {[line.grade, !canEditPack && !needsPack ? line.packLabel : null].filter(Boolean).join(" · ")}
          </p>
        </div>

        <button
          aria-label={`Remove ${line.name}${line.packLabel ? ` (${line.packLabel})` : ""} from RFQ`}
          className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted transition-colors hover:bg-surface-secondary hover:text-danger"
          type="button"
          onClick={() => removeItem(key)}
        >
          <TrashIcon />
        </button>
      </div>

      {problem && (
        <p className="rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning-soft-foreground" role="note">
          {PROBLEM_TEXT[problem]}
        </p>
      )}

      {problem !== "missing" && problem !== "unavailable" && (
        <div className="flex flex-wrap items-stretch gap-2">
          {(canEditPack || needsPack) && packSizes.length > 0 && (
            <div className="min-w-0 flex-1 basis-40">
              <label className="sr-only" htmlFor={`${idPrefix}-pack`}>
                Pack size for {line.name}
              </label>
              <select
                className="h-11 w-full min-w-0 rounded border border-separator bg-surface px-2 font-mono text-xs text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                id={`${idPrefix}-pack`}
                value={needsPack ? "" : (line.packSizeKey ?? "")}
                onChange={(event) => {
                  const pack = packSizes.find((p) => p._key === event.target.value);

                  if (pack) updateItem(key, { packSizeKey: pack._key, packLabel: packLabel(pack) });
                }}
              >
                {needsPack && (
                  <option disabled value="">
                    Choose a pack size
                  </option>
                )}
                {packSizes.map((pack) => (
                  <option key={pack._key} value={pack._key}>
                    {packLabel(pack)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <QuantityStepper
            className="h-11 w-36"
            id={`${idPrefix}-qty`}
            label={line.name}
            value={line.quantity}
            onChange={(quantity) => updateItem(key, { quantity })}
          />
        </div>
      )}

      {problem !== "missing" && problem !== "unavailable" && (
        <div>
          <label className="sr-only" htmlFor={`${idPrefix}-note`}>
            Note for {line.name}
          </label>
          <input
            className="h-11 w-full min-w-0 rounded border border-separator bg-surface px-3 text-sm text-foreground placeholder:text-foreground/40 focus:border-accent focus:outline-none"
            id={`${idPrefix}-note`}
            maxLength={300}
            placeholder="Add a note, e.g. food-grade required, monthly supply"
            type="text"
            value={noteText}
            onBlur={() => {
              noteFocused.current = false;
              setNoteText(line.note ?? "");
            }}
            onChange={(event) => {
              setNoteText(event.target.value);
              updateItem(key, { note: event.target.value });
            }}
            onFocus={() => {
              noteFocused.current = true;
            }}
          />
        </div>
      )}
    </li>
  );
};
