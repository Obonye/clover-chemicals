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
type CatalogState = {
  enabled: boolean;
  /** False until /api/catalog-state has answered (or failed). */
  ready: boolean;
};

const CatalogStateContext = React.createContext<CatalogState>({ enabled: false, ready: false });

export function CatalogStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CatalogState>({ enabled: false, ready: false });

  React.useEffect(() => {
    const controller = new AbortController();

    fetch("/api/catalog-state", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { enabled?: boolean } | null) => setState({ enabled: data?.enabled === true, ready: true }))
      .catch((error: unknown) => {
        // Unreachable: products stay hidden. (An abort on unmount is expected.)
        if (!(error instanceof DOMException && error.name === "AbortError")) setState({ enabled: false, ready: true });
      });

    return () => controller.abort();
  }, []);

  return <CatalogStateContext.Provider value={state}>{children}</CatalogStateContext.Provider>;
}

export const useCatalogState = (): CatalogState => React.useContext(CatalogStateContext);

export const useCatalogEnabled = (): boolean => useCatalogState().enabled;

/** Renders its children only while the catalogue is on. Not rendered, rather
 *  than hidden with CSS. */
export function CatalogOnly({ children }: { children: React.ReactNode }) {
  return useCatalogEnabled() ? <>{children}</> : null;
}
