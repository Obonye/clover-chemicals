/**
 * schema.org JSON-LD builders. Everything is derived from config (divisions,
 * branches, siteConfig) so adding a division or branch updates the markup
 * with no changes here.
 */
import type { BranchConfig } from "@/config/branches";
import type { DivisionConfig } from "@/config/divisions";

import { branchesInDisplayOrder, mapUrl } from "@/config/branches";
import { divisions } from "@/config/divisions";
import { siteConfig, SITE_URL } from "@/config/site";

type JsonLd = Record<string, unknown>;

const absolute = (path: string) => new URL(path, SITE_URL).toString();

/** Stable `@id` for the group Organization, so other nodes (branches) can
 *  point at it as their parent. */
export const ORGANIZATION_ID = absolute("/#organization");

const LOGO = absolute("/clover-logo.svg");

/**
 * Splits a config address ("Plot 1277, Old Lobatse Road, Gaborone, Botswana")
 * into a PostalAddress: the last part is the country, the one before it the
 * town, the rest the street.
 */
export function postalAddress(address: string): JsonLd {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  const country = parts.pop();
  const locality = parts.pop();

  return {
    "@type": "PostalAddress",
    streetAddress: parts.join(", ") || undefined,
    addressLocality: locality,
    addressCountry: country === "Botswana" ? "BW" : country,
  };
}

function divisionOrganization(division: DivisionConfig): JsonLd {
  return {
    "@type": "Organization",
    "@id": absolute(`/${division.slug}#organization`),
    name: division.name,
    description: division.tagline,
    url: absolute(`/${division.slug}`),
    logo: LOGO,
    parentOrganization: { "@id": ORGANIZATION_ID },
    contactPoint: division.contacts.map((contact) => ({
      "@type": "ContactPoint",
      contactType: contact.label,
      email: contact.email,
      areaServed: "BW",
    })),
  };
}

export function organizationJsonLd(
  divisionList: DivisionConfig[] = divisions,
  branchList: BranchConfig[] = branchesInDisplayOrder,
): JsonLd {
  const headOffice = branchList.find((branch) => branch.isHeadOffice) ?? branchList[0];
  const { contact, sameAs } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    description: siteConfig.description,
    url: absolute("/"),
    logo: LOGO,
    foundingDate: String(siteConfig.foundedYear),
    ...(headOffice ? { address: postalAddress(headOffice.address) } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: contact.phone,
      email: contact.email,
      areaServed: "BW",
      availableLanguage: "English",
    },
    subOrganization: divisionList.map(divisionOrganization),
  };
}

/**
 * One WholesaleStore (a LocalBusiness subtype) per branch, for /locations.
 * Phone, email and hours are company-wide until the branches publish their
 * own (see config/branches.ts). `geo` is left out until the client confirms
 * coordinates; `hasMap` links to the same map search the page uses.
 */
export function branchesJsonLd(branchList: BranchConfig[] = branchesInDisplayOrder): JsonLd {
  const { contact } = siteConfig;

  return {
    "@context": "https://schema.org",
    "@graph": branchList.map((branch) => ({
      "@type": "WholesaleStore",
      "@id": absolute(`/locations#${branch.slug}`),
      name: `${siteConfig.name} – ${branch.name}`,
      url: absolute(`/locations#${branch.slug}`),
      image: LOGO,
      address: postalAddress(branch.address),
      hasMap: mapUrl(branch.address),
      telephone: contact.phone,
      email: contact.email,
      openingHoursSpecification: contact.openingHours.map((hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days,
        opens: hours.opens,
        closes: hours.closes,
      })),
      parentOrganization: { "@id": ORGANIZATION_ID },
    })),
  };
}

/** Serialises for a <script type="application/ld+json">. Escapes `<` so a
 *  value containing "</script>" can't break out of the tag. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
