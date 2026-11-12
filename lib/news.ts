export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
};

export const articles: Article[] = [
  {
    slug: "clover-chemical-expands-into-zambia",
    category: "Company News",
    title: "Clover Chemical Expands Operations into Zambia",
    excerpt:
      "Following sustained growth across our Medical & Laboratory division, Clover Chemical Industries has formalised its investment in Zambia, extending our precision chemical supply network to a second southern African market.",
    date: "12 May 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1717386255773-1e3037c81788?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "shimadzu-analytical-instruments-available",
    category: "Products",
    title: "New Shimadzu Analytical Instruments Now Available",
    excerpt:
      "As authorised agents for Shimadzu, we are pleased to offer the latest range of UV-Vis spectrophotometers, HPLC systems, and gas chromatographs to laboratories across Botswana.",
    date: "3 Apr 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "agricultural-chemical-demand-southern-africa",
    category: "Industry",
    title: "Agricultural Chemical Demand Grows Across Southern Africa",
    excerpt:
      "Rising food security concerns and expanding commercial farming operations are driving significant growth in demand for crop-protection formulations and fertilizers across the SADC region.",
    date: "18 Mar 2025",
    readTime: "5 min read",
    image:
      "https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "philips-medical-serviced-locally",
    category: "Products",
    title: "Philips Medical Equipment Now Fully Serviced Locally",
    excerpt:
      "Clover Chemical Industries has expanded its service capability for Philips Medical imaging and diagnostic equipment, reducing downtime for hospitals and clinics across Botswana.",
    date: "5 Feb 2025",
    readTime: "3 min read",
    image:
      "https://plus.unsplash.com/premium_photo-1661767897334-bbfbdfdc4d1a?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "edd-certification-renewed-2025",
    category: "Company News",
    title: "EDD Certification Renewed for 2025",
    excerpt:
      "Clover Chemical Industries has successfully renewed its Economic Diversification Drive certification, reinforcing our compliance for government and institutional procurement contracts.",
    date: "20 Jan 2025",
    readTime: "2 min read",
    image:
      "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "thermo-fisher-partnership-laboratory-division",
    category: "Partnerships",
    title: "Thermo Fisher Partnership Strengthens Laboratory Division",
    excerpt:
      "Our ongoing partnership with Thermo Fisher Scientific brings the latest in laboratory consumables, reagents, and instrumentation to research facilities and quality-control labs across the region.",
    date: "8 Jan 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&w=800&q=80",
  },
];
