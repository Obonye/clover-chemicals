"use client";

import type { CSSProperties } from "react";

import { useEffect } from "react";

import { paintThemeVars } from "@/lib/theme-vars";

/**
 * For pages that theme only part of the tree (e.g. a division's product
 * page on a shared /products route): also paints the vars onto <body> so
 * overlays portalled there (pack-size select, tooltips) match. Restores the
 * previous values on unmount.
 */
export function BodyTheme({ vars }: { vars: CSSProperties }) {
  const key = JSON.stringify(vars);

  // A passive effect on purpose: it runs after DivisionThemeScope's layout
  // effect (layout effects run child-first, so the ancestor's would
  // otherwise land last and win). `key` keeps a new-but-identical object
  // from re-painting on every render.
  useEffect(() => paintThemeVars([document.body], vars), [key]);

  return null;
}
