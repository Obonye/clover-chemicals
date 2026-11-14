---
name: Clover Industries
description: Design system for Clover Industries (the group) and its divisions, Clover Chemicals and Clover Medical. One shared type, shape and layout system; divisions differ by accent colour, imagery and naming.
colors:
  # Light theme is the default. Source of truth: styles/globals.css.
  background: 'oklch(0.9564 0.0025 48.72)'
  surface: 'oklch(100% 0.0008 144.21)'
  surface-secondary: 'oklch(95.24% 0.0012 144.21)'
  surface-tertiary: 'oklch(93.73% 0.0012 144.21)'
  foreground: 'oklch(0.1543 0 0)'
  muted: 'oklch(55.17% 0.003 144.21)'
  separator: 'oklch(92% 0.0015 144.21)'
  danger: 'oklch(65.32% 0.2335 12.59)'
  success: 'oklch(73.29% 0.1941 137.66)'
  warning: 'oklch(78.19% 0.159 59.18)'
  specials: 'oklch(78% 0.17 92)'
  specials-foreground: 'oklch(20% 0.02 90)'
  # Accent is set per route (config/divisions.ts):
  accent-group: 'black in light mode, white in dark mode'
  accent-chemical: 'oklch(0.62 0.19 127.1031)'   # Clover Green
  accent-medical: '#0074a8'
  dark-background: 'oklch(0.1448 0 0)'
typography:
  display:
    fontFamily: Archivo
    weights: [700, 800, 900]
    usage: every h1-h3 (class font-display); hero titles at 800
  body:
    fontFamily: Inter
    usage: all running text, buttons, form fields
  mono:
    fontFamily: Space Mono
    weights: [400, 700]
    usage: eyebrows, labels, badges, chips, product codes and specs
  small-text-floor: 12px
rounded:
  card: 1rem        # rounded-2xl: cards, panels, option cards
  control: 0.5rem   # rounded-lg: buttons, inputs, thumbnails
  chip: 9999px      # rounded-full: tags, badges, pills
spacing:
  base: 8px
  container-max: 1280px
  page-padding: 24px (48px from lg)
  utility-bar-height: 3rem
  navbar-height: 4rem
---

## Brand & Style

Clover Industries is a **branded house**: a group (Clover Industries) with divisions (Clover Chemicals, Clover Medical) that share one identity. Botswana's citizen-owned chemicals, equipment and healthcare supplier since 1980, serving industry, agriculture, healthcare and the laboratory.

The tone is confident and practical: **Corporate Modern**, built for buyers who want specifications, availability and a fast quote. Photography is real (warehouses, shelves, teams); copy is outcome-led ("Botswana's total solutions partner, division by division").

**Naming**
- The group is always **Clover Industries**. Divisions are **Clover Chemicals** and **Clover Medical**. Do not use "Clover Chemical Industries".
- Division heroes carry the line "A Division of Clover Industries".
- Tagline: "Lift as you rise."

## One system, many divisions

The type, shape, spacing and component rules below are **identical across the group and every division**. A division is recognised by:
- its **accent colour** (set per route through `config/divisions.ts`),
- its **hero imagery and copy**,
- its **name in the lockup subline**.

Never give a division its own typeface, radius or component style. If a division needs more differentiation, extend this document first.

## Colors

Colours are HeroUI semantic tokens (`styles/globals.css`); use the tokens (`text-foreground`, `text-muted`, `bg-surface`, `border-separator`, `text-accent`), not raw colours.

- **Accent** changes with the route. Group pages (home, About, Contact, Locations, RFQ, shared product routes): black on light, white on dark. Chemical: Clover Green. Medical: blue `#0074a8`.
- **Neutrals:** a warm light-grey background with white surfaces; near-black foreground; muted grey for secondary text. A dark theme exists (`.dark`) but light is the default.
- **Specials** (yellow) is reserved for promotional tags and banners.
- Black alpha scrims over photography (hero shading) are acceptable and are not palette colours.

**Open:** the group front door is almost entirely black and white; where the Clover Green appears at group level is decided in CI-89.

## Typography

One font system for the whole site (configured in `config/fonts.ts`):

1. **Archivo (display)**: every `h1`-`h3` uses `font-display`. Weights 700-900 are loaded; hero titles use 800. Headlines use tight tracking.
2. **Inter (body)**: all running text, buttons and form fields.
3. **Space Mono (mono)**: eyebrows, labels, badges, chips, product codes and spec data.

Rules:
- **Eyebrow:** use the shared `eyebrow()` primitive (`components/primitives.ts`): mono, 12px, medium, uppercase, wide tracking, accent colour (`onDark` tone over photos).
- **Minimum size 12px** for any text. No `text-[10px]` or `text-[11px]`.
- Headings use weights the font actually loads (bold or heavier for Archivo).

**Open:** a fluid type scale using `clamp()` is tracked in CI-81.

## Layout & Spacing

- 8px base unit. Content sits in a **1280px** container with 24px side padding (48px from `lg`).
- **Fixed chrome:** a 3rem utility bar above a 4rem navbar, both fixed. Page content offsets by `--header-h`; full-bleed heroes pull up under the transparent navbar with `-mt-[var(--navbar-h)]`. Change the heights only in `styles/globals.css`.
- Generous padding in data-heavy sections; avoid dense tables on mobile.

## Elevation & Depth

Flat. Hierarchy comes from tonal surfaces (background, white surface, secondary surface) and 1px `separator` borders. Shadows are used sparingly (hero buttons, hover states).

## Shapes

One radius scale, applied by role (not by division):
- **Cards, panels, option cards:** `rounded-2xl`.
- **Buttons, inputs, thumbnails:** `rounded-lg`.
- **Tags, badges, chips, pills:** `rounded-full`.
- Tiny decorative squares (bullets) may stay `rounded-sm`.

**Open:** Medical's pill-shaped buttons (`rounded-full`) predate this rule; CI-91 decides whether to bring them to `rounded-lg`.

## Components

### Buttons
- Primary: solid accent, uppercase on heroes, `rounded-lg`. Secondary: 2px outline in white (on photos) or `separator`.
- Large (about 56px) for hero CTAs, 40-48px elsewhere; touch targets at least 44px.

### Cards
- White surface, 1px `separator` border, `rounded-2xl`, no shadow by default. Division cards on the group home use photography with a dark gradient.

### Product cards and tags
- Mono 12px tags as `rounded-full` chips. "Specials" uses the specials colour.

### Forms
- Always-visible labels. The contact and RFQ forms are being brought onto one field system with sentence-case labels and accessible placeholder contrast (CI-85).

### Navigation
- Lockup everywhere: logo, "CLOVER INDUSTRIES", and a subline ("Lift as you rise" on group pages, the division name on a division). The Products menu is scoped to the current division.
- Request for quote (RFQ) is the primary conversion path; the navbar shows a count badge.

### Icons
- Simple, geometric, 2px stroke. Text arrows (`→`) are fine for links.

## Open items

Tracked under the brand epic CI-82: group identity (CI-89), Chemical (CI-90), Medical (CI-91), shared rules (CI-92), responsive type (CI-81).
