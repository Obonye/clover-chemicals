"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { Drawer } from "@heroui/react";

import { RfqNavButton } from "@/components/rfq/rfq-nav-button";
import { siteConfig } from "@/config/site";
import { divisionCssVars, divisions, getDivision, themeFor } from "@/config/divisions";
import type { ProductCategory } from "@/sanity/lib/types";

// Nav category links jump straight into the filterable products grid with
// that category pre-selected, rather than the standalone /products/[category]
// landing page (kept for SEO/hero value elsewhere).
const categoryFilterHref = (basePath: string, slug: string | null | undefined): string =>
  slug ? `${basePath}?category=${encodeURIComponent(slug)}` : basePath;

const SunIcon = () => (
  <svg fill="none" height={18} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={18}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg fill="none" height={18} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={18}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = () => (
  <svg
    className="ml-1 inline-block h-3.5 w-3.5 transition-transform duration-200 group-data-[open=true]:rotate-180"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type NavbarProps = {
  /** Live Sanity categories — the desktop dropdown scopes these to the
   *  current division (or lists divisions instead on shared routes); the
   *  mobile menu still scopes to Chemicals only, pending CI-5. */
  categories: ProductCategory[];
};

export const Navbar = ({ categories }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const productsTriggerRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // The URL's first segment is the only source of division now — "chemical"
  // or "medical" under app/[division]/, undefined on every shared route
  // (there's nothing to fall back to, and nothing should: shared routes are
  // always the same for every visitor).
  const segment = useSelectedLayoutSegment();
  const division = segment ? getDivision(segment) : undefined;
  const isDivisionHome = Boolean(division) && pathname === `/${segment}`;
  // Desktop dropdown's own list — categories for the current division, or
  // none at all on umbrella pages (where the dropdown lists divisions instead).
  const divisionCategories = division
    ? categories.filter((cat) => cat.division === division.sanityDivision)
    : [];

  // Which page layout is under the navbar right now — strictly path-based,
  // since it describes a division home's own hero, not a fallback guess.
  // The /products/<category> landing page has a full-bleed dark hero
  // banner; /products/<category>/<product> (CI-26) does not — it's a
  // plain light breadcrumb bar — so this has to stop at exactly one
  // segment past /products/, not match every path that starts with it.
  const isHeroRoute =
    pathname === "/" ||
    pathname === "/about" ||
    isDivisionHome ||
    /^\/products\/[^/]+\/?$/.test(pathname);
  const isTransparent = isHeroRoute && !isScrolled;

  // A light hero (e.g. Medical's) needs dark nav text instead of the white
  // used over the dark photo heroes most divisions have.
  const navTextStyle = division?.theme?.navTextStyle ?? "light";
  const heroText = navTextStyle === "dark" ? "text-heading" : "text-white";
  const heroTextMuted = navTextStyle === "dark" ? "text-muted" : "text-white/70";
  const heroControl =
    navTextStyle === "dark" ? "text-muted hover:text-heading" : "text-white/80 hover:text-white";

  // Functional destinations — keep the nav inside whichever division you're
  // browsing instead of always routing back to one. Products, About, and
  // News are shared across both divisions, so they don't branch on path.
  // With no division (shared routes), the logo leads to the group home.
  const homeHref = division ? `/${division.slug}` : "/";
  const browseLabel = division?.browseLabel ?? "Browse Products";
  const browseHref = division ? `/${division.slug}/products` : "/products";
  // "Browse Products" belongs on the division sites only. The group home
  // keeps just the "Get a Quote" shortcut (CI-32).
  const showBrowse = pathname !== "/";

  useEffect(() => setMounted(true), []);

  // Collapse the mobile Products group back down each time the menu itself
  // closes, so it doesn't reopen already-expanded next time.
  useEffect(() => {
    if (!isMenuOpen) setIsMobileProductsOpen(false);
  }, [isMenuOpen]);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsProductsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isProductsOpen) {
        setIsProductsOpen(false);
        productsTriggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isProductsOpen]);

  const navLinkClass = clsx(
    "text-sm font-semibold whitespace-nowrap transition-colors duration-150 tracking-wide uppercase hover:text-accent",
    isTransparent ? heroText : "text-foreground",
  );

  return (
    <nav
      className={clsx(
        "fixed top-[var(--utility-bar-h)] z-40 w-full transition-colors duration-300",
        isTransparent
          ? "bg-transparent"
          : "border-b border-separator bg-background",
      )}
    >
      <header className="mx-auto flex h-[var(--navbar-h)] max-w-[1280px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <NextLink className="flex flex-shrink-0 items-center gap-2.5" href={homeHref}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={division ? division.name : "Clover Industries"}
            className="h-9 w-9"
            src="/clover-logo.svg"
          />
          <div className="flex flex-col leading-none">
            <span
              className={clsx(
                "text-sm font-bold tracking-tight transition-colors duration-150",
                isTransparent ? heroText : "text-foreground",
              )}
            >
              CLOVER INDUSTRIES
            </span>
            <span
              className={clsx(
                "text-[10px] font-medium tracking-[0.12em] uppercase transition-colors duration-150",
                isTransparent ? heroTextMuted : "text-muted",
              )}
            >
              {division ? division.shortName : "Lift as you rise"}
            </span>
          </div>
        </NextLink>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {/* Scoped to the current division; on shared routes (no division
              in the URL) it lists divisions instead — see `division` above. */}
          <li ref={dropdownRef} className="relative">
            <button
              ref={productsTriggerRef}
              aria-expanded={isProductsOpen}
              aria-haspopup="true"
              className={clsx(
                navLinkClass,
                "group flex cursor-pointer items-center",
                isProductsOpen && "text-accent",
              )}
              data-open={isProductsOpen}
              onClick={() => setIsProductsOpen((prev) => !prev)}
            >
              {division ? "Products" : "Divisions"}
              <ChevronDown />
            </button>

            {isProductsOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded border border-separator bg-surface shadow-md">
                <ul className="py-1">
                  {division ? (
                    <>
                      {divisionCategories.map((cat) => (
                        <li key={cat._id}>
                          <NextLink
                            className="block px-4 py-3 transition-colors duration-150 hover:bg-surface-secondary"
                            href={categoryFilterHref(`/${division.slug}/products`, cat.slug)}
                            onClick={() => setIsProductsOpen(false)}
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {cat.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted leading-snug">
                              {cat.description}
                            </span>
                          </NextLink>
                        </li>
                      ))}
                      <li className="mx-4 mt-1 mb-2 border-t border-separator pt-2">
                        <NextLink
                          className="text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors"
                          href={`/${division.slug}/products`}
                          onClick={() => setIsProductsOpen(false)}
                        >
                          View all products →
                        </NextLink>
                      </li>
                    </>
                  ) : (
                    divisions.map((d) => (
                      <li key={d.slug}>
                        <NextLink
                          className="block px-4 py-3 transition-colors duration-150 hover:bg-surface-secondary"
                          href={`/${d.slug}`}
                          onClick={() => setIsProductsOpen(false)}
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {d.name}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted leading-snug">
                            {d.tagline}
                          </span>
                        </NextLink>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </li>

          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink className={navLinkClass} href={item.href}>
                {item.label}
              </NextLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          {mounted && (
            <button
              aria-label="Toggle theme"
              className={clsx(
                "rounded p-2 transition-colors",
                isTransparent ? heroControl : "text-muted hover:text-foreground",
              )}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
          <RfqNavButton
            className={isTransparent ? heroControl : "text-muted hover:text-foreground"}
            variant="desktop"
          />
          {showBrowse && (
            <NextLink
              className="whitespace-nowrap rounded bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
              href={browseHref}
            >
              {browseLabel}
            </NextLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
          className={clsx(
            "flex min-h-[44px] min-w-[44px] items-center justify-center rounded transition-colors lg:hidden",
            isTransparent ? heroControl : "text-muted hover:text-foreground",
          )}
          style={{ touchAction: "manipulation" }}
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu — Drawer (React Aria Modal underneath) gives us
          Escape-to-close, focus-trap + focus-return-to-trigger, and
          body-scroll-lock for free; see product-catalogue.tsx's filter
          sheet for the same pattern already in use elsewhere. */}
      <Drawer>
        {/* The drawer portals out of DivisionThemeScope, so it re-applies
            the division's colour tokens itself. */}
        <Drawer.Backdrop
          isOpen={isMenuOpen}
          style={divisionCssVars(themeFor(division))}
          onOpenChange={setIsMenuOpen}
        >
          <Drawer.Content placement="right">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading className="sr-only">Menu</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="flex flex-col gap-1">
                <div className="mb-3">
                  <RfqNavButton variant="drawer" onNavigate={() => setIsMenuOpen(false)} />
                </div>
                {division ? (
                  <>
                    <button
                      aria-expanded={isMobileProductsOpen}
                      className="group flex min-h-[44px] w-full items-center justify-between text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                      data-open={isMobileProductsOpen}
                      type="button"
                      onClick={() => setIsMobileProductsOpen((prev) => !prev)}
                    >
                      Products
                      <ChevronDown />
                    </button>
                    {isMobileProductsOpen && (
                      <ul className="flex flex-col gap-1 pl-4">
                        {divisionCategories.map((cat) => (
                          <li key={cat._id}>
                            <NextLink
                              className="flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-accent"
                              href={categoryFilterHref(`/${division.slug}/products`, cat.slug)}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {cat.label}
                            </NextLink>
                          </li>
                        ))}
                        <li>
                          <NextLink
                            className="flex min-h-[44px] items-center text-sm font-semibold text-accent"
                            href={`/${division.slug}/products`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            View all products →
                          </NextLink>
                        </li>
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mt-2 font-mono text-xs font-medium uppercase tracking-widest text-muted">
                      Divisions
                    </p>
                    {divisions.map((d) => (
                      <NextLink
                        key={d.slug}
                        className="flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                        href={`/${d.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {d.name}
                      </NextLink>
                    ))}
                  </>
                )}

                {siteConfig.navItems.map((item) => (
                  <NextLink
                    key={item.href}
                    className="flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NextLink>
                ))}

                {division && (
                  <>
                    <p className="mt-2 font-mono text-xs font-medium uppercase tracking-widest text-muted">
                      Switch Division
                    </p>
                    {divisions
                      .filter((d) => d.slug !== division.slug)
                      .map((d) => (
                        <NextLink
                          key={d.slug}
                          className="flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-accent"
                          href={`/${d.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {d.name}
                        </NextLink>
                      ))}
                  </>
                )}

                {mounted && (
                  <button
                    aria-label="Toggle theme"
                    className="mt-2 flex min-h-[44px] items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
                    style={{ touchAction: "manipulation" }}
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                )}
              </Drawer.Body>
              {showBrowse && (
                <Drawer.Footer className="flex flex-col gap-3">
                  <NextLink
                    className="block w-full rounded border-2 border-separator px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:bg-surface-secondary"
                    href={browseHref}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {browseLabel}
                  </NextLink>
                </Drawer.Footer>
              )}
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </nav>
  );
};
