import { z } from "zod";

// Relative-import friendly: only depends on zod, so the plain Node test runner
// can load it (see lib/rfq/schema.test.ts).

/** Botswana (+267 / local) and international numbers. */
export const PHONE_PATTERN = /^\+?[0-9][0-9 ()-]{5,18}[0-9]$/;

/** Browser forms send "" for untouched optional inputs; treat that as absent. */
export const optionalText = (max: number) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max).optional(),
  );

/**
 * "Who you are": the same four fields, with the same rules, on every form
 * (contact and RFQ, CI-85). Spread into a form's own schema so the two can't
 * drift: name, company, email and one phone number, all required.
 */
export const identityShape = {
  fullName: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  email: z.email().max(200),
  phone: z.string().trim().regex(PHONE_PATTERN, "Enter a valid phone number"),
};

/** The per-field messages shown under each identity input. */
export const IDENTITY_FIELD_MESSAGES = {
  fullName: "Enter your full name",
  company: "Enter your company or organisation",
  email: "Enter a valid email address",
  phone: "Enter a valid phone number",
} as const;
