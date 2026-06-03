---
name: Clover Industrial Nexus
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3f4a3c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6f7a6b'
  outline-variant: '#becab9'
  surface-tint: '#006e1c'
  primary: '#006e1c'
  on-primary: '#ffffff'
  primary-container: '#4caf50'
  on-primary-container: '#003c0b'
  inverse-primary: '#78dc77'
  secondary: '#4e6073'
  on-secondary: '#ffffff'
  secondary-container: '#cfe2f9'
  on-secondary-container: '#526478'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c9b9b'
  on-tertiary-container: '#333333'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#94f990'
  primary-fixed-dim: '#78dc77'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005313'
  secondary-fixed: '#d1e4fb'
  secondary-fixed-dim: '#b5c8df'
  on-secondary-fixed: '#091d2e'
  on-secondary-fixed-variant: '#36485b'
  tertiary-fixed: '#e4e2e1'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
  clover-green: '#4CAF50'
  deep-slate: '#2C3E50'
  charcoal: '#333333'
  industrial-gray: '#F8F9FA'
  border-gray: '#D1D5DB'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter-desktop: 24px
  margin-desktop: 64px
  gutter-mobile: 16px
  margin-mobile: 20px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for **Clover Chemical Industries** to project an image of absolute technical authority, heritage, and industrial precision. It avoids "consumer-retail fluff" in favor of a **Corporate Modern** aesthetic that leans into structural rigors and high-end B2B professionalism.

The personality is:
- **Authoritative:** 37 years of legacy distilled into a confident, no-nonsense interface.
- **Precise:** Every element is aligned to a strict grid, mirroring the chemical accuracy of the product line.
- **Organized:** Content-heavy technical specs are prioritized through a clear, functional hierarchy.

The visual style utilizes **Modern Minimalism** with industrial touches. It prioritizes clarity over decoration, using ample white space to frame dense technical data and high-contrast typography to ensure legibility across industrial environments.

## Colors

The palette is anchored by **Clover Green**, a vibrant yet professional primary color that denotes growth, safety, and chemical innovation. This is balanced by a triad of industrial grays and slates that provide the "weight" necessary for a B2B infrastructure.

- **Primary (Clover Green):** Used for primary actions, branding, and status indicators.
- **Secondary (Deep Slate):** The color of authority. Used for navigation bars, headers, and hero backgrounds to provide strong contrast.
- **Tertiary (Charcoal):** Used for primary body text and high-level headings to ensure maximum readability.
- **Neutral (Industrial Gray):** Used for section backgrounds and table headers to separate data without adding visual clutter.

## Typography

This design system uses a triple-font approach to handle corporate, technical, and data-heavy content.

1.  **Hanken Grotesk (Headlines):** A sharp, contemporary grotesque that feels engineered and modern. Used for page titles and major sections to project a forward-thinking industrial image.
2.  **Inter (Body):** Selected for its exceptional legibility in dense spec sheets and company descriptions. Its neutral character ensures that the content remains the hero.
3.  **JetBrains Mono (Technical Labels):** Used sparingly for product codes, technical specs, and certifications. The monospaced nature signals precision and data accuracy.

Headlines should use tight letter-spacing for a more impactful, "locked-in" look.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to ensure a controlled, premium presentation of information. 

- **Grid:** 12-column structure with 24px gutters.
- **Rhythm:** An 8px base unit drives all vertical spacing. This "Industrial Rhythm" ensures that components like tables and input fields align perfectly across various templates.
- **Breakpoints:**
  - **Desktop (1280px+):** Full 12-column grid with 64px margins.
  - **Tablet (768px - 1279px):** 8-column grid with 32px margins.
  - **Mobile (Up to 767px):** 4-column fluid grid with 20px margins.

Technical content sections (like chemical tables) should utilize a "Comfortable" density, meaning generous padding (24px+) within containers to prevent information overload.

## Elevation & Depth

To maintain an authoritative and "flat-industrial" feel, the system avoids heavy drop shadows and decorative blurs. Instead, hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines**.

- **Surface Levels:** 
  - Level 0 (Background): #F8F9FA (Industrial Gray)
  - Level 1 (Cards/Content Blocks): #FFFFFF
  - Level 2 (Interactive/Overlay): White with a very subtle 1px border (#D1D5DB).
- **Outlines:** Use 1px solid borders in `border-gray` for cards, tables, and input fields. This mimics the structured look of technical blueprints.
- **Interaction Depth:** On hover, elements may use a minimal, crisp shadow (4px blur, 10% opacity) to signify clickability without losing the professional "flat" aesthetic.

## Shapes

The design system adopts a **Soft (Level 1)** roundedness approach. While traditional industrial design is often sharp, a subtle 4px (0.25rem) radius on buttons and cards softens the UI just enough to feel modern and accessible while retaining a sense of rigid stability.

- **Standard Radius:** 4px (Base elements, buttons, inputs).
- **Large Radius:** 8px (Cards, section containers).
- **Checkboxes/Radio:** 2px or sharp corners to emphasize technical precision.

## Components

### Buttons
- **Primary:** Solid `clover-green` with white text. Uppercase typography for an authoritative tone. 4px corner radius.
- **Secondary:** Solid `deep-slate` or ghost style with a 2px `clover-green` border. 
- **Sizes:** Large (56px height) for CTA, Medium (40px) for standard forms.

### Technical Tables
- **Header:** `industrial-gray` background with `label-technical` (JetBrains Mono) text.
- **Rows:** Alternating "Zebra" stripes for readability in dense chemical spec sheets.
- **Borders:** 1px horizontal dividers only, using `border-gray`.

### Input Fields
- **Style:** 1px solid `border-gray` with a subtle focus state using a 2px `clover-green` inner border.
- **Labels:** Always visible above the field in `body-sm` bold.

### Cards
- **Construction:** White background, 1px `border-gray` outline, 8px corner radius. No shadow by default.
- **Usage:** Used to categorize product divisions (Agro, Medical, Lab).

### Icons
- **Style:** 2px stroke weight, geometric, and functional. 
- **Note:** Use text-based arrows (e.g., `→`) or simple chevrons to maintain the clean, "catalogue" feel of the system.