import type { SanityClient } from "@sanity/client";
import { cache } from "react";

import type { SeoObject } from "@dentaliva/seo";
import { branchBySlugQuery, branchListQuery } from "@dentaliva/sanity-schema/queries";
import type { LocalizedPair } from "./home";

export interface BranchItem {
  name?: string;
  slug?: string;
  address?: LocalizedPair;
  phone?: string;
  hours?: LocalizedPair;
  mapUrl?: string;
  geo?: { lat?: number; lng?: number };
  image?: { ref?: string; alt?: LocalizedPair; lqip?: string };
  /** DSN-72/73: şube foto galerisi — Klinik Fotoğrafları referanslarının
      deref edilmiş hâli (category kütüphane etiketi); boşken image fallback. */
  gallery?: Array<{ ref?: string; alt?: LocalizedPair; lqip?: string; category?: string }>;
  seo?: SeoObject | null;
}

async function fetchJson<T>(client: SanityClient, query: string): Promise<T> {
  const result: unknown = await client.fetch(query, {});
  return result as T;
}

export async function fetchBranches(client: SanityClient): Promise<BranchItem[]> {
  const list = await fetchJson<BranchItem[] | null>(client, branchListQuery);
  return list ?? [];
}

/** PRF-5: tek dokÃ¼man sorgusu + render-pass dedupe â tÃ¼m listeyi Ã§ekmez. */
export const fetchBranchBySlug = cache(
  async (client: SanityClient, slug: string): Promise<BranchItem | null> => {
    const result: unknown = await client.fetch(branchBySlugQuery, { slug });
    return (result as BranchItem | null) ?? null;
  },
);
