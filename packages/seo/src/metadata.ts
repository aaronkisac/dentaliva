/**
 * SEO metadata builder (SEO-1): CMS `seo` objects + safe fallbacks →
 * Next.js Metadata-shaped output. Pure functions; no Next import so the
 * package stays testable in isolation (ADR: seo is a 100%-coverage package).
 */

export interface SeoObject {
  metaTitle?: string;
  metaDescription?: string;
  noIndex?: boolean;
  canonicalOverride?: string;
}

export interface SeoBuilderInput {
  siteUrl: string;
  /** Route path, e.g. "/hizmetlerimiz/implant-tedavisi/". */
  path: string;
  fallbackTitle: string;
  fallbackDescription: string;
  seo?: SeoObject | null;
  /** Prebuilt absolute OG image URL (empty when the doc has no image). */
  ogImageUrl?: string;
  ogImageAlt?: string;
}

export interface BuiltMetadata {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    type: "website";
    images: Array<{ url: string; alt?: string }>;
  };
  twitter: {
    card: "summary_large_image" | "summary";
    title: string;
    description: string;
  };
}

/** Joins a base URL and path with exactly one slash. */
export function joinUrl(base: string, path: string): string {
  const trimmedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function buildMetadata(input: SeoBuilderInput): BuiltMetadata {
  const { siteUrl, path, fallbackTitle, fallbackDescription, seo, ogImageUrl, ogImageAlt } = input;

  const title = (seo?.metaTitle ?? "").trim() || fallbackTitle;
  const description = (seo?.metaDescription ?? "").trim() || fallbackDescription;
  const canonical = seo?.canonicalOverride?.trim() || joinUrl(siteUrl, path);
  const noIndex = seo?.noIndex === true;

  const images = ogImageUrl ? [{ url: ogImageUrl, alt: ogImageAlt ?? title }] : [];

  return {
    title,
    description,
    canonical,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images,
    },
    twitter: {
      card: images.length > 0 ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}
