import type { SanityClient } from "@sanity/client";

import { blogBySlugQuery, blogListQuery } from "@dentaliva/sanity-schema/queries";
import type { LocalizedPair } from "./home";

export interface BlogListItem {
  title?: LocalizedPair;
  slug?: string;
  excerpt?: LocalizedPair;
  publishedAt?: string;
  heroImage?: unknown;
}

export interface PortableBlock {
  _type: string;
  style?: string;
  children?: Array<{ _type: string; text?: string; marks?: string[]; _key?: string }>;
  markDefs?: Array<{ _type: string; _key?: string; href?: string }>;
  _key?: string;
}

export interface BlogPostDetail extends BlogListItem {
  body?: { tr?: PortableBlock[]; en?: PortableBlock[] };
  author?: { name?: string; slug?: string; title?: LocalizedPair };
}

async function fetchJson<T>(
  client: SanityClient,
  query: string,
  params?: Record<string, string>,
): Promise<T> {
  const result: unknown = await client.fetch(query, params);
  return result as T;
}

export async function fetchBlogPosts(client: SanityClient): Promise<BlogListItem[]> {
  const list = await fetchJson<BlogListItem[] | null>(client, blogListQuery);
  return list ?? [];
}

export async function fetchBlogPostBySlug(
  client: SanityClient,
  slug: string,
): Promise<BlogPostDetail | null> {
  return fetchJson<BlogPostDetail | null>(client, blogBySlugQuery, { slug });
}
