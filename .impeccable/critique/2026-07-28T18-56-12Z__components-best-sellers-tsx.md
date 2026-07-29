---
target: components/best-sellers.tsx (Best Sellers card grid)
total_score: 22
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
timestamp: 2026-07-28T18-56-12Z
slug: components-best-sellers-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Only hover transitions signal state; adequate for a static card. |
| 2 | Match System / Real World | 2 | "Best Sellers" is retail framing that undercuts the hero's industrial positioning; 2 of 4 cards show a generic stock photo under a specific chemical's name. |
| 3 | User Control and Freedom | 2 | Product image has a `hover:scale-105` zoom implying it's clickable, but it's a plain `<div>` — dead click target. |
| 4 | Consistency and Standards | 2 | Same product data renders as a different card shape on `/products` (hairline grid, grade badge) vs. here (bordered tiles, category link) — the "same" card reads differently twice. |
| 5 | Error Prevention | 3 | No destructive actions present; only soft issue is the dead image target already counted under #3. |
| 6 | Recognition Rather Than Recall | 3 | Category, pack sizes, and CTA are all visible without needing memory of other pages. |
| 7 | Flexibility and Efficiency | n/a | No power-user shortcuts are relevant to a 4-card static marketing grid. |
| 8 | Aesthetic and Minimalist Design | 3 | Accent-colored category eyebrow visually outranks the actual product name directly below it. |
| 9 | Error Recovery | 3 | No error states triggerable from this component. |
| 10 | Help and Documentation | 1 | No SDS/spec-sheet/COA affordance anywhere, despite selling regulated chemicals (HCl 37%, glutaraldehyde, isopropyl alcohol) to a technical buyer who needs that before requesting a quote. |
| **Total** | | **22/36** | **Acceptable (61%)** |

(Heuristic 7 scored n/a: not applicable to a static 4-card marketing grid.)

## Design Specificity Verdict

**LLM assessment:** Generic. This is a templated e-commerce card — image-top, eyebrow, title, clamped description, chip row, text-link CTA — with industrial *typography* (mono, uppercase, letter-spacing) layered on to imply technicality. Strip the mono font and it's indistinguishable from a Shopify "featured collection" block. The one field that actually encodes B2B trust — `product.grade` ("BP / USP Grade", "AR / ACS Grade") — isn't shown here at all; it's rendered instead in the `/products` catalogue card, in the exact visual slot this card spends on a repeated category link. For a company whose whole pitch is "certified solutions" and "37 years of chemical precision," the flagship homepage showcase omits the one signal that proves it. "Best Sellers" itself is retail-coded language that clashes with the hero's "Industrial Chemistry, Engineered for Impact" register one scroll above.

**Deterministic scan:** `detect.mjs --json components/best-sellers.tsx` ran cleanly (exit 0) and returned zero findings. Nothing to reconcile against the LLM review — the detector's rule set doesn't currently catch card-level design-specificity or information-architecture issues like the ones above; treat this as a clean mechanical pass, not a design sign-off.

**Visual overlays:** Not available — no browser automation tool was exposed in this session, so no `[Human]`-tab overlay was generated. Fallback signal: source-level review only, no live-render screenshot evidence.

## Overall Impression

The homepage builds real authority in its first two beats — the hero's dark high-contrast photo + "37 Years of Chemical Precision," then the partners strip naming Thermo Fisher, Philips Medical, Kimberly Clark. Best Sellers is where that momentum stalls: it drops into a small-type, retail-framed grid that could sell candles as easily as hydrochloric acid. The single biggest opportunity is to make the card's eyebrow slot do double duty as a *trust signal* (chemical grade) instead of a repeated nav label, and to stop the image from promising an interaction it can't deliver.

## What's Working

