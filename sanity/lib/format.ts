import { stegaClean } from "next-sanity";

import type { PackSize } from "./types";

/** Display string for a pack size — the override label, or "value unit". */
export const packLabel = (size: PackSize): string =>
  size.label?.trim() ||
  [size.value, size.unit].filter((part) => part != null && part !== "").join(" ");

/** Front-end path for a category. */
export const categoryHref = (slug: string | null | undefined): string =>
  slug ? `/products/${stegaClean(slug)}` : "/products";
