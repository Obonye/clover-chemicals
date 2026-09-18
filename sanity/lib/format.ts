import { stegaClean } from "next-sanity";

import type { PackSize } from "./types";

/** Display string for a pack size — the override label, or "value unit". */
export const packLabel = (size: PackSize): string =>
  size.label?.trim() ||
  [size.value, size.unit].filter((part) => part != null && part !== "").join(" ");

/** Front-end path for a category — the unified /products page, pre-filtered. */
export const categoryHref = (slug: string | null | undefined): string =>
  slug ? `/products?category=${stegaClean(slug)}` : "/products";
