"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useTheme } from "next-themes";

import { siteConfig } from "@/config/site";

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

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Routes with a full-bleed hero directly beneath the navbar.
  const isMedicalRoute = pathname.startsWith("/medical");
  const isHeroRoute =
    pathname === "/" ||
    pathname === "/about" ||
    isMedicalRoute ||
    (pathname.startsWith("/products/") && pathname !== "/products/");
  const isTransparent = isHeroRoute && !isScrolled;

  // The Medical hero is light (not a dark photo), so transparent-state text
  // needs to stay dark there instead of the white used over the dark heroes.
  const heroText = isMedicalRoute ? "text-heading" : "text-white";
  const heroTextMuted = isMedicalRoute ? "text-muted" : "text-white/70";
  const heroControl = isMedicalRoute
    ? "text-muted hover:text-heading"
    : "text-white/80 hover:text-white";

  // Functional destinations — keep the nav inside whichever division you're
  // browsing instead of always routing back to Chemicals.
  const homeHref = isMedicalRoute ? "/medical" : "/";
  const browseLabel = isMedicalRoute ? "Explore Product Lines" : "Browse Products";
  const browseHref = isMedicalRoute ? "/medical#product-lines" : "/products";
  const mobileNavItems = isMedicalRoute
    ? [{ label: "Product Lines", href: "/medical#product-lines" }]
    : siteConfig.navMenuItems;

  useEffect(() => setMounted(true), []);

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

  const navLinkClass = clsx(
    "text-sm font-semibold transition-colors duration-150 tracking-wide uppercase hover:text-accent",
    isTransparent ? heroText : "text-foreground",
  );

  return (
    <nav
      className={clsx(
        "fixed top-8 z-40 w-full transition-colors duration-300",
        isTransparent
          ? "bg-transparent"
          : "border-b border-separator bg-background",
      )}
    >
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <NextLink className="flex flex-shrink-0 items-center gap-2.5" href={homeHref}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Clover Chemical Industries" className="h-9 w-9" src="/clover-logo.svg" />
          <div className="flex flex-col leading-none">
            <span
              className={clsx(
                "text-sm font-bold tracking-tight transition-colors duration-150",
                isTransparent ? heroText : "text-foreground",
              )}
            >
              CLOVER
            </span>
            <span
              className={clsx(
                "text-[10px] font-medium tracking-[0.12em] uppercase transition-colors duration-150",
                isTransparent ? heroTextMuted : "text-muted",
              )}
            >
              Industries
            </span>
          </div>
        </NextLink>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {/* Products dropdown — Chemicals only; Medical's product lines
              don't have per-category pages yet, so it's a plain link there. */}
          {isMedicalRoute ? (
            <li>
              <NextLink className={navLinkClass} href="/medical#product-lines">
                Product Lines
              </NextLink>
            </li>
          ) : (
            <li ref={dropdownRef} className="relative">
              <button
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
                Products
                <ChevronDown />
              </button>

              {isProductsOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 rounded border border-separator bg-surface shadow-md">
                  <ul className="py-1">
                    {siteConfig.products.map((product) => (
                      <li key={product.href}>
                        <NextLink
                          className="block px-4 py-3 transition-colors duration-150 hover:bg-surface-secondary"
                          href={product.href}
                          onClick={() => setIsProductsOpen(false)}
                        >
                          <span className="block text-sm font-semibold text-foreground">
                            {product.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted leading-snug">
                            {product.description}
                          </span>
                        </NextLink>
                      </li>
                    ))}
                    <li className="mx-4 mt-1 mb-2 border-t border-separator pt-2">
                      <NextLink
                        className="text-xs font-semibold uppercase tracking-wider text-accent hover:text-accent/80 transition-colors"
                        href="/products"
                        onClick={() => setIsProductsOpen(false)}
                      >
                        View all products →
                      </NextLink>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          )}

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
          <NextLink
            className={clsx(
              "rounded px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors",
              isTransparent ? heroControl : "text-muted hover:text-foreground",
            )}
            href={isMedicalRoute ? "/contact?division=medical" : "/contact"}
          >
            Get a Quote
          </NextLink>
          <NextLink
            className="rounded bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
            href={browseHref}
          >
            {browseLabel}
          </NextLink>
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

      {/* Mobile menu — always in DOM, toggled via CSS to avoid iOS rendering issues */}
      <div
        aria-hidden={!isMenuOpen}
        className={`fixed inset-x-0 top-24 z-50 border-t border-separator bg-background shadow-lg lg:hidden ${isMenuOpen ? "block" : "hidden"}`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {mobileNavItems.map((item) => (
            <li key={item.href}>
              <NextLink
                className="block py-2.5 text-sm font-semibold uppercase tracking-wide text-muted hover:text-accent transition-colors"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            </li>
          ))}
        </ul>
        <div className="border-t border-separator px-6 py-4 flex flex-col gap-3">
          {mounted && (
            <button
              aria-label="Toggle theme"
              style={{ touchAction: "manipulation" }}
              type="button"
              className="flex items-center gap-2 py-2 text-sm font-semibold uppercase tracking-wide text-muted hover:text-foreground transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          )}
          <NextLink
            className="block w-full rounded bg-accent px-4 py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-accent-foreground hover:bg-accent/90 transition-colors"
            href={browseHref}
            onClick={() => setIsMenuOpen(false)}
          >
            {browseLabel}
          </NextLink>
        </div>
      </div>
    </nav>
  );
};
