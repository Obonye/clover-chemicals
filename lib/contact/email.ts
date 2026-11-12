import type { ContactMessage } from "./schema";

import { rfqInboxes } from "@/config/enquiry-routing";
import { formatBotswanaTime } from "@/lib/email/format";
import { sendEmail, staffCc } from "@/lib/email/send";
import { renderEnquiryEmail } from "@/lib/email/templates/enquiry-email";
import { categories } from "@/lib/products";

export type ContactEmailPayload = {
  reference: string;
  message: ContactMessage;
  submittedAt: Date;
};

function productLabel(product: string | undefined): string | undefined {
  if (!product) return undefined;
  if (product === "other") return "Other / Not sure";

  return categories.find((category) => category.id === product)?.label ?? product;
}

/**
 * Sends a contact-form message as a single email: to the sender, with the
 * team inboxes on CC (one Resend send per enquiry) — the same people as an RFQ,
 * see config/enquiry-routing.ts. Replies go to them. Throwing surfaces as the form's "couldn't send" error.
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
      ["Product interest", productLabel(message.product)],
      ["Message", message.message],
    ],
  });

  await sendEmail({
    to: message.email,
    cc: staffCc(rfqInboxes, message.email),
    replyTo: staffCc(rfqInboxes, ""),
    idempotencyKey: `contact-${reference}`,
    subject: `We've received your message ${reference}`,
    html,
    text,
    attachments,
  });
}
