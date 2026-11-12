import { z } from "zod";

// Relative (not "@/…") so this file can be loaded by the plain Node test runner.
import { branches } from "../../config/branches.ts";

export const RFQ_MAX_ITEMS = 50;
export const RFQ_MAX_QUANTITY = 10_000;

/** Browser forms send "" for untouched optional inputs; treat that as absent. */
const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional(),
  );

/** A specific product, with a pack size and quantity. */
export const RfqProductLineSchema = z.object({
  type: z.literal("product"),
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

/**
 * A request for a product range, for when there's no product to pick (CI-73).
 * The buyer says in their own words what they need.
 */
export const RfqCategoryLineSchema = z.object({
  type: z.literal("category"),
  categorySlug: z.string().min(1).max(100),
  /** Display only. The server rebuilds it from Sanity. */
  categoryName: z.string().min(1).max(160),
  division: z.enum(["chemicals", "medical"]),
  /** What the buyer needs. May be empty while they're typing; sending requires it. */
  details: z.string().max(1000),
  quantity: z.number().int().min(1).max(RFQ_MAX_QUANTITY).optional(),
  /** Free text, e.g. "25 L drums". */
  packSize: optionalText(100),
});

/** Carts saved before category lines existed have no `type`: they're products. */
const withLegacyType = (value: unknown) =>
  value && typeof value === "object" && !("type" in value) ? { ...value, type: "product" } : value;

export const RfqLineItemSchema = z.preprocess(
  withLegacyType,
  z.discriminatedUnion("type", [RfqProductLineSchema, RfqCategoryLineSchema]),
);

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

export const RfqSubmissionSchema = z.object({
  items: z
    .array(RfqLineItemSchema)
    .min(1)
    .max(RFQ_MAX_ITEMS)
    .superRefine((items, ctx) => {
      items.forEach((line, index) => {
        if (line.type === "category" && line.details.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: [index, "details"],
            message: `Tell us what you need for ${line.categoryName}`,
          });
        }
      });
    }),
  contact: RfqContactSchema,
  /** Honeypot. Real users never see it, so it must stay empty. */
  website: z.string().max(0),
});

/** Two lines are the same line when product and pack size match, or when
 *  they're the same category. */
export function rfqLineKey(
  line: { type?: "product" | "category"; productId?: string; packSizeKey?: string | null; categorySlug?: string },
): string {
  if (line.type === "category") return `category::${line.categorySlug}`;

  return `${line.productId}::${line.packSizeKey ?? ""}`;
}
