"use client";

import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";

import { divisions } from "@/config/divisions";

export const UtilityBar = () => {
  // The first path segment is a pure function of the URL — "chemical" or
  // "medical" under app/[division]/, null everywhere else (shared routes
  // have no division segment at all, so nothing here is ever active).
  const segment = useSelectedLayoutSegment();

  return (
    <div className="fixed top-0 z-50 w-full bg-[#111111] text-white">
      <div className="mx-auto flex h-12 max-w-[1280px] items-center gap-6 px-6 lg:px-12">
        <NextLink
          className="text-sm font-semibold uppercase tracking-[0.1em] text-white/60 transition-colors duration-150 hover:text-white/80"
          href="/"
        >
          Clover Industries
        </NextLink>

        <span aria-hidden="true" className="h-4 w-px bg-white/20" />

        <ul className="flex items-center gap-6">
          {divisions.map((division) => {
            const isActive = division.slug === segment;

            return (
              <li key={division.slug}>
                <NextLink
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                    isActive ? "text-accent" : "text-white/45 hover:text-white/75",
                  )}
                  href={`/${division.slug}`}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "h-2 w-2 rounded-full transition-colors duration-150",
                      isActive ? "bg-accent" : "bg-white/25",
                    )}
                  />
                  {division.name}
                </NextLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
