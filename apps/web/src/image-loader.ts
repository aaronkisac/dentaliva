import { urlForImage } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "./image-target";

/**
 * next/image custom loader (ADR-006): builds responsive Sanity CDN URLs.
 * `src` is the raw asset reference (e.g. "image-abc-1900x1200-jpg").
 */
export default function sanityLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return urlForImage(src, { width, quality: quality ?? 75 }, imageTarget());
}
