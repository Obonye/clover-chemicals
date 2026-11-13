import { z } from "zod";

// Relative (not "@/…") so this file can be loaded by the plain Node test runner.
import { branches } from "../../config/branches.ts";

export const RFQ_MAX_ITEMS = 50;
export const RFQ_MAX_QUANTITY = 10_000;
export const RFQ_MAX_RANGES = 10;

/** Browser forms send "" for untouched optional inputs; treat that as absent. */
const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional(),
  );

export const RfqLineItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  grade: z.string().nullable(),
  division: z.enum(["chemicals", "medical"]),
  /** `_key` of the chosen `packSizes[]` entry; null when the product has none. */
  packSizeKey: z.string().min(1).nullable(),
  /** Display only. The server rebuilds it from Sanity. */
  packLabel: z.string().nullable(),
  quantity: z.number().int().min(1).max(RFQ_MAX_QUANTITY),
  note: optionalText(300),
});

/** Botswana (+267 / local) and international numbers. */
const PHONE_PATTERN = /^\+?[0-9][0-9 ()-]{5,18}[0-9]$/;

/** Optional phone field: "" counts as absent, anything else must look like a number. */
const optionalPhone = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().regex(PHONE_PATTERN, "Enter a valid phone number").optional(),
);

const todayIso = () => new Date().toISOString().slice(0, 10);

export const RFQ_FULFILMENT = ["delivery", "collection"] as const;
const BRANCH_SLUGS = branches.map((branch) => branch.slug);

export const RfqContactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z.email().max(200),
  /** Mobile is preferred; at least one of mobile or landline is required. */
  mobile: optionalPhone,
  landline: optionalPhone,
  fulfilment: z.enum(RFQ_FULFILMENT, "Choose delivery or collection"),
  /** Collection only: the branch to collect from. Stock isn't necessarily dispatched
   *  from the nearest branch, so delivery orders don't ask for one (CI-40). */
  branch: optionalText(80).refine(
    (slug) => slug === undefined || BRANCH_SLUGS.includes(slug),
    "Choose one of our branches",
  ),
  /** Required for delivery. */
  deliveryAddress: optionalText(300),
  requiredBy: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z
      .iso.date()
      .refine((d) => d >= todayIso(), "Required-by date can't be in the past")
      .optional(),
  ),
  message: optionalText(2000),
}).superRefine((contact, ctx) => {
  if (!contact.mobile && !contact.landline) {
    ctx.addIssue({ code: "custom", path: ["mobile"], message: "Enter a mobile or landline number" });
  }
  if (contact.fulfilment === "delivery" && !contact.deliveryAddress) {
    ctx.addIssue({ code: "custom", path: ["deliveryAddress"], message: "Enter the address we should deliver to" });
  }
  if (contact.fulfilment === "collection" && !contact.branch) {
    ctx.addIssue({ code: "custom", path: ["branch"], message: "Choose the branch you'll collect from" });
  }
});

/** A product range the buyer is interested in: its Sanity slug. The server re-checks it. */
export const RfqRangeSlugSchema = z.string().regex(/^[a-z0-9-]{1,100}$/);

export const RfqSubmissionSchema = z
  .object({
    /** Products from the cart (empty while the catalogue is hidden). */
    items: z.array(RfqLineItemSchema).max(RFQ_MAX_ITEMS),
    /** Ranges the buyer picked on the form: tags on the request, not cart lines. */
    ranges: z.array(RfqRangeSlugSchema).max(RFQ_MAX_RANGES),
    contact: RfqContactSchema,
    /** Honeypot. Real users never see it, so it must stay empty. */
    website: z.string().max(0),
  })
  .superRefine((submission, ctx) => {
    if (submission.items.length === 0 && submission.ranges.length === 0) {
      ctx.addIssue({ code: "custom", path: ["items"], message: "Add a product or choose a product range" });
    }
    // With no products to describe the request, the message is what we quote from.
    if (submission.items.length === 0 && (submission.contact.message ?? "").length < 3) {
      ctx.addIssue({ code: "custom", path: ["contact", "message"], message: "Tell us what you need" });
    }
  });

/** Two lines are the same line when product and pack size match. */
export function rfqLineKey(
  line: Pick<z.infer<typeof RfqLineItemSchema>, "productId" | "packSizeKey">,
): string {
  return `${line.productId}::${line.packSizeKey ?? ""}`;
}
