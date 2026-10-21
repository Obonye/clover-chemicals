/**
 * Where a contact-form enquiry goes, by the "Product Interest" the visitor
 * picked (keys are `categories[].id` in lib/products.ts). RFQs don't use this:
 * they route by each line's division (config/divisions.ts).
 *
 * Addresses are the department contacts already published on /contact. To
 * confirm with the client: that agricultural and industrial enquiries belong
 * with Sales, and that Laboratory has its own inbox. Anything not listed here
 * ("Other / Not sure", or no choice) goes to the website inbox (info@).
 */
export const contactCategoryInboxes: Record<string, string> = {
  agro: "sales@cloverindustries.co.bw",
  industrial: "sales@cloverindustries.co.bw",
  laboratory: "labdivision@cloverindustries.co.bw",
  medical: "madan.kumar@cloverindustries.co.bw",
};
