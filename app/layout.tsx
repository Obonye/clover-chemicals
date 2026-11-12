import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { Providers } from "./providers";

import { siteConfig, SITE_URL } from "@/config/site";
import { fontDisplay, fontMedicalDisplay, fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { UtilityBar } from "@/components/utility-bar";
import { DivisionThemeScope } from "@/components/division-theme-scope";
import { Footer } from "@/components/footer";
import { QuickLinksBar } from "@/components/quick-links-bar";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { loadQuery } from "@/sanity/lib/fetch";
import { SanityLive } from "@/sanity/lib/live";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory } from "@/sanity/lib/types";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  // The Clover mark, trimmed and squared from public/clover-logo.svg:
  // favicon.ico (16/32/48), icon.png (512) and the iOS home-screen icon.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
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
  // Nav's Products dropdown and the footer's Products column both read this
  // same live Sanity fetch — cached like a static page and only refetched
  // when <SanityLive /> below sees a publish, so this doesn't add fetch
  // latency to every page load.
  const categories = await loadQuery<ProductCategory[]>(CATEGORIES_QUERY);

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
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <DivisionThemeScope>
            <UtilityBar />
            <Navbar categories={categories} />
            <main className="flex-grow pt-[var(--header-h)]">
              {children}
            </main>
            <Footer categories={categories} />
            <QuickLinksBar />
          </DivisionThemeScope>
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
