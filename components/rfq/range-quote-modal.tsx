"use client";

import * as React from "react";
import { Button, Modal } from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { useRfq } from "@/lib/rfq/store";

/** A product range in plain text (no stega), as stored in the quote. */
export type QuoteRange = { slug: string; name: string };

type RangeQuoteModalProps = {
  /** The range the visitor picked; null keeps the modal closed. */
  range: QuoteRange | null;
  onClose: () => void;
};

/**
 * Shown when a visitor picks a range whose products aren't listed online yet
 * (or while products are hidden): says so, and offers the quote form with
 * that range already added.
 */
export const RangeQuoteModal = ({ range, onClose }: RangeQuoteModalProps) => {
  const { addRange } = useRfq();
  const router = useRouter();
  // Keep the last range's name while the modal animates closed.
  const lastRange = React.useRef<QuoteRange | null>(range);

  if (range) lastRange.current = range;
  const shown = range ?? lastRange.current;

  const proceed = () => {
    if (!shown) return;
    // "full" still goes on: the form shows the ranges already chosen.
    addRange(shown.slug);
    router.push("/rfq");
  };

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={range !== null}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <Modal.Container placement="center" size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{shown?.name}</p>
              <Modal.Heading className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                We&apos;re still listing these products online
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-base leading-relaxed text-muted">
                You can still request anything from this range through our quote form. Tell us what you need and
                we&apos;ll reply with a quotation, usually within one business day.
              </p>
            </Modal.Body>
            <Modal.Footer className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button slot="close" variant="tertiary">
                Keep browsing
              </Button>
              <Button variant="primary" onPress={proceed}>
                Continue to quote form
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

type RangeCardLinkProps = {
  href: string;
  className?: string;
  /** Set for ranges that aren't listed yet: the click opens the modal instead. */
  range?: QuoteRange | null;
  children: React.ReactNode;
};

/**
 * A range card's link. For a range that isn't listed yet it opens the quote
 * modal in place; the href still works before hydration or with JS off.
 */
export const RangeCardLink = ({ href, className, range, children }: RangeCardLinkProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <NextLink
        className={className}
        href={href}
        onClick={(event) => {
          if (!range || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
          event.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </NextLink>
      {range && <RangeQuoteModal range={open ? range : null} onClose={() => setOpen(false)} />}
    </>
  );
};

/**
 * Opens the modal for a range named in the URL (`?category=<slug>`, from nav,
 * footer or home links). Closing it cleans the URL so a refresh doesn't reopen it.
 */
export const RangeQuoteFromUrl = ({ range, basePath }: { range: QuoteRange; basePath: string }) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(true);

  return (
    <RangeQuoteModal
      range={open ? range : null}
      onClose={() => {
        setOpen(false);
        router.replace(basePath, { scroll: false });
      }}
    />
  );
};
