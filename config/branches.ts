/**
 * Single source of truth for branch data (CI-11). Modeled on config/
 * divisions.ts: a plain config object for now, with the same shape a
 * Sanity `branch` document type would use if this becomes editable
 * content later — migrating then means swapping this file for a query,
 * not reshaping every consumer.
 *
 * Only the address is confirmed per branch. Phone, email, WhatsApp and
 * hours are shared company-wide today (see siteConfig.contact) — neither
 * branch has published its own yet. Needs from client (see CI-11):
 * Francistown's own phone/email/hours if it has any, whether hours differ
 * by branch, and a confirmed map link or geo coordinates for each.
 */
export type BranchConfig = {
  slug: string;
  name: string;
  address: string;
  /** True for the head office. At most one branch should set this. */
  isHeadOffice?: boolean;
  /** Which config/divisions.ts slugs this branch serves. */
  divisions: string[];
};

export const branches: BranchConfig[] = [
  {
    slug: "gaborone",
    name: "Gaborone Branch (Head Office)",
    address: "Plot 1277, Old Lobatse Road, Gaborone, Botswana",
    isHeadOffice: true,
    divisions: ["chemical", "medical"],
  },
  {
    slug: "francistown",
    name: "Francistown Branch",
    address: "Plot 31251, Somerset Industrial, Francistown, Botswana",
    divisions: ["chemical", "medical"],
  },
];

/** Branches in display order: the head office first, then the rest in
 *  their declared order (CI-39). Use this wherever branches are listed so
 *  the order doesn't depend on how the array above happens to be written. */
export const branchesInDisplayOrder: BranchConfig[] = [
  ...branches.filter((b) => b.isHeadOffice),
  ...branches.filter((b) => !b.isHeadOffice),
];

export function getBranch(slug: string): BranchConfig | undefined {
  return branches.find((b) => b.slug === slug);
}

/** A Google Maps search for a branch's address — works without a
 *  confirmed lat/lng, and opens the native maps app on mobile. Swap for a
 *  coordinate-based link once the client confirms one (see CI-11). */
export function mapUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
