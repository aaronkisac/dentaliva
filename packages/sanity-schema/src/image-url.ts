/** Builds responsive Sanity CDN image URLs from asset references (ADR-006). */

export function refToBase(ref: string): string {
  // "image-abc123-1900x1200-jpg" → "abc123-1900x1200.jpg"
  const match = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!match) throw new Error(`Invalid Sanity image reference: ${ref}`);
  const [, id, dimensions, ext] = match;
  return `${id}-${dimensions}.${ext}`;
}

export interface UrlForImageOptions {
  width?: number;
  quality?: number;
  /** Fit mode; crop honors hotspot metadata stored on the asset. */
  fit?: "crop" | "fill" | "clip";
}

export function urlForImage(
  ref: string,
  options: UrlForImageOptions = {},
  env: { projectId: string; dataset: string },
): string {
  const base = refToBase(ref);
  const params = new URLSearchParams({
    auto: "format",
    fit: options.fit ?? "crop",
    ...(options.width ? { w: String(options.width) } : {}),
    ...(options.quality ? { q: String(options.quality) } : {}),
  });
  return `https://cdn.sanity.io/images/${env.projectId}/${env.dataset}/${base}?${params.toString()}`;
}

/** Intrinsic dimensions encoded in the asset reference; null when malformed. */
export interface RefDimensions {
  width: number;
  height: number;
}

export function refDimensions(ref: string): RefDimensions | null {
  const match = /^image-[a-f0-9]+-(\d+)x(\d+)-\w+$/.exec(ref);
  if (!match) return null;
  return { width: Number(match[1]), height: Number(match[2]) };
}

/**
 * Tiny placeholder (32px, q30) fed to next/image `blurDataURL` (PRF-1):
 * served from the same CDN as the full image, a few hundred bytes.
 */
export function lqipUrl(ref: string, env: { projectId: string; dataset: string }): string {
  return urlForImage(ref, { width: 32, quality: 30 }, env);
}
