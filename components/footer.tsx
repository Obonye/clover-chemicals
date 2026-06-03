import NextLink from "next/link";

import { siteConfig } from "@/config/site";

const companyLinks = [
  { label: "About Us",   href: "/about"   },
  { label: "News",       href: "/news"    },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers",    href: "/careers" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use",   href: "/terms"   },
];

export const Footer = () => {
  return (
    <footer className="bg-background">
      {/* Main grid */}
      <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <NextLink className="mb-5 flex items-center gap-2.5" href="/">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent">
                <svg fill="none" height={18} viewBox="0 0 24 24" width={18}>
                  <path
                    d="M12 2C8 2 4 5 4 9c0 2.5 1.5 4.5 3 6l5 7 5-7c1.5-1.5 3-3.5 3-6 0-4-4-7-8-7z"
                    fill="white"
                  />
                </svg>
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  CLOVER
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/40">
                  Chemical Industries
                </span>
              </div>
            </NextLink>
            <p className="mb-6 text-sm leading-relaxed text-foreground/50" style={{ maxWidth: "32ch" }}>
              Precision chemical formulation for agriculture, medicine, laboratory,
              and industry, since 1987.
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/25">
              Est. 1987
            </p>
          </div>

          {/* Products column */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-foreground/35">
              Products
            </p>
            <ul className="flex flex-col gap-3">
              {siteConfig.products.map((product) => (
                <li key={product.href}>
                  <NextLink
                    className="text-sm text-foreground/55 transition-colors duration-150 hover:text-foreground"
                    href={product.href}
                  >
                    {product.label}
                  </NextLink>
                </li>
              ))}
              <li>
                <NextLink
                  className="text-sm font-semibold text-accent transition-colors duration-150 hover:text-accent/80"
                  href="/products"
                >
                  View all →
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-foreground/35">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <NextLink
                    className="text-sm text-foreground/55 transition-colors duration-150 hover:text-foreground"
                    href={link.href}
                  >
                    {link.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-foreground/35">
              Contact
            </p>
            <address className="flex flex-col gap-3 not-italic">
              <p className="text-sm text-foreground/55">
                123 Industrial Avenue<br />
                Gaborone, Botswana
              </p>
              <a
                className="text-sm text-foreground/55 transition-colors duration-150 hover:text-foreground"
                href="mailto:info@cloverchemical.com"
              >
                info@cloverchemical.com
              </a>
              <a
                className="text-sm text-foreground/55 transition-colors duration-150 hover:text-foreground"
                href="tel:+26700000000"
              >
                +267 000 0000
              </a>
            </address>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-separator">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center lg:px-12">
          <p className="text-xs text-foreground/30">
            © {new Date().getFullYear()} Clover Chemical Industries. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <NextLink
                  className="text-xs text-foreground/30 transition-colors duration-150 hover:text-foreground/60"
                  href={link.href}
                >
                  {link.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};
