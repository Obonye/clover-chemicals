"use client";

import * as React from "react";
import { Button, Modal } from "@heroui/react";
import Image from "next/image";
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
        <Modal.Container placement="center" size="lg">
          {/* Full-bleed photo; a dark gradient rises behind the text so it reads
              in light and dark themes alike. */}
          <Modal.Dialog className="relative min-h-[30rem] justify-end overflow-hidden bg-black p-0 text-white">
            <Image
              alt=""
              className="object-cover object-center"
              fill
              sizes="(min-width: 640px) 32rem, 100vw"
              src="/quote-modal-warehouse.png"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black via-black/75 to-black/10"
            />
            <Modal.CloseTrigger className="z-20 bg-black/40 text-white hover:bg-black/60" />

            <div className="relative z-10 flex flex-col gap-4 p-6 pt-24 sm:p-8 sm:pt-32">
              <Modal.Header>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/70">{shown?.name}</p>
                <Modal.Heading className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  We&apos;re still listing these products online
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-base leading-relaxed text-white/80">
                  You can still request anything from this range through our quote form. Tell us what you need and
                  we&apos;ll reply with a quotation, usually within one business day.
                </p>
              </Modal.Body>
              <Modal.Footer className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button className="bg-white/10 text-white hover:bg-white/20" slot="close" variant="tertiary">
                  Keep browsing
                </Button>
                <Button className="bg-white text-black hover:bg-white/90" variant="primary" onPress={proceed}>
                  Continue to quote form
                </Button>
              </Modal.Footer>
            </div>
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
