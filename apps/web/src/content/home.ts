import type { SanityClient } from "@sanity/client";
import { cache } from "react";

import {
  doctorListQuery,
  faqListQuery,
  homePageQuery,
  siteSettingsQuery,
  testimonialListQuery,
  treatmentListQuery,
} from "@dentaliva/sanity-schema/queries";

export interface LocalizedPair {
  tr?: string;
  en?: string;
}

export interface QuickServiceItem {
  name?: LocalizedPair;
  slug?: string;
  summary?: LocalizedPair;
}

export interface DoctorItem {
  name?: string;
  slug?: string;
  title?: LocalizedPair;
  photo?: { ref?: string; alt?: LocalizedPair };
  /** Sanity metadata.lqip — inline base64 blur placeholder (build-time only). */
  lqip?: string;
}

export interface FaqEntry {
  question?: LocalizedPair;
  answer?: LocalizedPair;
}

export interface TestimonialItem {
  author?: string;
  quote?: LocalizedPair;
  rating?: number;
  source?: string;
  youtubeId?: string;
}

export interface GalleryImage {
  asset?: { _ref?: string };
  alt?: LocalizedPair;
  /** Sanity metadata.lqip — inline base64 blur placeholder (build-time only). */
  lqip?: string;
}

interface HomeImage {
  asset?: { _ref?: string };
  alt?: LocalizedPair;
  lqip?: string;
}

export interface HomePageContent {
  hero?: { headline?: LocalizedPair; subline?: LocalizedPair; image?: HomeImage };
  quickServiceLinks?: QuickServiceItem[];
  about?: { title?: LocalizedPair; body?: LocalizedPair; image?: HomeImage };
  stats?: Array<{ value?: string; label?: LocalizedPair }>;
  gallery?: GalleryImage[];
  /** DSN-29: hasta izinli önce/sonra görselleri — dolunca galeri sekmesi açılır. */
  onceSonraGallery?: GalleryImage[];
  /** Copy sweep: ekip bölümünün CMS'ten gelen başlık/copy bloğu. */
  teamSection?: HomeTeamSection;
  cta?: { title?: LocalizedPair; text?: LocalizedPair };
}

export interface SiteSettingsLite {
  phone?: string;
  email?: string;
  hours?: LocalizedPair;
  address?: LocalizedPair;
  whatsapp?: string;
  siteName?: string;
  social?: Array<{ platform?: string; url?: string }>;
}

export interface HomeTeamSection {
  eyebrow?: LocalizedPair;
  heading?: LocalizedPair;
  text?: LocalizedPair;
}

export interface HomeData {
  homePage: HomePageContent | null;
  quickServices: QuickServiceItem[];
  doctors: DoctorItem[];
  faqs: FaqEntry[];
  testimonials: TestimonialItem[];
  siteSettings: SiteSettingsLite | null;
}

async function fetchJson<T>(client: SanityClient, query: string): Promise<T> {
  const result: unknown = await client.fetch(query, {});
  return result as T;
}

/**
 * PRF-5: render-pass başına tek istek — layout, generateMetadata ve sayfa
 * aynı isteği paylaşır (React cache, request scope'unda memoize eder).
 */
export const fetchSiteSettings = cache(
  async (client: SanityClient): Promise<SiteSettingsLite | null> => {
    try {
      const data = await fetchJson<SiteSettingsLite | null>(client, siteSettingsQuery);
      return data ?? null;
    } catch (error) {
      // Build resilience: an unreachable Sanity must not break the export;
      // content lands on the next rebuild after the webhook fires.
      console.warn("[sanity] siteSettings fetch failed:", error);
      return null;
    }
  },
);

export const fetchHomePageDocument = cache(
  async (client: SanityClient): Promise<HomePageContent | null> => {
    const homePage = await fetchJson<HomePageContent | null>(client, homePageQuery);
    return homePage ?? null;
  },
);

export async function fetchHomeData(client: SanityClient): Promise<HomeData> {
  const [homePage, quickServices, doctors, faqs, testimonials, siteSettings] = await Promise.all([
    fetchHomePageDocument(client),
    fetchJson<QuickServiceItem[]>(client, treatmentListQuery),
    fetchJson<DoctorItem[]>(client, doctorListQuery),
    fetchJson<FaqEntry[]>(client, faqListQuery),
    fetchJson<TestimonialItem[]>(client, testimonialListQuery),
    fetchSiteSettings(client),
  ]);
  return {
    homePage: homePage ?? null,
    // DSN-9: authored quickServiceLinks override the full treatment list;
    // unauthored (fresh template) falls back to every treatment.
    quickServices:
      homePage?.quickServiceLinks && homePage.quickServiceLinks.length > 0
        ? homePage.quickServiceLinks
        : (quickServices ?? []),
    doctors: doctors ?? [],
    faqs: faqs ?? [],
    testimonials: testimonials ?? [],
    siteSettings: siteSettings ?? null,
  };
}
