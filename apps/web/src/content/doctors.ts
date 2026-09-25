import type { SanityClient } from "@sanity/client";

import { doctorBySlugQuery, doctorListQuery } from "@dentaliva/sanity-schema/queries";
import type { DoctorItem, LocalizedPair } from "./home";

export interface DoctorDetail extends DoctorItem {
  bio?: LocalizedPair;
  phone?: string;
  treatments?: Array<{ name?: LocalizedPair; slug?: string }>;
}

async function fetchJson<T>(
  client: SanityClient,
  query: string,
  params?: Record<string, string>,
): Promise<T> {
  const result: unknown = await client.fetch(query, params);
  return result as T;
}

export async function fetchDoctors(client: SanityClient): Promise<DoctorItem[]> {
  const list = await fetchJson<DoctorItem[] | null>(client, doctorListQuery);
  return list ?? [];
}

export async function fetchDoctorBySlug(
  client: SanityClient,
  slug: string,
): Promise<DoctorDetail | null> {
  return fetchJson<DoctorDetail | null>(client, doctorBySlugQuery, { slug });
}
