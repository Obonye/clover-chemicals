import { siteConfig } from "./site";

/**
 * Where website enquiries go. Anything about products — every RFQ, and any
 * contact-form enquiry where the visitor picked a product category — goes to
 * Sales. Everything else ("Other / Not sure", or no choice) goes to the website
 * inbox (info@, see lib/email/send.ts).
 */
export const productInbox = siteConfig.contact.email;

/** Everyone who receives a Request for Quote or a contact-form message. */
export const rfqInboxes = [
  productInbox,
  "khofi.gabosekwe@cloverindustries.co.bw",
  "sanka@cloverindustries.co.bw",
];

/** True when a contact-form "Product Interest" value is a real product category. */
export function isProductEnquiry(product: string | undefined): boolean {
  return Boolean(product) && product !== "other";
}
