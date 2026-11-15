"use client";

import type { ToasterProps } from "sonner";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

/**
 * The site's one toast surface (CI-85 follow-up: quote-flow feedback).
 * Themed from the HeroUI tokens, so it follows light/dark and the active
 * division's accent (it is mounted inside DivisionThemeScope). A toast is a
 * panel, so it uses the card radius.
 */
export const Toaster = (props: ToasterProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      closeButton
      className="toaster group"
      duration={4500}
      position="bottom-center"
      style={
        {
          "--normal-bg": "var(--overlay)",
          "--normal-text": "var(--overlay-foreground)",
          "--normal-border": "var(--separator)",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast: "font-sans",
          title: "font-semibold",
          // Inherits the toast colour, so it stays legible on the coloured types.
          description: "!text-current !opacity-80",
          // Outlined in the toast colour: an accent button would vanish on a
          // green toast in Chemical.
          actionButton: "!rounded-lg !bg-transparent !font-semibold !text-current !ring-1 !ring-current/40 hover:!bg-black/10",
          cancelButton: "!rounded-lg",
          // Added or updated: green. Removed or failed: red. A limit: amber.
          success: "!border-transparent !bg-success !text-success-foreground",
          error: "!border-transparent !bg-danger !text-danger-foreground",
          warning: "!border-transparent !bg-warning !text-warning-foreground",
        },
      }}
      {...props}
    />
  );
};
