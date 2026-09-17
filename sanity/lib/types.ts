/**
 * Hand-written result types for the queries in `queries.ts`.
 *
 * These mirror the GROQ projections closely enough for day-to-day work. Once
 * you run `npx sanity typegen generate` (see README / studio docs), you can
 * import the generated `*_QUERYResult` types from `@/sanity/types` instead and
 * delete this file.
 */

export type SanityImage = {
  _type: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string | null;
};

export type Division = "chemicals" | "medical";

export type PackSize = {
  _key: string;
  value: number | null;
  unit: string | null;
  label?: string | null;
};

export type ProductCategory = {
  _id: string;
  label: string | null;
  slug: string | null;
  division: Division | null;
  description: string | null;
  image: SanityImage | null;
  productCount?: number;
};

export type Product = {
  _id: string;
  name: string | null;
  slug: string | null;
  description: string | null;
  grade: string | null;
  packSizes: PackSize[] | null;
  image: SanityImage | null;
  tag: string | null;
  available: boolean | null;
  isFeatured: boolean;
  isOnPromotion: boolean;
};

export type ProductWithCategory = Product & {
  category: ProductCategory | null;
};

export type CategoryWithProducts = ProductCategory & {
  products: Product[];
};

export type Promotion = {
  _id: string;
  headline: string | null;
  description: string | null;
  image: SanityImage | null;
  endDate: string | null;
};
