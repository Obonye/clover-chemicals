"use client";

import * as React from "react";

/**
 * Whether the product catalogue is on, for client components and for pages
 * that stay static (About, Contact, /rfq…) so they don't have to be rendered
 * per request just to hide a link. Starts as `false`, so the server HTML
 * never contains product links; if the flag is on, they appear once
 * /api/catalog-state answers (CI-72).
 *
 * Server-rendered pages that already render per request read the flag
 * directly (lib/catalog/visibility.ts) instead.
 */
const CatalogStateContext = React.createContext(false);

export function CatalogStateProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();

    fetch("/api/catalog-state", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { enabled?: boolean } | null) => setEnabled(data?.enabled === true))
      .catch(() => {
        // Unreachable or aborted: products stay hidden.
      });

    return () => controller.abort();
  }, []);

  return <CatalogStateContext.Provider value={enabled}>{children}</CatalogStateContext.Provider>;
}

export const useCatalogEnabled = (): boolean => React.useContext(CatalogStateContext);

/** Renders its children only while the catalogue is on. Not rendered, rather
 *  than hidden with CSS. */
export function CatalogOnly({ children }: { children: React.ReactNode }) {
  return useCatalogEnabled() ? <>{children}</> : null;
}
