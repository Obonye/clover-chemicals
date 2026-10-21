import { Resend } from "resend";

/**
 * The Google Workspace mailbox Clover uses for everything website-related. It
 * is the sender, and the inbox for enquiries that don't clearly belong to one
 * department. Enquiries that do are routed to that department instead (see
 * config/enquiry-routing.ts and each division's contacts).
 */
export const WEBSITE_INBOX = process.env.EMAIL_WEBSITE_INBOX ?? "info@cloverindustries.co.bw";

/**
 * Sender on the domain verified in Resend — any address on that domain works,
 * no mailbox needed. Override with EMAIL_FROM if the verified domain differs
 * (e.g. a subdomain such as send.…).
 */
const FROM = process.env.EMAIL_FROM ?? `Clover Industries <${WEBSITE_INBOX}>`;

export type OutgoingEmail = {
  to: string | string[];
  /** Staff inboxes riding along on the buyer's email, so one send reaches everyone. */
  cc?: string[];
  subject: string;
  html: string;
  text: string;
  /** Where a human reply should land — the staff inbox(es), not the no-reply sender. */
  replyTo?: string | string[];
  /** Resend dedupes sends with the same key for 24h, so a retried action can't double-send. */
  idempotencyKey?: string;
  /** Images the HTML references as `cid:<contentId>`, sent inline. */
  attachments?: Array<{ filename: string; content: Buffer; contentType: string; contentId: string }>;
};

let client: Resend | undefined;

function getClient(): Resend | undefined {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) return undefined;
  client ??= new Resend(apiKey);

  return client;
}

/**
 * The staff inboxes to CC — the ones the enquiry was routed to. When
 * EMAIL_INBOX_OVERRIDE is set (preview/staging, or while testing against the
 * live Resend domain) they're replaced by that one address, so no real inbox is
 * mailed. `sender` is dropped from the list, so nobody appears twice (as when
 * the buyer is also the override address).
 */
export function staffCc(addresses: string[], sender: string): string[] {
  const override = process.env.EMAIL_INBOX_OVERRIDE?.trim();
  const wanted = override ? [override] : addresses;
  const seen = new Set([sender.toLowerCase()]);

  return wanted.filter((address) => {
    const key = address.toLowerCase();

    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });
}

/**
 * Sends one email through Resend. Throws on any failure — callers turn that
 * into the form's "couldn't send" error.
 *
 * Without RESEND_API_KEY it logs instead of sending in development, so the
 * forms work end to end on a fresh clone. In production a missing key is a
 * misconfiguration and throws rather than reporting a send that never happened.
 */
export async function sendEmail({ idempotencyKey, replyTo, cc, attachments, ...email }: OutgoingEmail): Promise<void> {
  const resend = getClient();

  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }

    // eslint-disable-next-line no-console
    console.info(
      `[email] RESEND_API_KEY not set — not sending.\n  to: ${[email.to].flat().join(", ")}${cc?.length ? `\n  cc: ${cc.join(", ")}` : ""}\n  subject: ${email.subject}\n\n${email.text}`,
    );

    return;
  }

  const { error } = await resend.emails.send(
    { from: FROM, replyTo, cc: cc?.length ? cc : undefined, attachments, ...email },
    idempotencyKey ? { idempotencyKey } : undefined,
  );

  if (error) {
    throw new Error(`Resend rejected the email (${error.name}): ${error.message}`);
  }
}
