/**
 * SEO-5: bridges the tested builders in @dentaliva/seo to Next.js Metadata
 * and absolute URLs. Pure mapping — no data fetching — so unit tests cover
 * every branch without a Sanity client.
 */
import type { Metadata } from "next";

import { buildMetadata, type SeoObject } from "@dentaliva/seo";
import { urlForImage } from "@dentaliva/sanity-schema/image-url";

import { allSites, site } from "./config";
import type { SiteConfig } from "./config-types";
import { imageTarget } from "./image-target";

export const siteUrl = `https://${site.domain}`;

/**
 * DSN-101 hreflang: kardeş domain'lerdeki aynı MANTIKSAL sayfanın adresi.
 * Yol eşlemesi rota ANAHTARI üzerinden yapılır (her sites/*.ts kendi
 * yerelleştirilmiş segmentlerini taşır); detay sayfalarında slug setleri
 * siteler arası tutarlı olmadığından alternateKey verilmez → yalnız canonical.
 *
 * İnceleme düzeltmesi: union SiteConfig["routes"] anahtarlarından türetilir —
 * yeni rota segmenti eklenince AlternateRouteKey sessizce bayatlamaz.
 */
export type AlternateRouteKey = "home" | keyof SiteConfig["routes"];

/** x-default daima com'u (TR birincil marka sitesi) gösterir — build'in
 *  EDİLDİĞİ siteye göre değil (eski kod eu/nl build'lerinde kendini
 *  x-default yapıyordu; yorum/karar com diyordu). */
const PRIMARY_SITE_ID = "com";

function alternateLanguages(key: AlternateRouteKey): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const target of allSites()) {
    // Blog listesi nl'de yok (features.blog=false) — hreflang setine giremez.
    if (key === "blog" && !target.features.blog) continue;
    const path = key === "home" ? "/" : target.routes[key];
    languages[target.defaultLocale] = `https://${target.domain}${path}`;
  }
  const primary =
    languages[allSites().find((target) => target.id === PRIMARY_SITE_ID)?.defaultLocale ?? ""];
  if (primary && Object.keys(languages).length > 1) {
    languages["x-default"] = primary;
  }
  return languages;
}

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
  /** DSN-101: verildiğinde kardeş domain hreflang alternates üretilir. */
  alternateKey?: AlternateRouteKey;
}

export function sanityImageUrl(ref: string, width = 1200): string {
  return urlForImage(ref, { width, quality: 75 }, imageTarget());
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

  const languages = input.alternateKey ? alternateLanguages(input.alternateKey) : undefined;

  return {
    ...(input.absoluteTitle ? { title: { absolute: built.title } } : { title: built.title }),
    description: built.description,
    alternates: { canonical: built.canonical, ...(languages ? { languages } : {}) },
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
      // DSN-101: X/Twitter kartı og görselini taşır — eskiden og olsa bile düşerdi.
      ...(built.twitter.images.length > 0
        ? {
            images: built.twitter.images.map((image) => ({
              url: image.url,
              alt: image.alt,
            })),
          }
        : {}),
    },
  };
}
