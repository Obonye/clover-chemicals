"use client";

import NextLink from "next/link";
import clsx from "clsx";

import { useCatalogEnabled } from "@/components/catalog-state";
import { useRfq } from "@/lib/rfq/store";

/** Screen-reader label for the RFQ entry point, e.g. "Request for quote, 3 items". */
export const rfqAccessibleName = (count: number) =>
  `Request for quote, ${count} item${count === 1 ? "" : "s"}`;

/** Saved products once the store has read localStorage, 0 before that — so the
 *  server render and first client render always agree. Zero while the
 *  catalogue is off (CI-72). */
export const useRfqNavCount = () => {
  const { count, hydrated } = useRfq();
  const catalogEnabled = useCatalogEnabled();

  return hydrated && catalogEnabled ? count : 0;
};

type BadgeProps = {
  count: number;
  /** Swap colours for use on an accent-filled button. */
  inverse?: boolean;
  className?: string;
};

const Badge = ({ count, inverse = false, className }: BadgeProps) => (
  <span
    aria-hidden="true"
    className={clsx(
      "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-bold leading-none tabular-nums",
      inverse ? "bg-accent-foreground text-accent" : "bg-accent text-accent-foreground",
      className,
    )}
  >
    {count > 99 ? "99+" : count}
  </span>
);

type RfqNavButtonProps = {
  variant: "desktop" | "drawer";
  /** Where the button goes; defaults to the RFQ list. */
  href?: string;
  /** Desktop only: text colour classes, which change over transparent heroes. */
  className?: string;
  onNavigate?: () => void;
};

/**
 * The navbar's quote entry point, linking to /rfq (which also explains the
 * flow and links to /contact). In the mobile drawer it shows the item count
 * once there is one.
 */
export const RfqNavButton = ({ variant, href = "/rfq", className, onNavigate }: RfqNavButtonProps) => {
  const count = useRfqNavCount();
  const hasItems = count > 0;

  if (variant === "drawer") {
    return (
      <NextLink
        aria-label={hasItems ? rfqAccessibleName(count) : undefined}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-accent px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
        href={href}
        onClick={onNavigate}
      >
        {hasItems && href === "/rfq" ? (
          <>
            View RFQ
            <Badge inverse count={count} />
          </>
        ) : (
          "Get a Quote"
        )}
      </NextLink>
    );
  }

  // The item count lives on the utility bar's cart icon; this stays a
  // plain call to action.
  return (
    <NextLink
      className={clsx(
        "inline-flex items-center whitespace-nowrap rounded px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
        className,
      )}
      href={href}
      onClick={onNavigate}
    >
      Get a Quote
    </NextLink>
  );
};

const CartIcon = () => (
  <svg aria-hidden="true" fill="none" height={20} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={20}>
    <circle cx="9" cy="20" r="1.25" />
    <circle cx="18" cy="20" r="1.25" />
    <path d="M2.5 3.5h2.6l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1l1.9-7.3H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Cart icon for the utility bar, shared by every division: one RFQ list
 *  holds products from all of them. */
export const RfqCartLink = () => {
  const count = useRfqNavCount();
  const catalogEnabled = useCatalogEnabled();

  // Nothing to collect while the catalogue is off.
  if (!catalogEnabled && count === 0) return null;

  return (
    <NextLink
      aria-label={count > 0 ? rfqAccessibleName(count) : "Request for quote list"}
      className="relative flex h-full min-w-11 shrink-0 items-center justify-center text-white/70 transition-colors duration-150 hover:text-white"
      href="/rfq"
    >
      <CartIcon />
      {count > 0 && <Badge className="absolute right-0 top-1.5 h-4 min-w-4 px-1 text-[10px]" count={count} />}
    </NextLink>
  );
};
