export type SiteConfig = typeof siteConfig;

// Falls back to the production domain implied by the contact emails
// (sales@cloverindustries.co.bw etc.) — override with the real value once
// the client confirms it. Backs metadataBase (app/layout.tsx), the
// sitemap, and robots.txt.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloverindustries.co.bw";

export const siteConfig = {
  name: "Clover Industries",
  foundedYear: 1980,
  description:
    "Botswana's one-stop chemical and equipment partner — manufacturing and distribution for industry, agriculture, healthcare, and the laboratory, since 1980.",
  // Company-wide — not specific to either branch. (Neither branch has its
  // own published number/hours yet; see config/branches.ts and CI-11.)
  contact: {
    phone: "+267 395 3035",
    email: "sales@cloverindustries.co.bw",
    whatsapp: "+267 77 816 000",
    hours: "Monday – Friday, 8:00 – 17:00 CAT",
  },
  navItems: [
    { label: "About Us", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Contact Us", href: "/contact" },
  ],
  navMenuItems: [
    { label: "Products", href: "/products" },
    { label: "Agricultural Chemicals", href: "/products/agro" },
    { label: "Medical & Pharma", href: "/products/medical" },
    { label: "Laboratory Chemicals", href: "/products/laboratory" },
    { label: "Industrial Solutions", href: "/products/industrial" },
    { label: "Personal Protective Equipment", href: "/products/PPE" },
    { label: "Pool Chemicals", href: "/products/pool" },
  ],
  footerItems: [
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Contact Us", href: "/contact" },
  ],
};
