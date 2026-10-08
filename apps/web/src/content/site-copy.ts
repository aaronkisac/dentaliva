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
    faq?: LocalizedPair;
    keyBenefits?: LocalizedPair;
    treatmentProcess?: LocalizedPair;
    treatmentProcessEyebrow?: LocalizedPair;
    doctorProfileLink?: LocalizedPair;
    routeLink?: LocalizedPair;
    callbackForm?: LocalizedPair;
    galleryPage?: LocalizedPair;
    galleryEmpty?: LocalizedPair;
    servicesEyebrow?: LocalizedPair;
    servicesHeading?: LocalizedPair;
    allServicesCta?: LocalizedPair;
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
  } | null;
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
