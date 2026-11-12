"use server";

import { sendContactEmails } from "@/lib/contact/email";
import { ContactSchema } from "@/lib/contact/schema";
import { clientIp } from "@/lib/client-ip";
import { checkRateLimit } from "@/lib/rfq/rate-limit";
import { createReference } from "@/lib/rfq/reference";

export type ContactField = "name" | "company" | "email" | "phone" | "enquiryType" | "message";

export type ContactSubmitState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
    }
  | { status: "success"; reference: string };

const FIELDS: ContactField[] = ["name", "company", "email", "phone", "enquiryType", "message"];

const FIELD_MESSAGES: Partial<Record<ContactField, string>> = {
  name: "Enter your full name",
  email: "Enter a valid email address",
  enquiryType: "Choose the nature of your enquiry",
  message: "Tell us a little about what you need",
};

export async function submitContact(
  _prev: ContactSubmitState,
  formData: FormData,
): Promise<ContactSubmitState> {
  const website = formData.get("website");

  // Honeypot: bots fill every field. Pretend it worked and send nothing.
  if (typeof website === "string" && website !== "") {
    return { status: "success", reference: createReference("MSG") };
  }

  const parsed = ContactSchema.safeParse(
    Object.fromEntries(FIELDS.map((field) => [field, formData.get(field) ?? undefined])),
  );

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;

      fieldErrors[field] ??= FIELD_MESSAGES[field] ?? issue.message;
    }

    return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
  }

  // Counted only once the form is valid, so fixing typos doesn't use up the allowance.
  const limit = checkRateLimit(`contact:${await clientIp()}`);

  if (!limit.ok) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterMs / 60_000));

    return {
      status: "error",
      message: `You've sent several messages in the last hour. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}, or call us directly.`,
    };
  }

  const reference = createReference("MSG");

  try {
    await sendContactEmails({ reference, message: parsed.data, submittedAt: new Date() });
  } catch {
    return {
      status: "error",
      message: "We couldn't send your message just now. Please try again, or email us directly.",
    };
  }

  return { status: "success", reference };
}
