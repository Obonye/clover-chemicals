import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "../env";

import type { SanityImage } from "./types";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlForImage = (source: SanityImageSource) => builder.image(source);

/**
 * Safe URL builder for `next/image` — returns `null` when the image (or its
 * asset) is missing so callers can fall back.
 */
export const imageUrl = (
  source: SanityImage | null | undefined,
  { width, height }: { width: number; height?: number } = { width: 1200 },
): string | null => {
  if (!source?.asset?._ref) {
    return null;
  }

  let b = urlForImage(source).width(width).fit("crop").auto("format");

  if (height) {
    b = b.height(height);
  }

  return b.url();
};
