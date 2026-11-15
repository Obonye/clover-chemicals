import type { ReactNode } from "react";

import { eyebrow } from "@/components/primitives";

type RequestSentProps = {
  /** Small label above the heading, e.g. "Request sent". */
  label: string;
  heading: string;
  /** The reference shown to the visitor (already validated by the page). */
  reference: string;
  /** The "What happens next" paragraph. */
  nextSteps: ReactNode;
  /** Anything after it: notes, links. */
  children?: ReactNode;
};

/**
 * The one confirmation layout for every form (/rfq/sent and /contact/sent,
 * CI-85): label, heading, reference number, then what happens next.
 */
export const RequestSent = ({ label, heading, reference, nextSteps, children }: RequestSentProps) => (
  <>
    <section className="border-b border-separator bg-background">
      <div className="mx-auto max-w-[1280px] px-6 pb-5 pt-8 lg:px-12">
        <p className={eyebrow({ class: "mb-1" })}>{label}</p>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{heading}</h1>
      </div>
    </section>

    <section className="bg-background py-8 lg:py-12">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-6 px-6 lg:px-12">
        <p className="max-w-[60ch] text-base leading-relaxed text-muted">
          Your reference is <span className="font-semibold text-foreground">{reference}</span>. Please quote it if you
          contact us about this request.
        </p>

        <div className="max-w-[60ch]">
          <h2 className="mb-2 font-display text-lg font-extrabold tracking-tight text-foreground">
            What happens next
          </h2>
          <p className="text-base leading-relaxed text-muted">{nextSteps}</p>
        </div>

        {children}
      </div>
    </section>
  </>
);
