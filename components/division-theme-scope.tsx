"use client";

import { useSelectedLayoutSegment } from "next/navigation";

import { divisionCssVars, getDivision, themeFor } from "@/config/divisions";

// Wraps the entire chrome — utility bar, navbar, page content, footer,
// quick-links bar — so a division's theme tokens reach all of them, not
// just the page content under app/[division]. useSelectedLayoutSegment()
// resolves from the matched route itself, on the server as much as the
// client, so this paints correctly on first render with no flash — the
// same reason app/[division]/layout.tsx doesn't need a useEffect for it.
export function DivisionThemeScope({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const division = segment ? getDivision(segment) : undefined;

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-x-hidden md:pb-8"
      data-division={division?.slug ?? "group"}
      data-theme-scope=""
      style={divisionCssVars(themeFor(division))}
    >
      {children}
    </div>
  );
}
