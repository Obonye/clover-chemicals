"use client";

import NextLink from "next/link";
import clsx from "clsx";

import { useRfq } from "@/lib/rfq/store";

/** Screen-reader label for the RFQ entry point, e.g. "Request for quote, 3 items". */
export const rfqAccessibleName = (count: number) =>
  `Request for quote, ${count} item${count === 1 ? "" : "s"}`;

/** Item count once the store has read localStorage, 0 before that — so the
 *  server render and first client render always agree. */
export const useRfqNavCount = () => {
  const { count, hydrated } = useRfq();

  return hydrated ? count : 0;
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
  /** Desktop only: text colour classes, which change over transparent heroes. */
  className?: string;
  onNavigate?: () => void;
};

/**
 * The navbar's quote entry point. With an empty list it's the familiar
 * "Get a Quote"; once items are added it becomes "RFQ" with a count badge.
 * Both go to /rfq, which also explains the flow and links to /contact.
 */
export const RfqNavButton = ({ variant, className, onNavigate }: RfqNavButtonProps) => {
  const count = useRfqNavCount();
  const hasItems = count > 0;

  if (variant === "drawer") {
    return (
      <NextLink
        aria-label={hasItems ? rfqAccessibleName(count) : undefined}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-accent px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
        href="/rfq"
        onClick={onNavigate}
      >
        {hasItems ? (
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

  return (
    <NextLink
      aria-label={hasItems ? rfqAccessibleName(count) : undefined}
      className={clsx(
        "inline-flex items-center gap-2 whitespace-nowrap rounded px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
        className,
      )}
      href="/rfq"
      onClick={onNavigate}
    >
      {hasItems ? (
        <>
          RFQ
          <Badge count={count} />
        </>
      ) : (
        "Get a Quote"
      )}
    </NextLink>
  );
};

/** Compact count dot for the mobile hamburger. Decorative: the hamburger's
 *  own aria-label carries the count. */
export const RfqHamburgerBadge = () => {
  const count = useRfqNavCount();

  if (count === 0) return null;

  return <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[10px]" count={count} />;
};
