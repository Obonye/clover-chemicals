import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-display font-extrabold",
  variants: {
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-muted block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

/**
 * The mono section/page-header eyebrow shared by every page (CI-92). Size,
 * weight and tracking are fixed; the colour follows the active theme's accent,
 * so each division's pages pick up their own colour. Use "onDark" over photos.
 */
export const eyebrow = tv({
  base: "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
  variants: {
    tone: {
      accent: "text-accent",
      onDark: "text-white/70",
    },
  },
  defaultVariants: {
    tone: "accent",
  },
});
