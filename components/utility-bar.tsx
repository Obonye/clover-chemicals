"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import {
  DIVISION_CHANGE_EVENT,
  DIVISION_STORAGE_KEY,
  persistDivision,
  type DivisionChangeEvent,
  type SiteDivision,
} from "@/lib/division";

const siblings: { label: string; href: string; division: SiteDivision }[] = [
  { label: "Clover Chemical", href: "/", division: "chemical" },
  { label: "Clover Medical", href: "/medical", division: "medical" },
];

function resolveDivision(pathname: string, fallback: SiteDivision): SiteDivision {
  if (pathname.startsWith("/medical")) return "medical";
  if (pathname === "/") return "chemical";

  return fallback;
}

interface UtilityBarProps {
  /** Division resolved server-side from the `division` cookie (see
   *  middleware.ts) — used only to paint the first render correctly on a
   *  hard page load. Every client-side navigation after that is resolved
   *  below instead, since the root layout that computed this prop doesn't
   *  re-render on a soft navigation. */
  initialDivision: SiteDivision;
}

export const UtilityBar = ({ initialDivision }: UtilityBarProps) => {
  const pathname = usePathname();
  const [division, setDivision] = useState<SiteDivision>(() =>
    resolveDivision(pathname, initialDivision),
  );

  // Re-resolves on every client-side navigation (usePathname changes even
  // though the shared root layout itself doesn't re-render), and keeps the
  // shared --accent color token — driven by body[data-division] — in sync.
  useEffect(() => {
    let remembered: SiteDivision = initialDivision;

    try {
      const stored = localStorage.getItem(DIVISION_STORAGE_KEY);

      if (stored === "chemical" || stored === "medical") remembered = stored;
    } catch {
      // Storage can be unavailable (private mode, blocked); ignore.
    }

    const resolved = resolveDivision(pathname, remembered);

    setDivision(resolved);
    document.body.dataset.division = resolved;

    // Only "/" and "/medical" are division-exclusive — persisting here too
    // would overwrite the remembered preference just from browsing a
    // shared page like /products in whatever division it last resolved to.
    if (pathname === "/" || pathname.startsWith("/medical")) {
      persistDivision(resolved);
    }
  }, [pathname, initialDivision]);

  // Something other than navigation changed the division — e.g. the
  // /products page's own division filter — so pick it up without a reload.
  useEffect(() => {
    function handleDivisionChange(event: Event) {
      setDivision((event as DivisionChangeEvent).detail);
    }

    window.addEventListener(DIVISION_CHANGE_EVENT, handleDivisionChange);

    return () => window.removeEventListener(DIVISION_CHANGE_EVENT, handleDivisionChange);
  }, []);

  return (
    <div className="fixed top-0 z-50 w-full bg-[#111111] text-white">
      <div className="mx-auto flex h-8 max-w-[1280px] items-center gap-5 px-6 pb-1 sm:pb-0 lg:px-12">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/60">
          Clover Industries
        </span>

        <span aria-hidden="true" className="h-3 w-px bg-white/20" />

        <ul className="flex items-center gap-5">
          {siblings.map((sibling) => {
            const isActive = sibling.division === division;

            return (
              <li key={sibling.href}>
                <NextLink
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                    isActive ? "text-accent" : "text-white/45 hover:text-white/75",
                  )}
                  href={sibling.href}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "h-1.5 w-1.5 rounded-full transition-colors duration-150",
                      isActive ? "bg-accent" : "bg-white/25",
                    )}
                  />
                  {sibling.label}
                </NextLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
