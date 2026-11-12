"use client";

import type { Division, Product } from "@/sanity/lib/types";

import * as React from "react";
import { Button } from "@heroui/react";
import NextLink from "next/link";
import { stegaClean } from "next-sanity";

import { PackSizeSelect } from "@/components/rfq/pack-size-select";
import { QuantityStepper } from "@/components/rfq/quantity-stepper";
import { RFQ_MAX_ITEMS, RfqLineItemSchema } from "@/lib/rfq/schema";
import { useRfq } from "@/lib/rfq/store";
import { packLabel } from "@/sanity/lib/format";

type AddToRfqProps = {
  product: Product;
  /** Sanity division of the product's category. Without one the control
   *  can't build a valid line, so it stays a plain enquiry link. */
  division: Division | null | undefined;
  /** "card" for product grids, "lg" for the product detail page. */
  size?: "card" | "lg";
};

type Status = "idle" | "added" | "full";

export const AddToRfq = ({ product, division, size = "card" }: AddToRfqProps) => {
  const { addItem, hydrated } = useRfq();
  const idPrefix = React.useId();

  const packSizes = React.useMemo(
    () => (product.packSizes ?? []).filter((pack) => packLabel(pack)),
    [product.packSizes],
  );
  const [packKey, setPackKey] = React.useState<string | null>(packSizes[0]?._key ?? null);
  const [quantity, setQuantity] = React.useState(1);
  const [status, setStatus] = React.useState<Status>("idle");
  const resetTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const slug = product.slug ? stegaClean(product.slug) : null;
  const name = product.name ? stegaClean(product.name) : null;
  const fallbackHref = slug ? `/contact?product=${encodeURIComponent(slug)}` : "/contact";
  const unavailable = product.available === false;
  const selectedPack = packSizes.find((pack) => pack._key === packKey) ?? null;

  const line =
    division && slug && name
      ? RfqLineItemSchema.safeParse({
          productId: product._id,
          slug,
          name,
          grade: product.grade ? stegaClean(product.grade) : null,
          division: stegaClean(division),
          packSizeKey: selectedPack?._key ?? null,
          packLabel: selectedPack ? packLabel(selectedPack) : null,
          quantity,
        })
      : null;
  const canAdd = hydrated && !unavailable && line?.success === true;

  const handleAdd = (event: React.SyntheticEvent) => {
    // Before hydration (or with JS off) the anchor's href takes over.
    if (!canAdd || !line?.success) return;
    event.preventDefault();

    const result = addItem(line.data);

    if (resetTimer.current) clearTimeout(resetTimer.current);
    setStatus(result === "full" ? "full" : "added");
    resetTimer.current = setTimeout(() => setStatus("idle"), result === "full" ? 6000 : 3500);
  };

  const lg = size === "lg";
  const controlHeight = lg ? "h-12" : "h-11";
  const statusMessage =
    status === "added"
      ? `Added ${quantity} × ${name ?? "product"}${selectedPack ? ` (${packLabel(selectedPack)})` : ""} to your RFQ`
      : status === "full"
        ? `Your RFQ already has ${RFQ_MAX_ITEMS} items. Send it or remove some before adding more.`
        : "";

  // Medical sales vary by request, so Medical products don't go into the RFQ
  // list: the buyer sends the simple contact form, routed to Medical (CI-41).
  if (division && stegaClean(division) === "medical") {
    const medicalHref = `/contact?enquiry=medical${slug ? `&product=${encodeURIComponent(slug)}` : ""}`;

    return (
      <NextLink
        className={`inline-flex ${controlHeight} w-full items-center justify-center rounded bg-accent px-4 font-mono font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${lg ? "text-sm" : "text-xs"}`}
        href={medicalHref}
      >
        Request a quote
      </NextLink>
    );
  }

  if (unavailable) {
    return (
      <div className="flex flex-col gap-1.5">
        <Button
          fullWidth
          isDisabled
          aria-describedby={`${idPrefix}-unavailable`}
          className={`${controlHeight} font-mono text-xs uppercase tracking-wider`}
          variant="outline"
        >
          Add to RFQ
        </Button>
        <p className="text-xs text-muted" id={`${idPrefix}-unavailable`}>
          Currently unavailable,{" "}
          <NextLink className="font-semibold text-accent underline-offset-2 hover:underline" href={fallbackHref}>
            ask us
          </NextLink>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch gap-2">
        {packSizes.length > 1 && (
          <PackSizeSelect
            className="flex-1"
            label={`Pack size for ${name ?? "this product"}`}
            packSizes={packSizes}
            value={packKey}
            onChange={(pack) => setPackKey(pack._key)}
          />
        )}

        <QuantityStepper
          className={packSizes.length > 1 ? "w-32" : "flex-1"}
          id={`${idPrefix}-qty`}
          value={quantity}
          onChange={setQuantity}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* A real link so the CTA still works before hydration or with JS
            off; once hydrated, the click adds to the RFQ instead. */}
        <NextLink
          className={`inline-flex ${controlHeight} flex-1 items-center justify-center gap-1.5 rounded bg-accent px-4 font-mono font-semibold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${lg ? "text-sm" : "text-xs"}`}
          href={fallbackHref}
          role={canAdd ? "button" : undefined}
          onClick={handleAdd}
          onKeyDown={(event) => {
            // role="button" promises Space activation; anchors only do Enter.
            if (event.key === " ") handleAdd(event);
          }}
        >
          {status === "added" ? "Added ✓" : "Add to RFQ"}
        </NextLink>
        {status === "added" && (
          <NextLink
            className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wider text-accent underline-offset-2 hover:underline"
            href="/rfq"
          >
            View RFQ
          </NextLink>
        )}
      </div>

      <p aria-live="polite" className={status === "full" ? "text-xs text-danger" : "sr-only"} role="status">
        {statusMessage}
      </p>
    </div>
  );
};
