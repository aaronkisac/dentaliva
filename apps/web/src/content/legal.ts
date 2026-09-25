import type { SanityClient } from "@sanity/client";

import type { LocalizedPair } from "./home";

export interface LegalPageContent {
  title?: LocalizedPair;
  body?: LocalizedPair;
}

async function fetchJson<T>(
  client: SanityClient,
  query: string,
  params?: Record<string, string>,
): Promise<T> {
  const result: unknown = await client.fetch(query, params);
  return result as T;
}

export async function fetchLegalPageBySlug(
  client: SanityClient,
  slug: string,
): Promise<LegalPageContent | null> {
  const query = `*[_type == "legalPage" && slug.current == $slug][0]{ title, body }`;
  return fetchJson<LegalPageContent | null>(client, query, { slug });
}
