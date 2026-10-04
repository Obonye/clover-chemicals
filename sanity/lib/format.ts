import { stegaClean } from "next-sanity";

import type { PackSize, ProductDocument, ProductDocumentType } from "./types";

/** Display string for a pack size — the override label, or "value unit". */
export const packLabel = (size: PackSize): string =>
  size.label?.trim() ||
  [size.value, size.unit].filter((part) => part != null && part !== "").join(" ");

const DOCUMENT_LABELS: Record<ProductDocumentType, string> = {
  "spec-sheet": "Spec sheet",
  sds: "Safety Data Sheet (SDS)",
  label: "Label",
  certificate: "Certificate",
  registration: "Registration",
};

/** A document's type with any Visual Editing (stega) markers removed, so it
 *  can be compared and looked up. */
export const documentType = (doc: Pick<ProductDocument, "type">): ProductDocumentType | null =>
  doc.type ? (stegaClean(doc.type) as ProductDocumentType) : null;

/** Display name for a product document: the editor's override, else its type. */
export const documentLabel = (doc: Pick<ProductDocument, "title" | "type">): string => {
  const type = documentType(doc);

  return doc.title?.trim() || (type ? DOCUMENT_LABELS[type] : null) || "Document";
};

/** Sanity CDN URL that downloads with the original filename (`?dl=`; an
 *  empty value also keeps the uploaded name). */
export const documentDownloadHref = (doc: Pick<ProductDocument, "url" | "filename">): string =>
  `${stegaClean(doc.url)}?dl=${encodeURIComponent(stegaClean(doc.filename) ?? "")}`;

/** "1.2 MB", "340 KB". */
export const formatFileSize = (bytes: number | null | undefined): string | null => {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/** Front-end path for a category — the unified /products page, pre-filtered. */
export const categoryHref = (slug: string | null | undefined): string =>
  slug ? `/products?category=${stegaClean(slug)}` : "/products";

/** Front-end path for a single product's detail page. Falls back to the
 *  category (or /products) if either slug is missing, so a card never
 *  links somewhere broken while content is still being filled in. */
export const productHref = (
  categorySlug: string | null | undefined,
  productSlug: string | null | undefined,
): string =>
  categorySlug && productSlug
    ? `/products/${stegaClean(categorySlug)}/${stegaClean(productSlug)}`
    : categoryHref(categorySlug);
