"use client";

import { NumberField } from "@heroui/react";
import clsx from "clsx";

import { RFQ_MAX_QUANTITY } from "@/lib/rfq/schema";

export const clampQuantity = (n: number) =>
  Number.isFinite(n) ? Math.min(RFQ_MAX_QUANTITY, Math.max(1, Math.round(n))) : 1;

type QuantityStepperProps = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  /** Accessible name suffix, e.g. the product name on the /rfq list. */
  label?: string;
  /** Shorter on desktop (36px) for dense tables; stays 44px on touch sizes. */
  compact?: boolean;
  className?: string;
};

/** − [n] + quantity input (HeroUI NumberField), limited to whole numbers
 *  from 1 to 10 000. Typed values commit on blur or Enter. */
export const QuantityStepper = ({ id, value, onChange, label, compact, className }: QuantityStepperProps) => (
  <NumberField
    aria-label={label ? `Quantity for ${label}` : "Quantity"}
    className={clsx("shrink-0", className)}
    formatOptions={{ maximumFractionDigits: 0, useGrouping: false }}
    id={id}
    maxValue={RFQ_MAX_QUANTITY}
    minValue={1}
    step={1}
    value={value}
    variant="secondary"
    // Clearing the field and leaving it reports NaN: fall back to 1.
    onChange={(next) => onChange(clampQuantity(next))}
  >
    <NumberField.Group className={compact ? "h-11 md:h-9" : "h-11"}>
      <NumberField.DecrementButton className="h-full" />
      <NumberField.Input className="min-w-10 text-center font-mono" />
      <NumberField.IncrementButton className="h-full" />
    </NumberField.Group>
  </NumberField>
);
