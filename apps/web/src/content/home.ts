import type { SanityClient } from "@sanity/client";

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
}

export interface HomePageContent {
  hero?: { headline?: LocalizedPair; subline?: LocalizedPair };
  quickServiceLinks?: QuickServiceItem[];
  about?: { title?: LocalizedPair; body?: LocalizedPair };
  stats?: Array<{ value?: string; label?: LocalizedPair }>;
  gallery?: GalleryImage[];
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

export async function fetchHomeData(client: SanityClient): Promise<HomeData> {
  const [homePage, quickServices, doctors, faqs, testimonials, siteSettings] = await Promise.all([
    fetchJson<HomePageContent | null>(client, homePageQuery),
    fetchJson<QuickServiceItem[]>(client, treatmentListQuery),
    fetchJson<DoctorItem[]>(client, doctorListQuery),
    fetchJson<FaqEntry[]>(client, faqListQuery),
    fetchJson<TestimonialItem[]>(client, testimonialListQuery),
    fetchJson<SiteSettingsLite | null>(client, siteSettingsQuery),
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
