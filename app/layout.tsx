import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { cookies, draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontDisplay, fontMedicalDisplay, fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { UtilityBar } from "@/components/utility-bar";
import { Footer } from "@/components/footer";
import { QuickLinksBar } from "@/components/quick-links-bar";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { loadQuery } from "@/sanity/lib/fetch";
import { SanityLive } from "@/sanity/lib/live";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  // Nav's Products dropdown reads live Sanity categories — cached like a
  // static page and only refetched when <SanityLive /> below sees a publish,
  // so this doesn't add fetch latency to every page load.
  const categories = await loadQuery<ProductCategory[]>(CATEGORIES_QUERY);

  // Products, About, and News are shared across both divisions and have no
  // division segment of their own in the URL — so the color they render in
  // follows whichever division the visitor last entered through (set by
  // middleware.ts), not the current route.
  const cookieStore = await cookies();
  const division =
    cookieStore.get("division")?.value === "medical" ? "medical" : "chemical";

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
          fontMedicalDisplay.variable,
        )}
        data-division={division}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex min-h-screen flex-col overflow-x-hidden md:pb-8">
            <UtilityBar initialDivision={division} />
            <Navbar categories={categories} initialDivision={division} />
            <main className="flex-grow pt-28">
              {children}
            </main>
            <Footer />
            <QuickLinksBar />
          </div>
        </Providers>
        <SanityLive />
        {isDraftMode && (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        )}
      </body>
    </html>
  );
}
