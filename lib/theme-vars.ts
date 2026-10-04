import type { CSSProperties } from "react";

/**
 * Sets theme custom properties (from divisionCssVars) inline on each element
 * and returns a function that puts back whatever was there before.
 *
 * Used to mirror the active theme onto <body>: popovers, selects, tooltips,
 * date pickers and drawers portal there, outside DivisionThemeScope's
 * element, and would otherwise fall back to the :root (Chemical) defaults.
 */
export function paintThemeVars(elements: HTMLElement[], vars: CSSProperties): () => void {
  const entries = Object.entries(vars) as [string, string][];
  const previous = elements.map((el) =>
    entries.map(([key]) => [key, el.style.getPropertyValue(key)] as const),
  );

  for (const el of elements) {
    for (const [key, value] of entries) el.style.setProperty(key, value);
  }

  return () => {
    elements.forEach((el, i) => {
      for (const [key, value] of previous[i]) {
        if (value) el.style.setProperty(key, value);
        else el.style.removeProperty(key);
      }
    });
  };
}
