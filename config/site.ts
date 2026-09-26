export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Clover Industries",
  foundedYear: 1980,
  description:
    "Botswana's one-stop chemical and equipment partner — manufacturing and distribution for industry, agriculture, healthcare, and the laboratory, since 1980.",
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
