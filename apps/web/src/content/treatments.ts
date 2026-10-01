import type { SanityClient } from "@sanity/client";
import { cache } from "react";

import type { SeoObject } from "@dentaliva/seo";
import { treatmentBySlugQuery, treatmentListQuery } from "@dentaliva/sanity-schema/queries";
import type { LocalizedPair } from "./home";

export interface TreatmentListItem {
  name?: LocalizedPair;
  slug?: string;
  summary?: LocalizedPair;
  heroImage?: {
    ref?: string;
    lqip?: string;
    alt?: LocalizedPair;
  };
}

export interface TreatmentStep {
  title?: LocalizedPair;
  description?: LocalizedPair;
}

export interface TreatmentDetail extends TreatmentListItem {
  body?: LocalizedPair;
  benefits?: LocalizedPair[];
  steps?: TreatmentStep[];
  priceNote?: LocalizedPair;
  faqs?: Array<{ question?: LocalizedPair; answer?: LocalizedPair }>;
  doctors?: Array<{
    name?: string;
    slug?: string;
    title?: LocalizedPair;
    photo?: { ref?: string; alt?: LocalizedPair };
  }>;
  seo?: SeoObject | null;
}

async function fetchJson<T>(client: SanityClient, query: string): Promise<T> {
  const result: unknown = await client.fetch(query, {});
  return result as T;
}

export async function fetchTreatments(client: SanityClient): Promise<TreatmentListItem[]> {
  const list = await fetchJson<TreatmentListItem[] | null>(client, treatmentListQuery);
  return list ?? [];
}

/** PRF-5: generateMetadata + sayfa aynı isteği paylaşır (React cache). */
export const fetchTreatmentBySlug = cache(
  async (client: SanityClient, slug: string): Promise<TreatmentDetail | null> => {
    const result: unknown = await client.fetch(treatmentBySlugQuery, { slug });
    return (result as TreatmentDetail | null) ?? null;
  },
);
