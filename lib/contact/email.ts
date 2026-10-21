import type { ContactMessage } from "./schema";

import { isProductEnquiry, productInbox } from "@/config/enquiry-routing";
import { formatBotswanaTime } from "@/lib/email/format";
import { sendEmail, staffCc, WEBSITE_INBOX } from "@/lib/email/send";
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
 * right inbox on CC (one Resend send per enquiry): Sales for product enquiries,
 * the website inbox otherwise — see config/enquiry-routing.ts. Replies go to
 * that inbox. Throwing surfaces as the form's "couldn't send" error.
 */
export async function sendContactEmails({ reference, message, submittedAt }: ContactEmailPayload): Promise<void> {
  const inbox = isProductEnquiry(message.product) ? productInbox : WEBSITE_INBOX;
  const { html, text } = await renderEnquiryEmail({
    preview: `We've received your message ${reference}. We'll respond within one business day.`,
    heading: "We've received your message",
    kind: "Message",
    reference,
    name: message.name,
    intro:
      "Thank you for getting in touch. Our team will respond within one business day with specifications, pricing and availability.",
    details: [
      ["Received", formatBotswanaTime(submittedAt)],
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
    cc: staffCc([inbox], message.email),
    replyTo: staffCc([inbox], ""),
    idempotencyKey: `contact-${reference}`,
    subject: `We've received your message ${reference}`,
    html,
    text,
  });
}
