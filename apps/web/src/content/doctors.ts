import type { SanityClient } from "@sanity/client";
import { cache } from "react";

import type { SeoObject } from "@dentaliva/seo";
import { doctorBySlugQuery, doctorListQuery } from "@dentaliva/sanity-schema/queries";
import type { DoctorItem, LocalizedPair } from "./home";

export interface DoctorDetail extends DoctorItem {
  bio?: LocalizedPair;
  phone?: string;
  treatments?: Array<{ name?: LocalizedPair; slug?: string }>;
  photo?: { ref?: string; alt?: LocalizedPair; lqip?: string };
  seo?: SeoObject | null;
}

async function fetchJson<T>(client: SanityClient, query: string): Promise<T> {
  const result: unknown = await client.fetch(query, {});
  return result as T;
}

export async function fetchDoctors(client: SanityClient): Promise<DoctorItem[]> {
  const list = await fetchJson<DoctorItem[] | null>(client, doctorListQuery);
  return list ?? [];
}

/** PRF-5: generateMetadata + sayfa aynı isteği paylaşır (React cache). */
export const fetchDoctorBySlug = cache(
  async (client: SanityClient, slug: string): Promise<DoctorDetail | null> => {
    const result: unknown = await client.fetch(doctorBySlugQuery, { slug });
    return (result as DoctorDetail | null) ?? null;
  },
);
