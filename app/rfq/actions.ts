"use server";

import type { RfqContact, RfqLineItem, RfqRange } from "@/lib/rfq/types";

import { client } from "@/sanity/lib/client";
import { RFQ_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { clientIp } from "@/lib/client-ip";
import { sendRfqEmails } from "@/lib/rfq/email";
import { lookupRfqProducts } from "@/lib/rfq/lookup";
import { checkRateLimit } from "@/lib/rfq/rate-limit";
import { reconcileRfqLine } from "@/lib/rfq/reconcile";
import { createRfqReference } from "@/lib/rfq/reference";
import { RfqSubmissionSchema } from "@/lib/rfq/schema";

export type RfqContactField = keyof RfqContact;

export type RfqSubmitState =
  | { status: "idle" }
  | {
      status: "error";
      /** Shown above the form. */
      message: string;
      /** Keyed by input `name`, for the form's per-field messages. */
      fieldErrors?: Partial<Record<RfqContactField, string>>;
    }
  | {
      status: "success";
      reference: string;
      /** Names of lines dropped because Sanity no longer offers them as sent. */
      dropped: string[];
    };

const CONTACT_FIELDS: RfqContactField[] = [
  "fullName",
  "company",
  "email",
  "mobile",
  "landline",
  "fulfilment",
  "branch",
  "deliveryAddress",
  "requiredBy",
  "message",
];

const FIELD_MESSAGES: Partial<Record<RfqContactField, string>> = {
  fullName: "Enter your full name",
  company: "Enter your company or organisation",
  email: "Enter a valid email address",
};

function parseItems(raw: FormDataEntryValue | null): unknown {
  if (typeof raw !== "string") return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function parseRanges(raw: FormDataEntryValue | null): unknown {
  if (typeof raw !== "string") return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Re-checks the ranges the buyer picked against Sanity (CI-75): name and
 * division come from the published category, never from the payload. A range
 * that no longer exists is dropped and reported.
 */
async function resolveRanges(slugs: string[]) {
  const unique = Array.from(new Set(slugs));

  if (unique.length === 0) return { ranges: [] as RfqRange[], dropped: [] as string[] };

  const found = await client.fetch<{ slug: string | null; label: string | null; division: string | null }[]>(
    RFQ_CATEGORIES_QUERY,
    { slugs: unique },
    { perspective: "published", stega: false, cache: "no-store" },
  );
  const bySlug = new Map(found.map((category) => [category.slug, category]));
  const ranges: RfqRange[] = [];
  const dropped: string[] = [];

  for (const slug of unique) {
    const category = bySlug.get(slug);

    if (!category?.label || (category.division !== "chemicals" && category.division !== "medical")) {
      dropped.push(slug);
      continue;
    }
    ranges.push({ slug, name: category.label, division: category.division });
  }

  return { ranges, dropped };
}

/**
 * Rebuilds every line from Sanity: name, slug, grade, division and pack label
 * all come from the published product, never from the payload. Lines whose
 * product is gone, unavailable, or whose pack size no longer exists are
 * dropped and reported back.
 */
async function rebuildFromSanity(items: RfqLineItem[]) {
  const snapshots = await lookupRfqProducts(items.map((line) => line.productId));
  const byId = new Map(snapshots.map((product) => [product._id, product]));
  const lines: RfqLineItem[] = [];
  const dropped: string[] = [];

  for (const line of items) {
    const check = reconcileRfqLine(line, byId.get(line.productId));

    if (check.problem) {
      dropped.push(check.snapshot?.name ?? line.name);
      continue;
    }
    // `patch` holds every Sanity-owned field that differs from the payload,
    // so after merging, name/slug/grade/division/packLabel all match Sanity.
    // A line without a pack (only valid when the product has none) can't
    // carry a label, whatever the payload said.
    const merged = { ...line, ...check.patch };

    lines.push(line.packSizeKey ? merged : { ...merged, packLabel: null });
  }

  return { lines, dropped };
}

export async function submitRfq(
  _prev: RfqSubmitState,
  formData: FormData,
): Promise<RfqSubmitState> {
  const contact = Object.fromEntries(
    CONTACT_FIELDS.map((field) => [field, formData.get(field) ?? undefined]),
  );
  const website = formData.get("website");

  // Honeypot: bots fill every field. Pretend it worked and send nothing.
  if (typeof website === "string" && website !== "") {
    return { status: "success", reference: createRfqReference(), dropped: [] };
  }

  const parsed = RfqSubmissionSchema.safeParse({
    items: parseItems(formData.get("items")),
    ranges: parseRanges(formData.get("ranges")),
    contact,
    website: "",
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<RfqContactField, string>> = {};
    let itemsInvalid = false;

    for (const issue of parsed.error.issues) {
      const [scope, field] = issue.path;

      if (scope === "items" && issue.code === "custom") {
        // An empty request: nothing to quote.
        return { status: "error", message: issue.message };
      }
      if (scope === "contact" && typeof field === "string") {
        const name = field as RfqContactField;

        fieldErrors[name] ??= FIELD_MESSAGES[name] ?? issue.message;
      } else if (scope === "items") {
        itemsInvalid = true;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { status: "error", message: "Please check the highlighted fields.", fieldErrors };
    }

    return {
      status: "error",
      message: itemsInvalid
        ? "Your product list couldn't be read. Refresh the page and try again."
        : "Something in the form couldn't be read. Please try again.",
    };
  }

  // Counted only once the form is valid, so fixing typos doesn't use up a
  // buyer's allowance.
  const limit = checkRateLimit(`rfq:${await clientIp()}`);

  if (!limit.ok) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterMs / 60_000));

    return {
      status: "error",
      message: `You've sent several requests in the last hour. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}, or call us directly.`,
    };
  }

  let rebuilt: { lines: RfqLineItem[]; ranges: RfqRange[]; dropped: string[] };

  try {
    const [products, resolved] = await Promise.all([
      rebuildFromSanity(parsed.data.items),
      resolveRanges(parsed.data.ranges),
    ]);

    rebuilt = {
      lines: products.lines,
      ranges: resolved.ranges,
      dropped: [...products.dropped, ...resolved.dropped],
    };
  } catch {
    return {
      status: "error",
      message: "We couldn't check your request against our catalogue just now. Please try again in a moment.",
    };
  }

  if (rebuilt.lines.length === 0 && rebuilt.ranges.length === 0) {
    return {
      status: "error",
      message: "None of the items in your request can be quoted right now. Please review it and try again.",
    };
  }

  const reference = createRfqReference();

  try {
    await sendRfqEmails({
      reference,
      contact: parsed.data.contact,
      items: rebuilt.lines,
      ranges: rebuilt.ranges,
      submittedAt: new Date(),
    });
  } catch {
    return {
      status: "error",
      message: "We couldn't send your request just now. Please try again, or contact us directly.",
    };
  }

  return { status: "success", reference, dropped: rebuilt.dropped };
}
