/**
 * SEO-5: bridges the tested builders in @dentaliva/seo to Next.js Metadata
 * and absolute URLs. Pure mapping — no data fetching — so unit tests cover
 * every branch without a Sanity client.
 */
import type { Metadata } from "next";

import { buildMetadata, type SeoObject } from "@dentaliva/seo";
import { urlForImage } from "@dentaliva/sanity-schema/image-url";

import { site } from "./config";

export const siteUrl = `https://${site.domain}`;

export interface PageSeoInput {
  /** Route path, e.g. "/hizmetlerimiz/implant-tedavisi". */
  path: string;
  /** Human title; also the fallback when the doc has no seo.metaTitle. */
  title: string;
  /** TR fallback description (summary/excerpt/bio) when seo.metaDescription is empty. */
  description?: string;
  seo?: SeoObject | null;
  /** Sanity asset ref for the OG image; omitted → text-card only. */
  ogImageRef?: string;
  ogImageAlt?: string;
  /** Home page: render the title verbatim instead of "%s | Dentaliva". */
  absoluteTitle?: boolean;
}

export function sanityImageUrl(ref: string, width = 1200): string {
  return urlForImage(
    ref,
    { width, quality: 75 },
    {
      projectId: process.env.SANITY_PROJECT_ID ?? site.sanity.projectId,
      dataset: process.env.SANITY_DATASET ?? site.sanity.dataset,
    },
  );
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized === "/" ? "" : normalized}`;
}

export function pageMetadata(input: PageSeoInput): Metadata {
  const built = buildMetadata({
    siteUrl,
    path: input.path,
    fallbackTitle: input.title,
    fallbackDescription: input.description ?? "Dentaliva Diş Kliniği",
    seo: input.seo ?? null,
    ogImageUrl: input.ogImageRef ? sanityImageUrl(input.ogImageRef) : undefined,
    ogImageAlt: input.ogImageAlt,
  });

  return {
    ...(input.absoluteTitle ? { title: { absolute: built.title } } : { title: built.title }),
    description: built.description,
    alternates: { canonical: built.canonical },
    robots: built.robots,
    openGraph: {
      title: built.openGraph.title,
      description: built.openGraph.description,
      url: built.openGraph.url,
      type: "website",
      images: built.openGraph.images.map((image) => ({
        url: image.url,
        // @dentaliva/seo alt'ı her zaman doldurur (fallback: başlık) — koşulsuz.
        alt: image.alt,
      })),
    },
    twitter: {
      card: built.twitter.card,
      title: built.twitter.title,
      description: built.twitter.description,
    },
  };
}
