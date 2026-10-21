import type { RfqContact, RfqLineItem } from "./types";

import { getBranch } from "@/config/branches";
import { getDivisionBySanityValue } from "@/config/divisions";
import { productInbox } from "@/config/enquiry-routing";
import { siteConfig } from "@/config/site";
import { detailRows, emailLayout, emailStyles, escapeHtml, formatBotswanaTime } from "@/lib/email/html";
import { sendEmail, staffCc } from "@/lib/email/send";

export type RfqEmailPayload = {
  reference: string;
  contact: RfqContact;
  /** Lines rebuilt from Sanity — never the browser's copy. */
  items: RfqLineItem[];
  submittedAt: Date;
};

type DivisionGroup = { name: string; lines: RfqLineItem[] };

/** Lines grouped under the division that sells them, so the email reads clearly. */
function groupByDivision(items: RfqLineItem[]): DivisionGroup[] {
  const groups = new Map<string, DivisionGroup>();

  for (const line of items) {
    const division = getDivisionBySanityValue(line.division);
    const key = division?.slug ?? line.division;
    const group = groups.get(key) ?? {
      name: division?.name ?? line.division,
      lines: [],
    };

    group.lines.push(line);
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

function lineLabel(line: RfqLineItem): string {
  return `${line.name}${line.grade ? ` — ${line.grade}` : ""}${line.packLabel ? ` (${line.packLabel})` : ""}`;
}

function linesTable(groups: DivisionGroup[], { showDivisions }: { showDivisions: boolean }): string {
  return groups
    .map((group) => {
      const rows = group.lines
        .map(
          (line) =>
            `<tr>
              <td style="${emailStyles.td}">${escapeHtml(lineLabel(line))}${
                line.note ? `<br><span style="color:#6b7280;font-size:13px;">Note: ${escapeHtml(line.note)}</span>` : ""
              }</td>
              <td style="${emailStyles.td};text-align:right;white-space:nowrap;">${line.quantity}</td>
            </tr>`,
        )
        .join("");

      return `${
        showDivisions
          ? `<p style="margin:20px 0 6px;font-size:13px;font-weight:700;color:#111827;">${escapeHtml(group.name)}</p>`
          : ""
      }<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:${showDivisions ? "0" : "20px"};">
        <tr><th style="${emailStyles.th}">Product</th><th style="${emailStyles.th};text-align:right;">Qty</th></tr>
        ${rows}
      </table>`;
    })
    .join("");
}

function linesText(groups: DivisionGroup[], { showDivisions }: { showDivisions: boolean }): string {
  return groups
    .map(
      (group) =>
        `${showDivisions ? `${group.name}\n` : ""}${group.lines
          .map((line) => `  - ${line.quantity} × ${lineLabel(line)}${line.note ? `\n      Note: ${line.note}` : ""}`)
          .join("\n")}`,
    )
    .join("\n\n");
}

function rfqEmail({ reference, contact, submittedAt }: RfqEmailPayload, groups: DivisionGroup[]) {
  const details: Array<[string, string | undefined]> = [
    ["Reference", reference],
    ["Received", formatBotswanaTime(submittedAt)],
    ["Name", contact.fullName],
    ["Company", contact.company],
    ["Email", contact.email],
    ["Phone", contact.phone],
    ["Fulfilment", fulfilmentSummary(contact)],
    ["Nearest branch", contact.fulfilment === "delivery" && contact.branch ? getBranch(contact.branch)?.name : undefined],
    ["Required by", contact.requiredBy],
    ["Message", contact.message],
  ];
  const showDivisions = groups.length > 1;
  const intro =
    "Thank you for your request. Our team will come back to you with availability and pricing within one business day. Reply to this email if anything needs changing.";
  const footer = `Urgent? Call ${siteConfig.contact.phone} (${siteConfig.contact.hours}).`;

  return {
    subject: `Quote request ${reference} received — ${contact.company}`,
    html: emailLayout({
      heading: "We've received your quote request",
      body: `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111827;">Hi ${escapeHtml(contact.fullName)},</p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#111827;">${escapeHtml(intro)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0">${detailRows(details)}</table>
        ${linesTable(groups, { showDivisions })}
        <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">${escapeHtml(footer)}</p>`,
    }),
    text: `Hi ${contact.fullName},\n\n${intro}\n\n${details
      .filter((row): row is [string, string] => Boolean(row[1]))
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n")}\n\n${linesText(groups, { showDivisions })}\n\n${footer}`,
  };
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
export async function sendRfqEmails(payload: RfqEmailPayload): Promise<void> {
  const groups = groupByDivision(payload.items);

  await sendEmail({
    to: payload.contact.email,
    cc: staffCc([productInbox], payload.contact.email),
    replyTo: staffCc([productInbox], ""),
    idempotencyKey: `rfq-${payload.reference}`,
    ...rfqEmail(payload, groups),
  });
}
