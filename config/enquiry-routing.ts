import { siteConfig } from "./site";

/**
 * Where website enquiries go. Every RFQ and every contact-form message goes to
 * the three team inboxes below, except a complaint, which goes to one person.
 * (Emails are sent from the website inbox, info@ — see lib/email/send.ts.)
 */
export const productInbox = siteConfig.contact.email;

/** Everyone who receives a Request for Quote or a contact-form message. */
export const rfqInboxes = [
  productInbox,
  "khofi.gabosekwe@cloverindustries.co.bw",
  "sanka@cloverindustries.co.bw",
];

/** Who handles customer complaints. */
export const complaintInboxes = ["sanka@cloverindustries.co.bw"];

/** The contact form's "Nature of enquiry" choices, in the order shown. */
export const enquiryTypes = [
  { id: "chemicals", label: "Chemicals" },
  { id: "medical", label: "Medical" },
  { id: "complaint", label: "Complaint" },
  { id: "other", label: "Other" },
] as const;

export type EnquiryTypeId = (typeof enquiryTypes)[number]["id"];

export const enquiryTypeIds = enquiryTypes.map((type) => type.id) as [EnquiryTypeId, ...EnquiryTypeId[]];

/** The inboxes a contact-form message of this type is sent to. */
export function inboxesForEnquiry(type: EnquiryTypeId): string[] {
  return type === "complaint" ? complaintInboxes : rfqInboxes;
}
