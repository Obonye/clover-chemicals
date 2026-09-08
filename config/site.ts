export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Clover Chemical Industries",
  foundedYear: 1980,
  description:
    "Botswana's one-stop chemical and equipment partner — manufacturing and distribution for industry, agriculture, healthcare, and the laboratory, since 1980.",
  products: [
    {
      label: "Agricultural Chemicals",
      href: "/products/agro",
      description: "Fertilizers, pesticides, and crop-protection formulations.",
      image: "/product_categories/agricultural_chemicals.jpg",
    },
    {
      label: "Medical & Pharma",
      href: "/products/medical",
      description: "Pharmaceutical-grade compounds and reagents.",
      image: "/product_categories/medical_and_pharma.jpg",
    },
    {
      label: "Laboratory & Scientific",
      href: "/products/laboratory",
      description: "High-purity solvents, standards, and analytical reagents.",
      image: "/product_categories/lab chemicals.jpg",
    },
    {
      label: "Industrial Solutions",
      href: "/products/industrial",
      description: "Process chemicals for manufacturing and heavy industry.",
      image: "/product_categories/industrial_cleaning.jpg",
    },
    {
      label: "Personal Protective Equipment",
      href: "/products/PPE",
      description: "Boots, gloves, masks, and protective clothing for construction, medical, and industrial safety.",
      image: "/product_categories/PPE.jpg",
    },
    {
      label: "Pool Chemicals",
      href: "/products/pool",
      description: "Chlorine, test kits, pool acid, and chemicals for domestic and commercial pools.",
      image: "/product_categories/pool.jpg",
    },
  ],
  divisions: [
    {
      id: "chemicals",
      name: "Clover Chemicals",
      tagline: "Chemicals, equipment & PPE for industry, agriculture, and the lab.",
      href: "/products",
      image: "/clover large.jpg",
    },
    {
      id: "medical",
      name: "Clover Medical",
      tagline: "Advanced medical, life sciences, and laboratory solutions for Botswana's healthcare sector.",
      href: "/medical",
      image: "/clover medical (2).jpg",
    },
  ],
  navItems: [
    { label: "Clover Medical", href: "/medical" },
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
    { label: "Clover Medical", href: "/medical" },
  ],
  footerItems: [
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Contact Us", href: "/contact" },
  ],
};
