import type { RfqLineItem } from "./types";

import { productInbox } from "@/config/enquiry-routing";

/**
 * A `mailto:` link that carries the buyer's whole list, so a failed send
 * never costs them their request: they can send the same RFQ from their own
 * mail app instead. Subject and body are pre-filled.
 */
export function buildRfqMailto(items: RfqLineItem[], rangeNames: string[] = []): string {
  const lines = items.map((line, index) => {
    const detail = [line.grade, line.packLabel].filter(Boolean).join(", ");
    const note = line.note ? ` (Note: ${line.note})` : "";

    return `${index + 1}. ${line.name}${detail ? ` - ${detail}` : ""} x ${line.quantity}${note}`;
  });

  const body = [
    "Hello Clover Industries,",
    "",
    "I'd like a quotation for the following:",
    "",
    ...lines,
    ...(rangeNames.length > 0 ? [`Ranges of interest: ${rangeNames.join(", ")}`] : []),
    "What I need:",
    "",
    "My name:",
    "Company:",
    "Phone:",
    "Delivery address, or the branch I'll collect from:",
  ].join("\r\n");

  const subject =
    items.length > 0
      ? `Request for quote (${items.length} item${items.length === 1 ? "" : "s"})`
      : "Request for quote";

  return `mailto:${productInbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
