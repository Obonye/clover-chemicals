import type { NextRequest } from "next/server";

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity publish webhook (CI-76). Publishing a product, category, homepage or
 * promotion refreshes the cached Sanity data and the pages built from it, so
 * changes (such as switching a category's `catalogReady` on) show within
 * seconds instead of waiting for the next visitor-triggered refresh.
 *
 * Only requests signed with SANITY_REVALIDATE_SECRET are accepted; without the
 * secret configured, the endpoint refuses everything.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ message: "Revalidation isn't configured" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret, true);

  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  // Every page reads the same cached Sanity data, so refresh the whole tree.
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
