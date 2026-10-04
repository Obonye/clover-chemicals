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

export type ProductDocumentType = "spec-sheet" | "sds" | "label" | "certificate" | "registration";

/** A PDF attached to a product (CI-27). Only entries with an uploaded file
 *  are returned, so `url` is always set. */
export type ProductDocument = {
  _key: string;
  type: ProductDocumentType | null;
  title: string | null;
  language: string | null;
  /** ISO date, e.g. "2026-03-01". */
  revisionDate: string | null;
  url: string;
  size: number | null;
  filename: string | null;
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
  documents: ProductDocument[] | null;
  isFeatured: boolean;
  isOnPromotion: boolean;
};

export type ProductWithCategory = Product & {
  category: ProductCategory | null;
};

/** PRODUCT_QUERY's shape — a single product for the detail page. */
export type ProductDetail = ProductWithCategory;

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

/** PRODUCTS_BY_IDS_QUERY's shape — just what an RFQ line needs re-checking. */
export type RfqProductSnapshot = Pick<
  Product,
  "_id" | "name" | "slug" | "grade" | "packSizes" | "image" | "available"
> & {
  category: Pick<ProductCategory, "slug" | "division" | "image"> | null;
};
