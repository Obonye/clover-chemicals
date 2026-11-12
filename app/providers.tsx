"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { CatalogStateProvider } from "@/components/catalog-state";
import { RfqProvider } from "@/lib/rfq/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <CatalogStateProvider>
        <RfqProvider>{children}</RfqProvider>
      </CatalogStateProvider>
    </NextThemesProvider>
  );
}
