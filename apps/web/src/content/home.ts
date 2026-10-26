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

import { fetchSiteCopy, type SiteCopy } from "./site-copy";
import { fetchBranches, type BranchItem } from "./branches";

export interface LocalizedPair {
  tr?: string;
  en?: string;
  nl?: string;
}

export interface QuickServiceItem {
  name?: LocalizedPair;
  slug?: string;
  summary?: LocalizedPair;
  heroImage?: {
    ref?: string;
    lqip?: string;
    alt?: LocalizedPair;
  };
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
  /** DSN-61: hero altı kompakt güven bandı — veri yoksa bölüm render edilmez. */
  trustStrip?: TrustStripData;
  /** DSN-62: ihtiyaç bazlı self-segmentation kartları — boşken bölüm render edilmez. */
  treatmentPaths?: TreatmentPathItem[];
  /** DSN-63: ön değerlendirme formu bölümü — alan unset ise bölüm render edilmez. */
  reviewForm?: { steps?: LocalizedPair[] };
  /** DSN-64: süreç adımları — boşken bölüm render edilmez. */
  howItWorks?: { steps?: HowItWorksStep[] };
  /** DSN-65: karar modülleri — GROQ hidden filtresi uygulanmış halde gelir. */
  decisionModules?: DecisionModule[];
  /** DSN-66: seyahat planlama check-listi — boşken bölüm render edilmez. */
  travelStay?: { checklist?: LocalizedPair[] };
  /** DSN-66: aftercare belirtileri + iletişim notu — boşken render edilmez. */
  aftercare?: {
    normal?: LocalizedPair[];
    urgent?: LocalizedPair[];
    contactNote?: LocalizedPair;
  };
  about?: {
    title?: LocalizedPair;
    body?: LocalizedPair;
    /** DSN-52: numaralı fayda listesi — boşsa liste gizlenir. */
    benefits?: LocalizedPair[];
    image?: HomeImage;
  };
  stats?: Array<{ value?: string; label?: LocalizedPair }>;
  gallery?: GalleryImage[];
  /** DSN-29: hasta izinli önce/sonra görselleri — dolunca galeri sekmesi açılır. */
  onceSonraGallery?: GalleryImage[];
  /** DSN-50: anasayfa önce/sonra karşılaştırma kartları — boşken bölüm render edilmez. */
  onceSonraCases?: BeforeAfterCase[];
  /** Copy sweep: ekip bölümünün CMS'ten gelen başlık/copy bloğu. */
  teamSection?: HomeTeamSection;
  cta?: { title?: LocalizedPair; text?: LocalizedPair; trustLine?: LocalizedPair };
  /**
   * DSN-56: içerik bazlı gizle/göster — site config sırasından düşülecek
   * bölüm id'leri (HomeSectionId). Alan unset/null olduğunda hiçbir bölüm
   * gizlenmez.
   */
  hiddenSections?: string[];
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

/** DSN-61: güven şeridi hücreleri — puan rozeti + en fazla 3 gösterge. */
export interface TrustStripData {
  rating?: LocalizedPair;
  ratingLabel?: LocalizedPair;
  items?: Array<{ value?: string; label?: LocalizedPair }>;
}

/** DSN-62: tedavi yolu kartı — ihtiyaç cümlesi + teknik terim + tedavi linki. */
export interface TreatmentPathItem {
  headline?: LocalizedPair;
  subline?: LocalizedPair;
  image?: { ref?: string; alt?: LocalizedPair; lqip?: string };
  treatment?: { name?: LocalizedPair; slug?: string } | null;
}

/** DSN-64: süreç adımı — başlık zorunlu, kısa açıklama opsiyonel. */
export interface HowItWorksStep {
  title?: LocalizedPair;
  text?: LocalizedPair;
}

/** DSN-65: karar modülü — seçenek kartları + medya + CTA tedavisi. */
export interface DecisionModule {
  eyebrow?: LocalizedPair;
  heading?: LocalizedPair;
  body?: LocalizedPair;
  image?: { ref?: string; alt?: LocalizedPair; lqip?: string };
  youtubeId?: string;
  options?: Array<{
    title?: LocalizedPair;
    text?: LocalizedPair;
    treatment?: { name?: LocalizedPair; slug?: string } | null;
  }>;
  ctaTreatment?: { name?: LocalizedPair; slug?: string } | null;
}

/** DSN-50: önce/sonra karşılaştırma kartı — slider için görsel çifti. */
export interface BeforeAfterImage {
  ref?: string;
  alt?: LocalizedPair;
  lqip?: string;
}

export interface BeforeAfterCase {
  before?: BeforeAfterImage;
  after?: BeforeAfterImage;
  title?: LocalizedPair;
  text?: LocalizedPair;
  treatment?: { name?: LocalizedPair; slug?: string };
}

export interface HomeData {
  homePage: HomePageContent | null;
  quickServices: QuickServiceItem[];
  doctors: DoctorItem[];
  faqs: FaqEntry[];
  testimonials: TestimonialItem[];
  siteSettings: SiteSettingsLite | null;
  /** DSN-44: arayüz metinleri singleton'u — bölümler copy'sizse render etmez. */
  siteCopy: SiteCopy | null;
  /** DSN-67: üç klinik bölümü — şube dokümanları (boşsa bölüm render edilmez). */
  branches: BranchItem[];
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
  const [homePage, quickServices, doctors, faqs, testimonials, siteSettings, siteCopy, branches] =
    await Promise.all([
      fetchHomePageDocument(client),
      fetchJson<QuickServiceItem[]>(client, treatmentListQuery),
      fetchJson<DoctorItem[]>(client, doctorListQuery),
      fetchJson<FaqEntry[]>(client, faqListQuery),
      fetchJson<TestimonialItem[]>(client, testimonialListQuery),
      fetchSiteSettings(client),
      fetchSiteCopy(client),
      fetchBranches(client),
    ]);
  // DSN-9: authored quickServiceLinks override the full treatment list;
  // unauthored (fresh template) falls back to every treatment. GROQ returns
  // null (not undefined) for the unset field, hence the ?? [].
  // DSN-51: the carousel shows EVERY service — the old 6-card cap
  // (servicesGrid) died with the grid era.
  const curatedLinks = homePage?.quickServiceLinks ?? [];
  const allServices = curatedLinks.length > 0 ? curatedLinks : (quickServices ?? []);
  return {
    homePage: homePage ?? null,
    quickServices: allServices,
    doctors: doctors ?? [],
    faqs: faqs ?? [],
    testimonials: testimonials ?? [],
    siteSettings: siteSettings ?? null,
    siteCopy: siteCopy ?? null,
    branches: branches ?? [],
  };
}
