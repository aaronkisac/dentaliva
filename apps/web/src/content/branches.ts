import type { SanityClient } from "@sanity/client";

import { branchListQuery } from "@dentaliva/sanity-schema/queries";
import type { LocalizedPair } from "./home";

export interface BranchItem {
  name?: string;
  slug?: string;
  address?: LocalizedPair;
  phone?: string;
  hours?: LocalizedPair;
  mapUrl?: string;
  geo?: { lat?: number; lng?: number };
  image?: unknown;
}

async function fetchJson<T>(client: SanityClient, query: string): Promise<T> {
  const result: unknown = await client.fetch(query);
  return result as T;
}

export async function fetchBranches(client: SanityClient): Promise<BranchItem[]> {
  const list = await fetchJson<BranchItem[] | null>(client, branchListQuery);
  return list ?? [];
}

export async function fetchBranchBySlug(
  client: SanityClient,
  slug: string,
): Promise<BranchItem | null> {
  const branches = await fetchBranches(client);
  return branches.find((branch) => branch.slug === slug) ?? null;
}
