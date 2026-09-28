import { z } from "zod";

export const RFQ_MAX_ITEMS = 50;
export const RFQ_MAX_QUANTITY = 10_000;

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

const todayIso = () => new Date().toISOString().slice(0, 10);

export const RfqContactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z.email().max(200),
  phone: z.string().trim().regex(PHONE_PATTERN, "Enter a valid phone number"),
  branch: optionalText(80),
  deliveryLocation: optionalText(200),
  requiredBy: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z
      .iso.date()
      .refine((d) => d >= todayIso(), "Required-by date can't be in the past")
      .optional(),
  ),
  message: optionalText(2000),
});

export const RfqSubmissionSchema = z.object({
  items: z.array(RfqLineItemSchema).min(1).max(RFQ_MAX_ITEMS),
  contact: RfqContactSchema,
  /** Honeypot. Real users never see it, so it must stay empty. */
  website: z.string().max(0),
});

/** Two lines are the same line when product and pack size match. */
export function rfqLineKey(
  line: Pick<z.infer<typeof RfqLineItemSchema>, "productId" | "packSizeKey">,
): string {
  return `${line.productId}::${line.packSizeKey ?? ""}`;
}
