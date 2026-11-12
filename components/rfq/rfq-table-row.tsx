"use client";

import type { RfqLineCheck } from "@/lib/rfq/reconcile";
import type { RfqProductLine as RfqLine } from "@/lib/rfq/types";

import * as React from "react";
import { Button, Input, Tooltip } from "@heroui/react";
import Image from "next/image";
import { Focusable } from "react-aria-components";
import NextLink from "next/link";
import clsx from "clsx";

import { PackSizeSelect } from "@/components/rfq/pack-size-select";
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

const NOTE_HINT =
  "Anything we should know when quoting this item: grade or certification needs, preferred brand, packaging, delivery timing or a regular order schedule.";

const TrashIcon = () => (
  <svg aria-hidden="true" fill="none" height={18} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={18}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type RfqTableRowProps = {
  line: RfqLine;
  /** Undefined while the Sanity check is running or if it failed. */
  check: RfqLineCheck | undefined;
};

export const RfqTableRow = ({ line, check }: RfqTableRowProps) => {
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

  const editable = problem !== "missing" && problem !== "unavailable";
  const packText = !canEditPack && !needsPack ? line.packLabel : null;

  // Below md the row stacks into a small card: product + remove on top,
  // pack + quantity side by side, then the note. No sideways scrolling.
  const cell = "table__cell max-md:border-0 max-md:bg-transparent max-md:p-0";

  return (
    <tr
      className={clsx(
        "table__row md:align-middle",
        "max-md:grid max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-2 max-md:rounded-xl max-md:border max-md:border-separator max-md:bg-surface max-md:p-3",
        problem && "md:[&>td]:bg-warning-soft/40 max-md:border-warning/40 max-md:bg-warning-soft/40",
      )}
      data-rfq-line={key}
    >
      <td className={clsx(cell, "max-md:col-start-1 max-md:row-start-1")}>
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-surface-secondary">
            {src && <Image fill alt="" className="object-cover" sizes="36px" src={src} />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-foreground">
              {href && problem !== "missing" ? (
                <NextLink className="underline-offset-2 hover:underline" href={href}>
                  {line.name}
                </NextLink>
              ) : (
                line.name
              )}
            </p>
            {line.grade && (
              <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-muted">{line.grade}</p>
            )}
          </div>
        </div>
        {problem && (
          <p className="mt-1.5 text-xs leading-snug text-warning-soft-foreground" role="note">
            {PROBLEM_TEXT[problem]}
          </p>
        )}
      </td>

      <td className={clsx(cell, "max-md:col-start-1 max-md:row-start-2", !editable && "max-md:hidden")}>
        {editable && (canEditPack || needsPack) && packSizes.length > 0 ? (
          <PackSizeSelect
            compact
            isInvalid={needsPack}
            label={`Pack size for ${line.name}`}
            packSizes={packSizes}
            value={needsPack ? null : line.packSizeKey}
            onChange={(pack) => updateItem(key, { packSizeKey: pack._key, packLabel: packLabel(pack) })}
          />
        ) : (
          <span className="flex h-11 items-center font-mono text-xs text-muted md:h-9">{packText ?? "—"}</span>
        )}
      </td>

      <td className={clsx(cell, "max-md:col-start-2 max-md:row-start-2 max-md:w-32", !editable && "max-md:hidden")}>
        {editable ? (
          <QuantityStepper
            compact
            id={`${idPrefix}-qty`}
            label={line.name}
            value={line.quantity}
            onChange={(quantity) => updateItem(key, { quantity })}
          />
        ) : (
          <span className="flex h-11 items-center font-mono text-sm text-muted md:h-9">{line.quantity}</span>
        )}
      </td>

      <td className={clsx(cell, "max-md:col-span-2 max-md:row-start-3", !editable && "max-md:hidden")}>
        {editable && (
          <>
            <Tooltip closeDelay={100} delay={300}>
              {/* Focusable lets the input itself trigger the tooltip, on hover
                  and on keyboard focus, without adding a wrapper tab stop. */}
              <Focusable>
                <Input
                  fullWidth
                  aria-describedby={`${idPrefix}-note-hint`}
                  aria-label={`Note for ${line.name}`}
                  className="h-11 text-sm md:h-9"
                  id={`${idPrefix}-note`}
                  maxLength={300}
                  placeholder="Optional note"
                  type="text"
                  value={noteText}
                  variant="secondary"
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
              </Focusable>
              <Tooltip.Content showArrow className="max-w-64" placement="top">
                <Tooltip.Arrow />
                <p className="text-xs leading-relaxed [overflow-wrap:normal] [word-break:normal]">{NOTE_HINT}</p>
              </Tooltip.Content>
            </Tooltip>
            <span className="sr-only" id={`${idPrefix}-note-hint`}>
              {NOTE_HINT}
            </span>
          </>
        )}
      </td>

      <td className={clsx(cell, "text-right max-md:col-start-2 max-md:row-start-1 max-md:-mr-1 max-md:-mt-1")}>
        <Button
          isIconOnly
          aria-label={`Remove ${line.name}${line.packLabel ? ` (${line.packLabel})` : ""} from RFQ`}
          className="h-11 w-11 text-muted hover:text-danger md:h-9 md:w-9"
          variant="ghost"
          onPress={() => removeItem(key)}
        >
          <TrashIcon />
        </Button>
      </td>
    </tr>
  );
};
