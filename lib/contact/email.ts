import type { ContactMessage } from "./schema";

import { isProductEnquiry, productInbox } from "@/config/enquiry-routing";
import { siteConfig } from "@/config/site";
import { detailRows, emailLayout, escapeHtml, formatBotswanaTime } from "@/lib/email/html";
import { sendEmail, staffCc, WEBSITE_INBOX } from "@/lib/email/send";
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
  const details: Array<[string, string | undefined]> = [
    ["Reference", reference],
    ["Received", formatBotswanaTime(submittedAt)],
    ["Name", message.name],
    ["Company", message.company],
    ["Email", message.email],
    ["Phone", message.phone],
    ["Product interest", productLabel(message.product)],
    ["Message", message.message],
  ];
  const intro =
    "Thank you for getting in touch. Our technical team will respond within one business day with specifications, pricing and availability. Reply to this email if you want to add anything.";
  const footer = `Urgent? Call ${siteConfig.contact.phone} (${siteConfig.contact.hours}).`;

  const inbox = isProductEnquiry(message.product) ? productInbox : WEBSITE_INBOX;

  await sendEmail({
    to: message.email,
    cc: staffCc([inbox], message.email),
    replyTo: staffCc([inbox], ""),
    idempotencyKey: `contact-${reference}`,
    subject: `We've received your message ${reference}`,
    html: emailLayout({
      heading: "We've received your message",
      body: `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111827;">Hi ${escapeHtml(message.name)},</p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#111827;">${escapeHtml(intro)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0">${detailRows(details)}</table>
        <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">${escapeHtml(footer)}</p>`,
    }),
    text: `Hi ${message.name},\n\n${intro}\n\n${details
      .filter((row): row is [string, string] => Boolean(row[1]))
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n")}\n\n${footer}`,
  });
}
