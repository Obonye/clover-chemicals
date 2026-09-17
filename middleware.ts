import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const DIVISION_COOKIE = "division";
const DIVISION_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

// Shared pages (Products, About, News, Contact, ...) have no division
// segment in their URL, so we can't tell which brand's colors to use from
// the path alone. Instead, remember the division whenever someone enters
// through one of the two division-exclusive homes, and carry that choice
// into whatever shared page they browse next — until they switch again.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const division = pathname.startsWith("/medical")
    ? "medical"
    : pathname === "/"
      ? "chemical"
      : null;

  if (!division || request.cookies.get(DIVISION_COOKIE)?.value === division) {
    return NextResponse.next();
  }

  // Set on the request too, so the Server Components rendering this same
  // response (root layout) already see the updated value.
  request.cookies.set(DIVISION_COOKIE, division);

  const response = NextResponse.next({ request });

  response.cookies.set(DIVISION_COOKIE, division, {
    maxAge: DIVISION_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico|.*\\..*).*)"],
};
