import type { ContactMessage } from "./schema";

import { siteConfig } from "@/config/site";
import { detailRows, emailLayout, escapeHtml, formatBotswanaTime } from "@/lib/email/html";
import { internalRecipients, sendEmail } from "@/lib/email/send";
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
 * Sends a contact-form message to the company sales inbox and a short
 * acknowledgement to the sender. As with RFQs, only the staff email can throw:
 * a failed acknowledgement is logged, not shown to someone whose message did
 * arrive.
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

  await sendEmail({
    to: internalRecipients([siteConfig.contact.email]),
    replyTo: message.email,
    idempotencyKey: `contact-${reference}-staff`,
    subject: `Website enquiry ${reference} — ${message.name}`,
    html: emailLayout({
      heading: `New website enquiry ${reference}`,
      body: `<table role="presentation" cellpadding="0" cellspacing="0">${detailRows(details)}</table>
        <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">Reply to this email to answer ${escapeHtml(message.name)} directly.</p>`,
    }),
    text: `New website enquiry ${reference}\n\n${details
      .filter((row): row is [string, string] => Boolean(row[1]))
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n")}\n\nReply to this email to answer ${message.name} directly.`,
  });

  try {
    await sendEmail({
      to: message.email,
      replyTo: siteConfig.contact.email,
      idempotencyKey: `contact-${reference}-sender`,
      subject: "We've received your message",
      html: emailLayout({
        heading: "We've received your message",
        body: `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111827;">Hi ${escapeHtml(message.name)},</p>
          <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111827;">Thank you for getting in touch. Our technical team will respond within one business day with specifications, pricing and availability. Your reference is <strong>${escapeHtml(reference)}</strong>.</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">Urgent? Call ${escapeHtml(siteConfig.contact.phone)} (${escapeHtml(siteConfig.contact.hours)}).</p>`,
      }),
      text: `Hi ${message.name},\n\nThank you for getting in touch. Our technical team will respond within one business day with specifications, pricing and availability. Your reference is ${reference}.\n\nUrgent? Call ${siteConfig.contact.phone} (${siteConfig.contact.hours}).`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[contact] ${reference}: acknowledgement email failed`, error);
  }
}
