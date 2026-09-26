import { urlForImage } from "@dentaliva/sanity-schema/image-url";

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
  return urlForImage(
    src,
    { width, quality: quality ?? 75 },
    {
      projectId: process.env.SANITY_PROJECT_ID ?? "86x2hbzv",
      dataset: process.env.SANITY_DATASET ?? "production",
    },
  );
}
