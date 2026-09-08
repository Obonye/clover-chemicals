import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontDisplay, fontMedicalDisplay, fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { UtilityBar } from "@/components/utility-bar";
import { Footer } from "@/components/footer";
import { QuickLinksBar } from "@/components/quick-links-bar";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <div className="relative flex min-h-screen flex-col overflow-x-hidden md:pb-8">
            <UtilityBar />
            <Navbar />
            <main className="flex-grow pt-24">
              {children}
            </main>
            <Footer />
            <QuickLinksBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
