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

/** PRF-5: tek doküman sorgusu + render-pass dedupe — tüm listeyi çekmez. */
export const fetchBranchBySlug = cache(
  async (client: SanityClient, slug: string): Promise<BranchItem | null> => {
    const result: unknown = await client.fetch(branchBySlugQuery, { slug });
    return (result as BranchItem | null) ?? null;
  },
);
