# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint with auto-fix
```

There is no test suite configured.

## Architecture

This is a **Next.js 16 App Router** project using **HeroUI v3** as the component library, **Tailwind CSS v4**, and **TypeScript**.

### Key conventions

- `@/` path alias maps to the repo root (e.g., `@/config/site`, `@/components/navbar`).
- All nav items and external links are centrally defined in `config/site.ts` (`siteConfig`). Update navigation there, not in individual components.
- `config/fonts.ts` exports `fontSans` (Inter) and `fontMono` (Fira Code) as Next.js Google Font objects; `fontSans.variable` is applied on `<body>` in `app/layout.tsx`.
- Theme is dark by default (`defaultTheme: "dark"`) via `next-themes`; the `Providers` wrapper in `app/providers.tsx` is a client component that wraps `NextThemesProvider`. Dark mode uses the `.dark` class strategy (`@custom-variant dark (&:is(.dark *))`).
- `styles/globals.css` imports Tailwind and HeroUI styles — do not add component styles here; use Tailwind utility classes or `tailwind-variants`.

### Styling patterns

- `components/primitives.ts` exports `title` and `subtitle` as `tailwind-variants` (`tv`) variant objects — use these for consistent typography across pages, not raw Tailwind classes.
- HeroUI semantic color tokens (`text-foreground`, `text-muted`, `text-accent`, `bg-background`, `border-separator`, etc.) are used throughout. Prefer these over raw Tailwind colors for theme compatibility.

### Route structure

Each route under `app/` has its own `layout.tsx` and `page.tsx`. The root `app/layout.tsx` renders the shared `<Navbar />` and a full-height flex column with a footer. Per-route layouts wrap only that section's content.

### ESLint rules to be aware of

- JSX props must be sorted alphabetically (`react/jsx-sort-props`), with reserved props first and callbacks last.
- Imports must be ordered by group: `type → builtin → external → internal → parent → sibling → index`, with newlines between groups.
- `no-console` is a warning — avoid `console.log` in committed code.
