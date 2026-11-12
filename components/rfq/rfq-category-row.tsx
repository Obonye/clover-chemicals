"use client";

import type { RfqCategoryLine } from "@/lib/rfq/types";

import * as React from "react";
import { Button, Description, FieldError, Input, Label, TextArea, TextField } from "@heroui/react";

import { getDivisionBySanityValue } from "@/config/divisions";
import { rfqLineKey } from "@/lib/rfq/schema";
import { useRfq } from "@/lib/rfq/store";

const TrashIcon = () => (
  <svg aria-hidden="true" fill="none" height={18} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={18}>
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type RfqCategoryRowProps = {
  line: RfqCategoryLine;
  /** Show "required" styling once the buyer has tried to send. */
  showRequired?: boolean;
};

/**
 * A request for a whole product range (CI-73): the buyer says in their own
 * words what they need. Details are required to send; quantity and pack
 * size are optional free-form hints.
 */
export const RfqCategoryRow = ({ line, showRequired = false }: RfqCategoryRowProps) => {
  const { updateItem, removeItem } = useRfq();
  const key = rfqLineKey(line);
  const idPrefix = React.useId();
  const division = getDivisionBySanityValue(line.division);

  // The stored value is only written on change, but typing keeps its own
  // text so spaces aren't swallowed; it re-syncs from the store on blur or
  // when another tab edits it.
  const [details, setDetails] = React.useState(line.details);
  const [packSize, setPackSize] = React.useState(line.packSize ?? "");
  const detailsFocused = React.useRef(false);

  React.useEffect(() => {
    if (!detailsFocused.current) setDetails(line.details);
  }, [line.details]);
  React.useEffect(() => setPackSize(line.packSize ?? ""), [line.packSize]);

  const empty = details.trim() === "";

  return (
    <li
      className="flex flex-col gap-4 rounded-xl border border-separator bg-surface p-4 sm:p-5"
      data-rfq-line={key}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
            Product range{division ? ` · ${division.shortName}` : ""}
          </p>
          <h3 className="mt-0.5 text-base font-bold leading-tight text-foreground">{line.categoryName}</h3>
        </div>
        <Button
          isIconOnly
          aria-label={`Remove ${line.categoryName} from RFQ`}
          className="-mr-1 -mt-1 h-11 w-11 shrink-0 text-muted hover:text-danger md:h-9 md:w-9"
          variant="ghost"
          onPress={() => removeItem(key)}
        >
          <TrashIcon />
        </Button>
      </div>

      <TextField fullWidth isInvalid={showRequired && empty} isRequired variant="secondary">
        <Label>Tell us what you need</Label>
        <TextArea
          data-rfq-details={key}
          id={`${idPrefix}-details`}
          maxLength={1000}
          placeholder="Products, grades or brands, how much, how often, anything we should know."
          rows={3}
          value={details}
          onBlur={() => {
            detailsFocused.current = false;
            setDetails(line.details);
          }}
          onChange={(event) => {
            setDetails(event.target.value);
            updateItem(key, { details: event.target.value });
          }}
          onFocus={() => {
            detailsFocused.current = true;
          }}
        />
        <Description>We reply with a quotation, usually within one business day.</Description>
        <FieldError>Tell us what you need so we can quote it.</FieldError>
      </TextField>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField fullWidth variant="secondary">
          <Label>Quantity (optional)</Label>
          <Input
            className="h-11"
            inputMode="numeric"
            placeholder="e.g. 20"
            type="text"
            value={line.quantity ? String(line.quantity) : ""}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "");

              updateItem(key, { quantity: digits ? Number(digits) : undefined });
            }}
          />
        </TextField>
        <TextField fullWidth variant="secondary">
          <Label>Pack size (optional)</Label>
          <Input
            className="h-11"
            maxLength={100}
            placeholder="e.g. 25 L drums"
            type="text"
            value={packSize}
            onChange={(event) => {
              setPackSize(event.target.value);
              updateItem(key, { packSize: event.target.value });
            }}
          />
        </TextField>
      </div>
    </li>
  );
};