1. **Mono, uppercase, letter-spaced labels** (category eyebrow, "Pack Sizes," CTA) build a quasi-lab/spec-sheet typographic voice — the one place this card differentiates itself from a generic storefront, even though it's currently spent on the wrong content (category, not grade).
2. **The `border-t` divider before pack sizes** cleanly separates narrative copy from spec data without a nested box — restrained IA in a small card.
3. **Real `gap-6` tiles** (vs. the catalogue page's hairline grid) correctly register this section as "curated highlights" rather than a dense spec table — the right tonal difference between a marketing surface and a full catalogue.

## Priority Issues

**[P1] Dead click affordance on the product image**
- Why it matters: the `h-48` image area has `hover:scale-105 transition-transform duration-500` with no `href`/`onClick` — it visually promises an action (zoom-to-focus is a click cue) it doesn't deliver, which a mobile user (no hover at all) or a stress-tester (clicks anyway) will notice immediately.
- Fix: wrap the whole card (or at minimum the image) in the category or product link, or drop the hover-zoom entirely so the card stops advertising an interaction it can't perform.
- Suggested command: `$impeccable harden`

**[P1] The one real trust signal (chemical grade) is omitted on the homepage's most visible cards**
- Why it matters: `lib/products.ts` defines `grade` per product; `/products` shows it as a badge in this exact visual slot. Best Sellers uses that slot for a repeated category link instead — for a technical buyer, purity/certification grade outweighs a category name the grid position already implies.
- Fix: show `product.grade` as the eyebrow (or add it beside the pack sizes) here, matching the catalogue page's pattern.
- Suggested command: `$impeccable clarify`

**[P1] CTA isn't pinned to the card bottom — misaligns across a row**
- Why it matters: the content wrapper has no `mt-auto` on the "Request Quote" link, and pack-size chip counts vary per product (3 vs. 4 sizes, wrapping differently). Extra vertical space from the grid's row-stretch collects below the CTA instead of above it, so "Request Quote" lands at a different height on each card in the same row.
- Fix: add `mt-auto` to the CTA link (or `flex-1` to a spacer above it) so it pins to a uniform baseline.
- Suggested command: `$impeccable layout`

**[P2] Low-contrast "Pack Sizes" label**
- Why it matters: `text-foreground/30` on the dark background computes to roughly 38% effective lightness against a ~12%-lightness background — almost certainly under WCAG AA's 4.5:1 for normal text.
- Fix: switch to the `text-muted` token already used elsewhere in the same card, calibrated for exactly this contrast case.
- Suggested command: `$impeccable audit`

**[P2] Two of four "best sellers" show a generic stock photo, not the named product**
- Why it matters: `Isopropyl Alcohol 70%` and `Hydrochloric Acid 37%` have no dedicated `image` in the data, so they fall back to the generic category photo — presented identically to the two cards that do have real product photography, under a precise chemical name. In a section meant to build confidence in hand-picked flagship products, an unrelated stock photo under a specific chemical name is a quiet credibility risk.
- Fix: either source real product photography for these two, or give the generic-fallback state a visibly different treatment (e.g., a subtler category-only framing) so it doesn't read as a real product photo.
- Suggested command: `$impeccable harden`

## Persona Red Flags

**Jordan (confused first-time procurement clerk):** Sees "Isopropyl Alcohol 70%" with no grade badge here (unlike the catalogue page), so has no scannable confirmation of "BP / USP Grade" and must click through to `/products` to find the compliance detail needed before requesting a quote. The generic stock photo under that same card makes them second-guess whether it's a real product or a placeholder.

**Riley (deliberate stress-tester):** Resizes narrow and finds "Heavy Duty Degreaser HD-50" (4 pack sizes incl. "1000 L") wraps its chip row to 2 lines while a 3-pack-size neighbor stays on 1 line — exposing the missing-`mt-auto` misalignment directly. Hovers/clicks the product image expecting the zoom to lead somewhere and finds a dead target.

**Casey (distracted mobile user):** At `grid-cols-1`, four full-width stacked cards push a full extra screen or two of scroll before reaching the next section — a lot of commitment for a "teaser," right when this persona is most likely to bail. Touch has no hover, so the entire card is visually inert until tapped — and tapping the one thing most likely to get tapped (the photo) does nothing.

## Minor Observations

- `key={product.name}` is a fragile React key if two products ever share a name across categories — low risk today, worth a stable `id` eventually.
- `alt={product.name}` on the two stock-photo-fallback cards is technically correct but misleading for a screen-reader user, who hears the precise chemical name over an unrelated image.
- This card markup is near-duplicated in two more places in `app/products/page.tsx` (search results, category-grouped grid), each with small divergences — a shared `ProductCard` component would prevent exactly the consistency drift flagged in heuristic #4.

## Frontend-Design Supplementary Notes (aesthetic/typographic direction)

- The mono/uppercase/letter-spaced label system is the card's one authored touch — lean into it further rather than diluting it: e.g., let `product.grade` (not the category) occupy that slot, since grade is the content that's actually specific to a chemical distributor.
- "Best Sellers" as a section title is a borrowed retail phrase; a title in the site's own register (e.g., naming what these products actually are — flagship/most-requested formulations — rather than borrowing "bestseller" ranking language) would tie the section back to the hero's authoritative tone instead of reading as a bolted-on storefront convention.
- Numbered markers (01/02/03/04), if ever added here, would only be justified if the four picks encode a real sequence (they don't — they're one-per-category); avoid adding that pattern purely for visual rhythm.

## Questions to Consider

1. If `grade` is the one field that actually differentiates a serious chemical distributor from a generic retailer, why does the homepage — the highest-traffic, first-impression surface — hide it in favor of repeating the category name the grid position already communicates?
2. Is "Best Sellers" the right frame at all for a made-to-order industrial/agro/medical/lab distributor — would "Most Requested," "Core Product Lines," or "Frequently Sourced" both read more honest and more on-brand with "37 Years of Chemical Precision"?
3. Since these four products are regulated to very different degrees (a lawn treatment vs. fuming hydrochloric acid vs. a pharma-grade disinfectant), should the card flex per category — e.g. surfacing an SDS/COA affordance specifically where it matters — rather than forcing all four into one identical template?
