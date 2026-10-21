import type { CSSProperties } from "react";

import type { Division } from "@/sanity/lib/types";

export type DivisionTheme = {
  /** Maps straight onto the shared --accent token (styles/globals.css).
   *  May be a light-dark() pair when the two modes need different values. */
  accent: string;
  accentForeground: string;
  /** Hex version of the accent for generated social images — next/og
   *  can't parse oklch()/light-dark(). Defaults to `accent`. */
  ogAccent?: string;
  /** Overrides the light-mode --heading token; dark mode always falls back
   *  to --foreground regardless (see divisionCssVars). Omit to inherit the
   *  site default. */
  heading?: string;
  /** A `var(--font-*)` reference to swap in for --font-archivo (the
   *  --font-display source). Omit to keep the default display font. */
  displayFont?: string;
  /** Which navbar text treatment reads correctly over this division's hero.
   *  "light" (white text) suits a dark photo hero; "dark" suits a light
   *  hero. Defaults to "light" when omitted. */
  navTextStyle?: "light" | "dark";
};

export type DivisionContact = {
  label: string;
  email: string;
};

export type DivisionConfig = {
  /** The route segment — app/[division] and everywhere a URL is built. */
  slug: string;
  /** The matching value on Sanity's `productCategory.division` field. Sanity
   *  spells this plural ("chemicals"); this is the one place that mapping
   *  lives — see sanity/lib/types.ts. */
  sanityDivision: Division;
  name: string;
  /** Short form for tight spaces (navbar logo sub-label). */
  shortName: string;
  tagline: string;
  image: string;
  /** Copy for the navbar's primary CTA button. Defaults to "Browse Products". */
  browseLabel?: string;
  /** Omit to fall back to the group (umbrella) theme. */
  theme?: DivisionTheme;
  contacts: DivisionContact[];
  /** config/branches.ts slugs this division is served from. */
  branches: string[];
};

export const divisions: DivisionConfig[] = [
  {
    slug: "chemical",
    sanityDivision: "chemicals",
    name: "Clover Chemicals",
    shortName: "Chemical",
    tagline: "Chemicals, equipment & PPE for industry, agriculture, and the lab.",
    image: "/clover large.jpg",
    // The same Clover Green as the :root defaults in styles/globals.css,
    // set explicitly so Chemical keeps it on shared routes too (product
    // pages, the catalogue preview), where the group theme now applies.
    theme: {
      accent: "oklch(0.62 0.19 127.1031)",
      accentForeground: "oklch(15% 0.0300 144.21)",
      ogAccent: "#8bc53f",
    },
    contacts: [{ label: "Sales", email: "sales@cloverindustries.co.bw" }],
    branches: ["gaborone", "francistown"],
  },
  {
    slug: "medical",
    sanityDivision: "medical",
    name: "Clover Medical",
    shortName: "Medical",
    tagline: "Advanced medical, life sciences, and laboratory solutions for Botswana's healthcare sector.",
    image: "/clover medical (2).jpg",
    browseLabel: "Explore Product Lines",
    theme: {
      accent: "#0074a8",
      accentForeground: "#ffffff",
      heading: "#343434",
      displayFont: "var(--font-sora)",
      navTextStyle: "dark",
    },
    contacts: [{ label: "Medical Division", email: "madan.kumar@cloverindustries.co.bw" }],
    branches: ["gaborone", "francistown"],
  },
];

/**
 * Clover Industries' own (umbrella) theme, used on the group home page and
 * every shared route that isn't under a division (/about, /contact,
 * /locations, /rfq, /products…). Plain black and white, so it sits above
 * both divisions' colours rather than borrowing one of them (CI-15): black
 * on light backgrounds, white on dark ones.
 */
export const groupTheme: DivisionTheme = {
  accent: "light-dark(oklch(0 0 0), oklch(1 0 0))",
  accentForeground: "light-dark(oklch(1 0 0), oklch(0 0 0))",
  ogAccent: "#ffffff",
};

/** The theme for a route: its division's, else the group theme. */
export function themeFor(division: DivisionConfig | undefined): DivisionTheme {
  return division?.theme ?? groupTheme;
}

export function getDivision(slug: string): DivisionConfig | undefined {
  return divisions.find((d) => d.slug === slug);
}

export function getDivisionBySanityValue(value: Division): DivisionConfig | undefined {
  return divisions.find((d) => d.sanityDivision === value);
}

/**
 * Turns a division's theme into inline CSS custom properties — used both by
 * app/[division]/layout.tsx (server-rendered, so there's no color flash) and
 * by product-catalogue.tsx's live preview when its own division toggle picks
 * a specific division (see that file for why that one stays client-side).
 *
 * --accent-hover/-soft* normally come from HeroUI's own :root-level formula,
 * which bakes in with whichever --accent it saw first and doesn't recompute
 * just because --accent is overridden further down the tree. Re-deriving
 * them here, in the same declaration block as --accent itself, keeps them
 * in sync. light-dark() covers the token pairs whose value differs by color
 * scheme (see the explicit `color-scheme` on :root/.dark in globals.css,
 * which light-dark() depends on) — no extra CSS selector needed at all.
 */
export function divisionCssVars(theme?: DivisionTheme): CSSProperties {
  if (!theme) return {};

  const vars: Record<string, string> = {
    "--accent": theme.accent,
    "--accent-foreground": theme.accentForeground,
    "--focus": theme.accent,
    "--accent-hover":
      "color-mix(in oklab, var(--accent) 90%, var(--accent-foreground) 10%)",
    "--accent-soft":
      "light-dark(color-mix(in oklab, var(--accent) 15%, transparent), color-mix(in oklab, var(--accent) 12%, transparent))",
    "--accent-soft-foreground":
      "light-dark(color-mix(in oklab, var(--accent) 70%, var(--foreground) 30%), color-mix(in oklab, var(--accent) 80%, var(--foreground) 30%))",
    "--accent-soft-hover":
      "light-dark(color-mix(in oklab, var(--accent) 20%, transparent), color-mix(in oklab, var(--accent) 16%, transparent))",
  };

  if (theme.heading) vars["--heading"] = `light-dark(${theme.heading}, var(--foreground))`;
  if (theme.displayFont) vars["--font-archivo"] = theme.displayFont;

  return vars as CSSProperties;
}
