"use client";

import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { branchesInDisplayOrder } from "@/config/branches";
import { divisions, getDivision } from "@/config/divisions";
import { siteConfig } from "@/config/site";
import { categoryHref } from "@/sanity/lib/format";
import type { ProductCategory } from "@/sanity/lib/types";

const companyLinks = [
  { label: "About Us",   href: "/about"     },
  { label: "News",       href: "/news"      },
  { label: "Contact Us", href: "/contact"   },
  { label: "Locations",  href: "/locations" },
];

type FooterProps = {
  /** Live Sanity categories — same list app/layout.tsx already fetched for
   *  the navbar, filtered here to whichever division the footer is on. */
  categories: ProductCategory[];
};

export const Footer = ({ categories }: FooterProps) => {
  // Same source as the navbar and DivisionThemeScope: the URL's own route
  // segment, so the footer never disagrees with the page it's attached to.
  const segment = useSelectedLayoutSegment();
  const division = segment ? getDivision(segment) : undefined;

  // On a division page, only that division's categories. On a shared page,
  // every category, since there's no single division to scope to.
  const footerCategories = division
    ? categories.filter((cat) => cat.division === division.sanityDivision)
    : categories;
  const productsHref = division ? `/${division.slug}/products` : "/products";

  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Clover watermark, bled off the right edge */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[8%] w-[55%] opacity-[0.07]"
        style={{
          backgroundImage: "url('/clover-logo.svg')",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      />

      {/* Main grid */}
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 pb-12 pt-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <NextLink className="mb-5 flex items-center gap-2.5" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={siteConfig.name} className="h-9 w-9" src="/clover-logo.svg" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  CLOVER
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                  Industries
                </span>
              </div>
            </NextLink>
            <p className="mb-6 text-sm leading-relaxed text-muted" style={{ maxWidth: "32ch" }}>
              Manufacturer and distributor of chemicals, equipment, and total
              solutions for Botswana industry, since {siteConfig.foundedYear}.
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Est. {siteConfig.foundedYear}
            </p>
          </div>

          {/* Divisions column */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
              Divisions
            </p>
            <ul className="flex flex-col gap-3">
              {divisions.map((d) => (
                <li key={d.slug}>
                  <NextLink
                    className="text-sm text-muted transition-colors duration-150 hover:text-foreground"
                    href={`/${d.slug}`}
                  >
                    {d.name}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Products column */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
              Products
            </p>
            <ul className="flex flex-col gap-3">
              {footerCategories.map((cat) => (
                <li key={cat._id}>
                  <NextLink
                    className="text-sm text-muted transition-colors duration-150 hover:text-foreground"
                    href={categoryHref(cat.slug)}
                  >
                    {cat.label}
                  </NextLink>
                </li>
              ))}
              <li>
                <NextLink
                  className="text-sm font-semibold text-accent transition-colors duration-150 hover:text-accent/80"
                  href={productsHref}
                >
                  View all →
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
              Company
            </p>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <NextLink
                    className="text-sm text-muted transition-colors duration-150 hover:text-foreground"
                    href={link.href}
                  >
                    {link.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches column */}
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
              Branches
            </p>
            <ul className="flex flex-col gap-4">
              {branchesInDisplayOrder.map((branch) => (
                <li key={branch.slug}>
                  <NextLink
                    className="mb-1 block text-sm font-semibold text-foreground transition-colors duration-150 hover:text-accent"
                    href={`/locations#${branch.slug}`}
                  >
                    {branch.name}
                  </NextLink>
                  <p className="text-sm leading-relaxed text-muted">{branch.address}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-separator">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-6 py-5 sm:flex-row sm:items-center lg:px-12">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a
            className="text-xs text-muted transition-colors duration-150 hover:text-foreground"
            href={`mailto:${siteConfig.contact.email}`}
          >
            {siteConfig.contact.email}
          </a>
          {/* Privacy Policy / Terms of Use dropped: neither route exists yet
              (see CI-6). Add them back here once those pages ship. */}
        </div>
      </div>
    </footer>
  );
};
