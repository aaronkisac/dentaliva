import { cache } from "react";
import type { SanityClient } from "@sanity/client";

import { siteCopyQuery } from "@dentaliva/sanity-schema/queries";

import type { LocalizedPair } from "./home";

/** DSN-44: siteCopy singleton — tüm arayüz metinleri (sıfır-hardcoded-copy). */
export interface SiteCopy {
  footer?: {
    contactHeading?: LocalizedPair;
    quickLinksHeading?: LocalizedPair;
    followHeading?: LocalizedPair;
  } | null;
  sectionHeadings?: {
    relatedDoctors?: LocalizedPair;
    reviews?: LocalizedPair;
    videoReviews?: LocalizedPair;
    faq?: LocalizedPair;
    keyBenefits?: LocalizedPair;
    treatmentProcess?: LocalizedPair;
    treatmentProcessEyebrow?: LocalizedPair;
    doctorProfileLink?: LocalizedPair;
    routeLink?: LocalizedPair;
    callbackForm?: LocalizedPair;
    galleryPage?: LocalizedPair;
    galleryHome?: LocalizedPair;
    galleryEmpty?: LocalizedPair;
    servicesEyebrow?: LocalizedPair;
    servicesHeading?: LocalizedPair;
    allServicesCta?: LocalizedPair;
    treatmentPathsEyebrow?: LocalizedPair;
    treatmentPathsHeading?: LocalizedPair;
    reviewFormEyebrow?: LocalizedPair;
    reviewFormHeading?: LocalizedPair;
    howItWorksEyebrow?: LocalizedPair;
    howItWorksHeading?: LocalizedPair;
    finalCtaEyebrow?: LocalizedPair;
    travelEyebrow?: LocalizedPair;
    travelHeading?: LocalizedPair;
    aftercareEyebrow?: LocalizedPair;
    aftercareHeading?: LocalizedPair;
    aftercareNormalTitle?: LocalizedPair;
    aftercareUrgentTitle?: LocalizedPair;
    clinicsEyebrow?: LocalizedPair;
    clinicsHeading?: LocalizedPair;
    clinicsIntro?: LocalizedPair;
    resultsVaryNote?: LocalizedPair;
    onceSonraEyebrow?: LocalizedPair;
    onceSonraHeading?: LocalizedPair;
  } | null;
  /** DSN-47: ana sayfa SSS bölümü — eyebrow, destek metni ve CTA. */
  faq?: {
    eyebrow?: LocalizedPair;
    support?: LocalizedPair;
    ctaLabel?: LocalizedPair;
    /** Dahili yol (/iletisim) veya tam URL. */
    ctaHref?: string;
  } | null;
  heroTrust?: {
    since?: LocalizedPair;
    experience?: LocalizedPair;
    googleRating?: LocalizedPair;
  } | null;
  ui?: {
    lightboxClose?: LocalizedPair;
    notFoundTitle?: LocalizedPair;
    notFoundBody?: LocalizedPair;
    notFoundBackLink?: LocalizedPair;
    onceSonraBefore?: LocalizedPair;
    onceSonraAfter?: LocalizedPair;
    /** Header mega menüsünün "tümünü gör" bağlantısı. */
    menuAllLink?: LocalizedPair;
  } | null;
  /** Header Tedaviler menüsünün grupları — sırayla mega panel sütunlarına düşer. */
  navMenu?: Array<{
    heading?: LocalizedPair;
    headingPage?: { name?: LocalizedPair; slug?: string } | null;
    treatments?: Array<{ name?: LocalizedPair; slug?: string } | null>;
  }> | null;
}

/**
 * PRF-5: cache'li tekil fetcher — request scope'unda dedupe edilir. Sanity
 * erişilemezse null döner (build resilience); copy'siz kalan bölümler
 * render edilmez ("boş bölüm canlıya çıkmaz" ilkesi).
 */
export const fetchSiteCopy = cache(async (client: SanityClient): Promise<SiteCopy | null> => {
  try {
    const result: unknown = await client.fetch(siteCopyQuery, {});
    return (result as SiteCopy | null) ?? null;
  } catch (error) {
    console.warn("[sanity] siteCopy fetch failed:", error);
    return null;
  }
});
