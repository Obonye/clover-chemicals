import { NextResponse } from "next/server";

import { isCatalogEnabled } from "@/lib/catalog/visibility";

// Lets the site-wide shell (navbar, footer) and the static pages learn the
// flag without being rendered per request themselves. Never cached, so a
// flag change shows on the next page load (CI-72, CI-76).
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ enabled: await isCatalogEnabled() }, { headers: { "Cache-Control": "no-store" } });
}
