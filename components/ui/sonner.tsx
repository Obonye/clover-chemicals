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
          description: "!text-muted",
          actionButton: "!rounded-lg !bg-accent !font-semibold !text-accent-foreground",
          cancelButton: "!rounded-lg",
        },
      }}
      {...props}
    />
  );
};
