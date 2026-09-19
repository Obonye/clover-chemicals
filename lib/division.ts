// Site-wide division — drives theming (body[data-division] in
// styles/globals.css) and is what middleware.ts persists to the cookie.
// Distinct from Sanity's plural `Division` ("chemicals" | "medical") used
// to tag product/category content — see sanity/lib/types.ts.
export type SiteDivision = "chemical" | "medical";

export const DIVISION_COOKIE_KEY = "division";
export const DIVISION_STORAGE_KEY = "division";
export const DIVISION_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

// Fired whenever something other than route navigation changes the site
// division (e.g. the /products division filter), so any other mounted
// component tracking division — currently just the utility bar's active
// indicator — can stay in sync without a shared store.
export const DIVISION_CHANGE_EVENT = "clover:division-change";

export type DivisionChangeEvent = CustomEvent<SiteDivision>;

/**
 * Resolves the active division for a given pathname. "/" and "/medical" are
 * division-exclusive and always win; every other (shared) route falls back
 * to whichever division the visitor last entered through, so nav chrome on
 * pages like /about and /news stays consistent with wherever they came from
 * instead of always reverting to Chemicals.
 */
export function resolveDivision(pathname: string, fallback: SiteDivision): SiteDivision {
  if (pathname.startsWith("/medical")) return "medical";
  if (pathname === "/") return "chemical";

  return fallback;
}

/**
 * Writes the division to localStorage + cookie, repaints the page via
 * body[data-division], and notifies other mounted components. Call this
 * any time the user explicitly picks a division somewhere other than by
 * navigating to "/" or "/medical" (those are handled by middleware.ts +
 * the utility bar's own pathname effect).
 */
export function persistDivision(division: SiteDivision) {
  try {
    localStorage.setItem(DIVISION_STORAGE_KEY, division);
  } catch {
    // Storage can be unavailable (private mode, blocked); ignore.
  }

  document.cookie = `${DIVISION_COOKIE_KEY}=${division}; path=/; max-age=${DIVISION_COOKIE_MAX_AGE}; samesite=lax`;
  document.body.dataset.division = division;

  window.dispatchEvent(
    new CustomEvent(DIVISION_CHANGE_EVENT, { detail: division }) satisfies DivisionChangeEvent,
  );
}
