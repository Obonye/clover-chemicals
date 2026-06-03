export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Clover Chemical Industries",
  description:
    "37 years of chemical precision — industrial, agricultural, medical, and laboratory solutions.",
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
      label: "Laboratory Chemicals",
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
  ],
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
    { label: "About Us", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Contact Us", href: "/contact" },
  ],
};
