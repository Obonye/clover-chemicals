"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  // Inside the Presentation iframe the Studio provides its own toggle,
  // so only show this when previewing the site directly.
  if (isPresentationTool !== false) {
    return null;
  }

  return (
    <a
      className="fixed bottom-4 right-4 z-50 rounded bg-foreground px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-background shadow-lg"
      href="/api/draft-mode/disable"
    >
      Disable Draft Mode
    </a>
  );
}
