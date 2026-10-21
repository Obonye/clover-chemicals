import { z } from "zod";

/** Browser forms send "" for untouched optional inputs; treat that as absent. */
const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional(),
  );

/** Botswana (+267 / local) and international numbers. */
const PHONE_PATTERN = /^\+?[0-9][0-9 ()-]{5,18}[0-9]$/;

export const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: optionalText(160),
  email: z.email().max(200),
  phone: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().regex(PHONE_PATTERN, "Enter a valid phone number").optional(),
  ),
  /** A `categories[].id` from lib/products.ts, "other", or absent. */
  product: optionalText(80),
  message: z.string().trim().min(5).max(4000),
});

export type ContactMessage = z.infer<typeof ContactSchema>;
