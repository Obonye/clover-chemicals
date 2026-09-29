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
    <div className="fixed top-0 z-50 h-[var(--utility-bar-h)] w-full bg-[#111111] text-white">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-6 px-6 lg:px-12">
        {/* Brand + division switcher — scrolls sideways rather than
            wrapping or overflowing on narrow screens. */}
        <div className="flex h-full min-w-0 items-center gap-6 overflow-x-auto">
          <NextLink
            className="flex h-full shrink-0 items-center text-sm font-semibold uppercase tracking-[0.1em] text-white/60 transition-colors duration-150 hover:text-white/80"
            href="/"
          >
            Clover Industries
          </NextLink>

          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/20" />

          {useDropdown ? (
            <div ref={dropdownRef} className="relative h-full shrink-0">
              <button
                ref={triggerRef}
                aria-expanded={isOpen}
                className={clsx(
                  "group flex h-full items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                  currentDivision
                    ? "bg-accent px-3 text-accent-foreground"
                    : "text-white/45 hover:text-white/75",
                )}
                data-open={isOpen}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {currentDivision?.name ?? "Divisions"}
                <ChevronDown />
              </button>

              {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded border border-white/10 bg-[#111111] shadow-lg">
                  <ul className="py-1">
                    {divisions.map((d) => (
                      <li key={d.slug}>
                        <NextLink
                          aria-current={d.slug === segment ? "page" : undefined}
                          className="block min-h-11 px-4 py-2.5 transition-colors duration-150 hover:bg-white/10"
                          href={`/${d.slug}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="block text-sm font-semibold text-white">{d.name}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-white/50">
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
                          : "text-white/45 hover:text-white/75",
                      )}
                      href={`/${division.slug}`}
                    >
                      {!isActive && (
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/25" />
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
