import type { SanityClient } from "@sanity/client";
import { cache } from "react";

import type { SeoObject } from "@dentaliva/seo";
import { blogBySlugQuery, blogListQuery } from "@dentaliva/sanity-schema/queries";
import type { LocalizedPair } from "./home";

export interface BlogListItem {
  title?: LocalizedPair;
  slug?: string;
  excerpt?: LocalizedPair;
  publishedAt?: string;
  heroImage?: BlogImage;
}

export interface BlogImage {
  ref?: string;
  alt?: LocalizedPair;
  /** Sanity metadata.lqip — inline base64 blur placeholder (build-time only). */
  lqip?: string;
}

export interface PortableBlock {
  _type: string;
  style?: string;
  children?: Array<{ _type: string; text?: string; marks?: string[]; _key?: string }>;
  markDefs?: Array<{ _type: string; _key?: string; href?: string }>;
  _key?: string;
}

export interface BlogPostDetail extends BlogListItem {
  body?: { tr?: PortableBlock[]; en?: PortableBlock[]; nl?: PortableBlock[] };
  author?: { name?: string; slug?: string; title?: LocalizedPair };
  heroImage?: BlogImage;
  seo?: SeoObject | null;
}

async function fetchJson<T>(client: SanityClient, query: string): Promise<T> {
  const result: unknown = await client.fetch(query, {});
  return result as T;
}

export async function fetchBlogPosts(client: SanityClient): Promise<BlogListItem[]> {
  const list = await fetchJson<BlogListItem[] | null>(client, blogListQuery);
  return list ?? [];
}

/** PRF-5: generateMetadata + sayfa aynı isteği paylaşır (React cache). */
export const fetchBlogPostBySlug = cache(
  async (client: SanityClient, slug: string): Promise<BlogPostDetail | null> => {
    const result: unknown = await client.fetch(blogBySlugQuery, { slug });
    return (result as BlogPostDetail | null) ?? null;
  },
);
