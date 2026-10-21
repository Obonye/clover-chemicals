import type { RfqContact, RfqLineItem } from "./types";
import type { EnquiryGroup } from "@/lib/email/templates/enquiry-email";

import { getBranch } from "@/config/branches";
import { getDivisionBySanityValue } from "@/config/divisions";
import { productInbox } from "@/config/enquiry-routing";
import { formatBotswanaTime } from "@/lib/email/format";
import { sendEmail, staffCc } from "@/lib/email/send";
import { renderEnquiryEmail } from "@/lib/email/templates/enquiry-email";

export type RfqEmailPayload = {
  reference: string;
  contact: RfqContact;
  /** Lines rebuilt from Sanity — never the browser's copy. */
  items: RfqLineItem[];
  submittedAt: Date;
};

/** Lines grouped under the division that sells them, so the email reads clearly. */
function groupByDivision(items: RfqLineItem[]): EnquiryGroup[] {
  const groups = new Map<string, EnquiryGroup>();

  for (const line of items) {
    const division = getDivisionBySanityValue(line.division);
    const key = division?.slug ?? line.division;
    const group = groups.get(key) ?? {
      name: division?.name ?? line.division,
      // Hex only: email clients can't parse the oklch() accents some themes use.
      accent: division?.theme?.ogAccent ?? division?.theme?.accent,
      lines: [],
    };

    group.lines.push({
      label: `${line.name}${line.grade ? ` — ${line.grade}` : ""}${line.packLabel ? ` (${line.packLabel})` : ""}`,
      quantity: line.quantity,
      note: line.note,
    });
    groups.set(key, group);
  }

  return Array.from(groups.values());
}

function fulfilmentSummary({ fulfilment, branch, deliveryLocation }: RfqContact): string {
  if (fulfilment === "collection") {
    return `Collection from ${(branch && getBranch(branch)?.name) ?? branch ?? "a branch"}`;
  }

  return `Delivery to ${deliveryLocation}`;
}

/**
 * Sends the RFQ as a single email: to the buyer, with Sales on CC (every RFQ is
 * about products — see config/enquiry-routing.ts). One Resend send per request
 * keeps usage low on the free tier, and it can't half-succeed — either everyone
 * got it or the form shows "couldn't send".
 *
 * Replies go to Sales so the buyer's answer reaches staff; the team can
 * reply-all to answer the buyer directly. Throwing surfaces as the form's
 * "couldn't send" error.
 */
export async function sendRfqEmails({ reference, contact, items, submittedAt }: RfqEmailPayload): Promise<void> {
  const groups = groupByDivision(items);
  const { html, text } = await renderEnquiryEmail({
    preview: `We've received your quote request ${reference}. We'll respond within one business day.`,
    heading: "We've received your quote request",
    kind: "Quote request",
    reference,
    name: contact.fullName,
    intro:
      "Thank you for your request. Our team will come back to you with availability and pricing within one business day.",
    details: [
      ["Received", formatBotswanaTime(submittedAt)],
      ["Name", contact.fullName],
      ["Company", contact.company],
      ["Email", contact.email],
      ["Phone", contact.phone],
      ["Fulfilment", fulfilmentSummary(contact)],
      [
        "Nearest branch",
        contact.fulfilment === "delivery" && contact.branch ? getBranch(contact.branch)?.name : undefined,
      ],
      ["Required by", contact.requiredBy],
      ["Message", contact.message],
    ],
    // Division headings only help when the request spans more than one.
    groups: groups.length > 1 ? groups : groups.map((group) => ({ ...group, name: undefined })),
  });

  await sendEmail({
    to: contact.email,
    cc: staffCc([productInbox], contact.email),
    replyTo: staffCc([productInbox], ""),
    idempotencyKey: `rfq-${reference}`,
    subject: `Quote request ${reference} received — ${contact.company}`,
    html,
    text,
  });
}
