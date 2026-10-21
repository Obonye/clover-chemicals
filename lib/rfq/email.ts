import type { RfqContact, RfqLineItem } from "./types";

import { getBranch } from "@/config/branches";
import { getDivisionBySanityValue } from "@/config/divisions";
import { siteConfig } from "@/config/site";
import { detailRows, emailLayout, emailStyles, escapeHtml, formatBotswanaTime } from "@/lib/email/html";
import { internalRecipients, sendEmail } from "@/lib/email/send";

export type RfqEmailPayload = {
  reference: string;
  contact: RfqContact;
  /** Lines rebuilt from Sanity — never the browser's copy. */
  items: RfqLineItem[];
  submittedAt: Date;
};

type DivisionGroup = { name: string; inbox: string; lines: RfqLineItem[] };

/** Each line goes to the inbox of the division that sells it (config/divisions.ts). */
function groupByDivision(items: RfqLineItem[]): DivisionGroup[] {
  const groups = new Map<string, DivisionGroup>();

  for (const line of items) {
    const division = getDivisionBySanityValue(line.division);
    const key = division?.slug ?? line.division;
    const group = groups.get(key) ?? {
      name: division?.name ?? line.division,
      inbox: division?.contacts[0]?.email ?? siteConfig.contact.email,
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

function staffEmail({ reference, contact, submittedAt }: RfqEmailPayload, groups: DivisionGroup[]) {
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

  return {
    subject: `New RFQ ${reference} — ${contact.company}`,
    html: emailLayout({
      heading: `New quote request ${reference}`,
      body: `<table role="presentation" cellpadding="0" cellspacing="0">${detailRows(details)}</table>${linesTable(groups, { showDivisions })}
        <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">Reply to this email to answer ${escapeHtml(contact.fullName)} directly.</p>`,
    }),
    text: `New quote request ${reference}\n\n${details
      .filter((row): row is [string, string] => Boolean(row[1]))
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n")}\n\n${linesText(groups, { showDivisions })}\n\nReply to this email to answer ${contact.fullName} directly.`,
  };
}

function buyerEmail({ reference, contact }: RfqEmailPayload, groups: DivisionGroup[]) {
  const summary = fulfilmentSummary(contact);

  return {
    subject: `We've received your quote request ${reference}`,
    html: emailLayout({
      heading: "We've received your quote request",
      body: `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111827;">Hi ${escapeHtml(contact.fullName)},</p>
        <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#111827;">Thank you for your request. Our team will come back to you with availability and pricing within one business day. Your reference is <strong>${escapeHtml(reference)}</strong>.</p>
        <p style="margin:0;font-size:14px;color:#6b7280;">${escapeHtml(summary)}${contact.requiredBy ? ` · needed by ${escapeHtml(contact.requiredBy)}` : ""}</p>
        ${linesTable(groups, { showDivisions: false })}
        <p style="margin:24px 0 0;font-size:13px;color:#6b7280;">Need to change something? Reply to this email or call ${escapeHtml(siteConfig.contact.phone)} (${escapeHtml(siteConfig.contact.hours)}).</p>`,
    }),
    text: `Hi ${contact.fullName},\n\nThank you for your request. Our team will come back to you with availability and pricing within one business day. Your reference is ${reference}.\n\n${summary}${contact.requiredBy ? ` · needed by ${contact.requiredBy}` : ""}\n\n${linesText(groups, { showDivisions: false })}\n\nNeed to change something? Reply to this email or call ${siteConfig.contact.phone} (${siteConfig.contact.hours}).`,
  };
}

/**
 * Sends the RFQ to the inbox of every division it touches (one email, all
 * lines, grouped by division) and a confirmation to the buyer.
 *
 * Throwing surfaces as the form's "couldn't send" error. Only the staff email
 * can throw: if the buyer's confirmation fails the team still has the request,
 * so the buyer is shown success rather than invited to resubmit a duplicate.
 */
export async function sendRfqEmails(payload: RfqEmailPayload): Promise<void> {
  const groups = groupByDivision(payload.items);
  const staff = staffEmail(payload, groups);

  await sendEmail({
    to: internalRecipients(groups.map((group) => group.inbox)),
    replyTo: payload.contact.email,
    idempotencyKey: `rfq-${payload.reference}-staff`,
    ...staff,
  });

  try {
    await sendEmail({
      to: payload.contact.email,
      replyTo: groups.length === 1 ? groups[0].inbox : siteConfig.contact.email,
      idempotencyKey: `rfq-${payload.reference}-buyer`,
      ...buyerEmail(payload, groups),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[rfq] ${payload.reference}: confirmation email failed`, error);
  }
}
