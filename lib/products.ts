export type Product = {
  name: string;
  description: string;
  grade: string;
  packSizes: string[];
};

export type Category = {
  id: string;
  label: string;
  href: string;
  image: string;
  description: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    id: "agro",
    label: "Agricultural Chemicals",
    href: "/products/agro",
    image: "/product_categories/agricultural_chemicals.jpg",
    description:
      "Fertilizers, herbicides, fungicides, and crop-protection formulations for commercial agriculture.",
    products: [
      {
        name: "NPK 20-20-20 Water Soluble Fertilizer",
        description:
          "Balanced, fully water-soluble fertilizer for foliar and fertigation application across a wide range of crops.",
        grade: "Technical Grade",
        packSizes: ["1 kg", "5 kg", "25 kg", "50 kg"],
      },
      {
        name: "Glyphosate 360 SL Herbicide",
        description:
          "Broad-spectrum, non-selective systemic herbicide for pre- and post-emergence weed control.",
        grade: "Technical Grade",
        packSizes: ["1 L", "5 L", "20 L", "200 L"],
      },
      {
        name: "Mancozeb 80% WP Fungicide",
        description:
          "Contact fungicide for the prevention and control of a wide spectrum of fungal diseases in cereals and vegetables.",
        grade: "Technical Grade",
        packSizes: ["1 kg", "5 kg", "25 kg"],
      },
      {
        name: "Chlorpyrifos 480 EC Insecticide",
        description:
          "Organophosphate insecticide for the control of soil and foliar insects across a variety of crops.",
        grade: "Technical Grade",
        packSizes: ["1 L", "5 L", "20 L"],
      },
    ],
  },
  {
    id: "medical",
    label: "Medical & Pharma",
    href: "/products/medical",
    image: "/product_categories/medical_and_pharma.jpg",
    description:
      "Pharmaceutical-grade compounds, disinfectants, and sterilants for hospitals, clinics, and healthcare facilities.",
    products: [
      {
        name: "Isopropyl Alcohol 70%",
        description:
          "Pharmaceutical-grade isopropanol solution for surface disinfection and antiseptic use in clinical environments.",
        grade: "BP / USP Grade",
        packSizes: ["500 mL", "1 L", "5 L", "25 L"],
      },
      {
        name: "Hydrogen Peroxide 3%",
        description:
          "Stabilised hydrogen peroxide for wound antisepsis, instrument sterilisation, and general disinfection.",
        grade: "USP Grade",
        packSizes: ["500 mL", "1 L", "5 L"],
      },
      {
        name: "Glutaraldehyde 2% Solution",
        description:
          "Activated glutaraldehyde for high-level disinfection and sterilisation of heat-sensitive medical equipment.",
        grade: "Pharma Grade",
        packSizes: ["1 L", "5 L", "10 L"],
      },
      {
        name: "Sodium Hypochlorite 5%",
        description:
          "Dilute sodium hypochlorite for surface disinfection, instrument decontamination, and water treatment.",
        grade: "Pharma Grade",
        packSizes: ["1 L", "5 L", "25 L"],
      },
    ],
  },
  {
    id: "laboratory",
    label: "Laboratory Chemicals",
    href: "/products/laboratory",
    image: "/product_categories/lab chemicals.jpg",
    description:
      "High-purity solvents, acids, bases, and analytical reagents for research and quality-control laboratories.",
    products: [
      {
        name: "Hydrochloric Acid 37%",
        description:
          "High-purity fuming hydrochloric acid for analytical sample preparation, titration, and pH adjustment.",
        grade: "AR / ACS Grade",
        packSizes: ["500 mL", "2.5 L", "5 L", "25 L"],
      },
      {
        name: "Sodium Hydroxide Pellets",
        description:
          "White hygroscopic pellets for use in titrations, saponification reactions, and general analytical work.",
        grade: "ACS Grade",
        packSizes: ["500 g", "1 kg", "5 kg", "25 kg"],
      },
      {
        name: "Acetonitrile HPLC Grade",
        description:
          "Low-UV-absorbance acetonitrile for use as mobile phase in high-performance liquid chromatography.",
        grade: "HPLC Grade",
        packSizes: ["1 L", "2.5 L", "4 L"],
      },
      {
        name: "Methanol Analytical Reagent",
        description:
          "High-purity methanol for spectrophotometry, HPLC, and general analytical laboratory applications.",
        grade: "AR Grade",
        packSizes: ["1 L", "2.5 L", "5 L", "25 L"],
      },
    ],
  },
  {
    id: "industrial",
    label: "Industrial Solutions",
    href: "/products/industrial",
    image: "/product_categories/industrial_cleaning.jpg",
    description:
      "Process chemicals, cleaning agents, and treatment chemicals for manufacturing, mining, and heavy industry.",
    products: [
      {
        name: "Heavy Duty Degreaser HD-50",
        description:
          "Concentrated alkaline degreaser for the removal of oils, greases, and carbon deposits from plant and equipment.",
        grade: "Technical Grade",
        packSizes: ["5 L", "20 L", "200 L", "1000 L"],
      },
      {
        name: "Caustic Soda Flakes",
        description:
          "Technical-grade sodium hydroxide for soap manufacture, water treatment, textile processing, and chemical synthesis.",
        grade: "Technical Grade",
        packSizes: ["25 kg", "50 kg"],
      },
      {
        name: "Sodium Hypochlorite 12%",
        description:
          "Industrial-strength hypochlorite for large-scale disinfection of water systems, cooling towers, and plant surfaces.",
        grade: "Technical Grade",
        packSizes: ["20 L", "200 L", "1000 L"],
      },
      {
        name: "Phosphoric Acid 85%",
        description:
          "Industrial phosphoric acid for metal treatment, rust removal, detergent formulation, and water treatment.",
        grade: "Technical Grade",
        packSizes: ["5 L", "25 L", "200 L"],
      },
    ],
  },
];

export const getCategoryById = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);
