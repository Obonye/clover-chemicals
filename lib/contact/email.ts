import type { ContactMessage } from "./schema";

import { enquiryTypes, inboxesForEnquiry } from "@/config/enquiry-routing";
import { formatBotswanaTime } from "@/lib/email/format";
import { sendEmail, staffCc } from "@/lib/email/send";
import { renderEnquiryEmail } from "@/lib/email/templates/enquiry-email";

export type ContactEmailPayload = {
  reference: string;
  message: ContactMessage;
  submittedAt: Date;
};

const enquiryLabel = (id: string): string => enquiryTypes.find((type) => type.id === id)?.label ?? id;

/**
 * Sends a contact-form message as a single email: to the sender, with the
 * inboxes for its nature of enquiry on CC (one Resend send per enquiry) — the
 * team for most, one person for a complaint; see config/enquiry-routing.ts.
 * Replies go to them. Throwing surfaces as the form's "couldn't send" error.
 */
export async function sendContactEmails({ reference, message, submittedAt }: ContactEmailPayload): Promise<void> {
  const { html, text, attachments } = await renderEnquiryEmail({
    preview: `We've received your message ${reference}. We'll respond within one business day.`,
    heading: "We've received your message",
    kind: "Message",
    reference,
    receivedAt: formatBotswanaTime(submittedAt),
    name: message.name,
    intro:
      "Thank you for getting in touch. Our team will respond within one business day with specifications, pricing and availability.",
    details: [
      ["Name", message.name],
      ["Company", message.company],
      ["Email", message.email],
      ["Phone", message.phone],
      ["Nature of enquiry", enquiryLabel(message.enquiryType)],
      ["Message", message.message],
    ],
  });

  await sendEmail({
    to: message.email,
    cc: staffCc(inboxesForEnquiry(message.enquiryType), message.email),
    replyTo: staffCc(inboxesForEnquiry(message.enquiryType), ""),
    idempotencyKey: `contact-${reference}`,
    subject: `We've received your message ${reference}`,
    html,
    text,
    attachments,
  });
}
