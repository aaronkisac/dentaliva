import type { SanityClient } from "@sanity/client";

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
  doctors?: Array<{ name?: string; slug?: string; title?: LocalizedPair }>;
}

async function fetchJson<T>(
  client: SanityClient,
  query: string,
  params?: Record<string, string>,
): Promise<T> {
  const result: unknown = await client.fetch(query, params);
  return result as T;
}

export async function fetchTreatments(client: SanityClient): Promise<TreatmentListItem[]> {
  const list = await fetchJson<TreatmentListItem[] | null>(client, treatmentListQuery);
  return list ?? [];
}

export async function fetchTreatmentBySlug(
  client: SanityClient,
  slug: string,
): Promise<TreatmentDetail | null> {
  return fetchJson<TreatmentDetail | null>(client, treatmentBySlugQuery, { slug });
}
