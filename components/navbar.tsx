"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
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
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

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

  const navLinkClass =
    "text-sm font-semibold text-foreground hover:text-accent transition-colors duration-150 tracking-wide uppercase";

  return (
    <nav className="sticky top-0 z-40 w-full bg-background">
      <header className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-6">
        {/* Logo */}
        <NextLink className="flex flex-shrink-0 items-center gap-2.5" href="/">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent">
            <svg fill="none" height={18} viewBox="0 0 24 24" width={18}>
              <path
                d="M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z"
                fill="white"
              />
            </svg>
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-foreground">
              CLOVER
            </span>
            <span className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
              Chemical Industries
            </span>
          </div>
        </NextLink>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 lg:flex">
          {/* Products dropdown */}
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
              className="rounded p-2 text-muted transition-colors hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          )}
          <NextLink
            className="rounded px-4 py-2 text-sm font-semibold uppercase tracking-wide text-muted transition-colors hover:text-foreground"
            href="/contact"
          >
            Get a Quote
          </NextLink>
          <NextLink
            className="rounded bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
            href="/products"
          >
            Browse Products
          </NextLink>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-muted hover:text-foreground transition-colors lg:hidden"
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
        className={`fixed inset-x-0 top-16 z-50 border-t border-separator bg-background shadow-lg lg:hidden ${isMenuOpen ? "block" : "hidden"}`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {siteConfig.navMenuItems.map((item) => (
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
            href="/products"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse Products
          </NextLink>
        </div>
      </div>
    </nav>
  );
};
