import { Resend } from "resend";

/**
 * Sender on the domain verified in Resend. Override with EMAIL_FROM if the
 * verified sending address differs (e.g. a subdomain such as send.…).
 */
const FROM = process.env.EMAIL_FROM ?? "Clover Industries <noreply@cloverindustries.co.bw>";

export type OutgoingEmail = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  /** Where a human reply should land: the buyer on staff mail, sales on confirmations. */
  replyTo?: string;
  /** Resend dedupes sends with the same key for 24h, so a retried action can't double-send. */
  idempotencyKey?: string;
};

let client: Resend | undefined;

function getClient(): Resend | undefined {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) return undefined;
  client ??= new Resend(apiKey);

  return client;
}

/**
 * Routes staff-facing mail. When EMAIL_INBOX_OVERRIDE is set (preview/staging,
 * or while testing against the live Resend domain), every internal email goes
 * there instead of the real division inboxes. Buyer confirmations are never
 * redirected.
 */
export function internalRecipients(addresses: string[]): string[] {
  const override = process.env.EMAIL_INBOX_OVERRIDE?.trim();

  return override ? [override] : Array.from(new Set(addresses));
}

/**
 * Sends one email through Resend. Throws on any failure — callers turn that
 * into the form's "couldn't send" error.
 *
 * Without RESEND_API_KEY it logs instead of sending in development, so the
 * forms work end to end on a fresh clone. In production a missing key is a
 * misconfiguration and throws rather than reporting a send that never happened.
 */
export async function sendEmail({ idempotencyKey, replyTo, ...email }: OutgoingEmail): Promise<void> {
  const resend = getClient();

  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }

    // eslint-disable-next-line no-console
    console.info(
      `[email] RESEND_API_KEY not set — not sending.\n  to: ${[email.to].flat().join(", ")}\n  subject: ${email.subject}\n\n${email.text}`,
    );

    return;
  }

  const { error } = await resend.emails.send(
    { from: FROM, replyTo, ...email },
    idempotencyKey ? { idempotencyKey } : undefined,
  );

  if (error) {
    throw new Error(`Resend rejected the email (${error.name}): ${error.message}`);
  }
}
