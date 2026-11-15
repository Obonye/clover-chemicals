"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * Cross-fades the page between routes (B2). Only the page content is
 * animated: the utility bar and navbar are anchored with their own
 * view-transition names (styles/globals.css) so they never flicker.
 *
 * `default="none"` keeps every other update quiet; only a route change (the
 * pathname key) plays `.page-enter` / `.page-exit`. Query-only changes, like
 * catalogue filters, share a pathname and do not animate.
 *
 * To switch this off, set `experimental.viewTransition` to false in
 * next.config.mjs: the component then renders its children untouched.
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} default="none" enter="page-enter" exit="page-exit">
      <div>{children}</div>
    </ViewTransition>
  );
};
