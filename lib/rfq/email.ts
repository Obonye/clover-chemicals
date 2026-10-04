import type { RfqContact, RfqLineItem } from "./types";

export type RfqEmailPayload = {
  reference: string;
  contact: RfqContact;
  /** Lines rebuilt from Sanity — never the browser's copy. */
  items: RfqLineItem[];
  submittedAt: Date;
};

/**
 * Sends the RFQ to the relevant division inbox(es) and a confirmation to the
 * buyer.
 *
 * STUB: email delivery is its own ticket (provider, templates, routing per
 * division). Until then this only logs in development, so the submit path can
 * be exercised end to end. Throwing here surfaces as a "couldn't send" error
 * in the form, which is the contract the real implementation should keep.
 */
export async function sendRfqEmails(payload: RfqEmailPayload): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.info(
      `[rfq] ${payload.reference} from ${payload.contact.email} (email stubbed)\n` +
        payload.items
          .map((l) => `  - ${l.quantity} × ${l.name}${l.packLabel ? ` (${l.packLabel})` : ""} [${l.division}]`)
          .join("\n"),
    );
  }
}
