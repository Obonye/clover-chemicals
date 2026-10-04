"use client";

import { useLayoutEffect, useMemo } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import { divisionCssVars, getDivision, themeFor } from "@/config/divisions";
import { paintThemeVars } from "@/lib/theme-vars";

// Wraps the entire chrome — utility bar, navbar, page content, footer,
// quick-links bar — so a division's theme tokens reach all of them, not
// just the page content under app/[division]. useSelectedLayoutSegment()
// resolves from the matched route itself, on the server as much as the
// client, so this paints correctly on first render with no flash — the
// same reason app/[division]/layout.tsx doesn't need a useEffect for it.
export function DivisionThemeScope({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const division = segment ? getDivision(segment) : undefined;
  const vars = useMemo(() => divisionCssVars(themeFor(division)), [division]);

  // Overlays (popovers, selects, date pickers, tooltips) portal to <body>,
  // outside this element, so mirror the same vars there too. Overlays only
  // open after hydration, so doing this client-side causes no flash.
  useLayoutEffect(() => paintThemeVars([document.body], vars), [vars]);

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-x-hidden"
      data-division={division?.slug ?? "group"}
      data-theme-scope=""
      style={vars}
    >
      {children}
    </div>
  );
}
