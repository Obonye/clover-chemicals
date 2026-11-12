"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";

import { RfqCartLink } from "@/components/rfq/rfq-nav-button";
import { divisions } from "@/config/divisions";

// Above this many divisions, an inline list stops being scannable at this
// bar's height — switch to a "Divisions ▾" dropdown instead. Named so a
// third or fourth division added to config/divisions.ts doesn't silently
// overflow the bar before anyone notices (see CI-14).
const MAX_INLINE_DIVISIONS = 4;

const ChevronDown = () => (
  <svg
    className="h-3 w-3 shrink-0 transition-transform duration-200 group-data-[open=true]:rotate-180"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    viewBox="0 0 24 24"
  >
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Phones only (below md): the inline switcher doesn't fit beside the cart,
 * so the bar shows where you are ("Clover Medical ▾") and opens a full-width
 * list of the group and each division, with taglines.
 */
const MobileDivisionMenu = ({ segment }: { segment: string | null }) => {
  const currentDivision = divisions.find((d) => d.slug === segment);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close whenever the route changes (a link was followed).
  useEffect(() => setIsOpen(false), [segment]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const options = [
    { href: "/", name: "Clover Industries", tagline: "Group home: all our divisions", active: !currentDivision },
    ...divisions.map((d) => ({
      href: `/${d.slug}`,
      name: d.name,
      tagline: d.tagline,
      active: d.slug === segment,
    })),
  ];

  return (
    <div ref={menuRef} className="h-full min-w-0 md:hidden">
      <button
        ref={triggerRef}
        aria-controls="mobile-division-menu"
        aria-expanded={isOpen}
        className="group flex h-full min-w-0 items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-foreground"
        data-open={isOpen}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
      >
        {currentDivision && <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
        <span className="truncate">{currentDivision?.name ?? "Clover Industries"}</span>
        <span className="sr-only">: switch division</span>
        <ChevronDown />
      </button>

      {isOpen && (
        <nav
          aria-label="Divisions"
          className="fixed inset-x-0 top-[var(--utility-bar-h)] border-t border-separator bg-background shadow-lg"
          id="mobile-division-menu"
        >
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.href}>
                <NextLink
                  aria-current={option.active ? "page" : undefined}
                  className="flex min-h-14 items-start gap-3 px-6 py-3 transition-colors duration-150 hover:bg-surface-secondary"
                  href={option.href}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">{option.name}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">{option.tagline}</span>
                  </span>
                  {option.active && (
                    <span className="mt-0.5 text-foreground">
                      <CheckIcon />
                    </span>
                  )}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export const UtilityBar = () => {
  // The first path segment is a pure function of the URL — "chemical" or
  // "medical" under app/[division]/, null everywhere else (shared routes
  // have no division segment at all, so nothing here is ever active).
  const segment = useSelectedLayoutSegment();
  const currentDivision = divisions.find((d) => d.slug === segment);
  const useDropdown = divisions.length > MAX_INLINE_DIVISIONS;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!useDropdown) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [useDropdown]);

  useEffect(() => {
    if (!useDropdown) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, useDropdown]);

  return (
    <div className="fixed top-0 z-50 h-[var(--utility-bar-h)] w-full border-b border-separator bg-background text-foreground">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-6 lg:px-12">
        <MobileDivisionMenu segment={segment} />

        {/* Brand + division switcher (md and up). */}
        <div className="hidden h-full min-w-0 items-center gap-6 overflow-x-auto md:flex">
          <NextLink
            aria-current={segment === null ? "page" : undefined}
            className={clsx(
              "flex h-full shrink-0 items-center text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
              // Active on the group home and every shared (non-division) page.
              currentDivision ? "text-muted hover:text-foreground" : "text-foreground",
            )}
            href="/"
          >
            Clover Industries
          </NextLink>

          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-separator" />

          {useDropdown ? (
            <div ref={dropdownRef} className="relative h-full shrink-0">
              <button
                ref={triggerRef}
                aria-expanded={isOpen}
                className={clsx(
                  "group flex h-full items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                  currentDivision
                    ? "bg-accent px-3 text-accent-foreground"
                    : "text-muted hover:text-foreground",
                )}
                data-open={isOpen}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {currentDivision?.name ?? "Divisions"}
                <ChevronDown />
              </button>

              {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded border border-separator bg-background shadow-lg">
                  <ul className="py-1">
                    {divisions.map((d) => (
                      <li key={d.slug}>
                        <NextLink
                          aria-current={d.slug === segment ? "page" : undefined}
                          className="block min-h-11 px-4 py-2.5 transition-colors duration-150 hover:bg-surface-secondary"
                          href={`/${d.slug}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="block text-sm font-semibold text-foreground">{d.name}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-muted">
                            {d.tagline}
                          </span>
                        </NextLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <ul className="flex h-full items-center gap-6">
              {divisions.map((division) => {
                const isActive = division.slug === segment;

                return (
                  <li key={division.slug} className="h-full shrink-0">
                    {/* bg-accent/text-accent-foreground resolve to *this*
                        division's own colors only when it's the active one
                        — DivisionThemeScope (the ancestor wrapping this bar)
                        scopes --accent to whichever division the current
                        route is under, which is exactly the one that gets
                        isActive: true here. */}
                    <NextLink
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "flex h-full items-center gap-2 px-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted hover:text-foreground",
                      )}
                      href={`/${division.slug}`}
                    >
                      {!isActive && (
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-muted/40" />
                      )}
                      {division.name}
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Outside the scrolling list, so it stays pinned right on mobile. */}
        <div className="ml-auto h-full shrink-0">
          <RfqCartLink />
        </div>
      </div>
    </div>
  );
};
