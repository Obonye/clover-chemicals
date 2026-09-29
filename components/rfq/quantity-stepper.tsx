"use client";

import * as React from "react";
import clsx from "clsx";

import { RFQ_MAX_QUANTITY } from "@/lib/rfq/schema";

export const clampQuantity = (n: number) =>
  Number.isFinite(n) ? Math.min(RFQ_MAX_QUANTITY, Math.max(1, Math.round(n))) : 1;

type QuantityStepperProps = {
  id: string;
  value: number;
  onChange: (value: number) => void;
  /** Accessible name suffix, e.g. the product name on the /rfq list. */
  label?: string;
  className?: string;
};

/** − [n] + stepper. Typing is allowed; the value is clamped to 1–10 000 on
 *  every valid keystroke and normalised on blur. */
export const QuantityStepper = ({ id, value, onChange, label, className }: QuantityStepperProps) => {
  const [text, setText] = React.useState(String(value));

  // Follow outside changes (e.g. a merge in another tab) unless mid-edit.
  React.useEffect(() => {
    setText((current) => (Number(current) === value ? current : String(value)));
  }, [value]);

  const set = (next: number) => {
    const clamped = clampQuantity(next);

    setText(String(clamped));
    onChange(clamped);
  };

  const suffix = label ? ` for ${label}` : "";

  return (
    <div
      aria-label={`Quantity${suffix}`}
      className={clsx("flex shrink-0 items-stretch overflow-hidden rounded border border-separator", className)}
      role="group"
    >
      <button
        aria-label={`Decrease quantity${suffix}`}
        className="w-10 shrink-0 text-base text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
        disabled={value <= 1}
        type="button"
        onClick={() => set(value - 1)}
      >
        −
      </button>
      <label className="sr-only" htmlFor={id}>
        Quantity{suffix}
      </label>
      <input
        className="w-full min-w-10 border-x border-separator bg-transparent text-center font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
        id={id}
        inputMode="numeric"
        max={RFQ_MAX_QUANTITY}
        min={1}
        type="number"
        value={text}
        onBlur={() => set(Number(text))}
        onChange={(event) => {
          setText(event.target.value);
          const parsed = Number(event.target.value);

          if (event.target.value !== "" && Number.isFinite(parsed)) onChange(clampQuantity(parsed));
        }}
      />
      <button
        aria-label={`Increase quantity${suffix}`}
        className="w-10 shrink-0 text-base text-muted transition-colors hover:bg-surface-secondary hover:text-foreground disabled:opacity-40"
        disabled={value >= RFQ_MAX_QUANTITY}
        type="button"
        onClick={() => set(value + 1)}
      >
        +
      </button>
    </div>
  );
};
