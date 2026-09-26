import type { Metadata } from "next";

import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Heading, Section, Text } from "@dentaliva/ui";
import { PortableText } from "../../../components/portable-text";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { fetchBlogPostBySlug, fetchBlogPosts } from "../../../src/content/blog";
import { readClient } from "../../../src/sanity";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await fetchBlogPosts(readClient);
  const params = posts
    .filter((post): post is typeof post & { slug: string } => Boolean(post.slug))
    .map((post) => ({ slug: post.slug }));
  // output: "export" rejects an empty params array — a fresh clone with an
  // empty Sanity project must still build (STR-1 template dry run).
  return params.length > 0 ? params : [{ slug: "_seed" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(readClient, slug);
  return { title: post ? pickLocalized(post.title) : "Blog" };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(readClient, slug);
  if (!post) {
    return <SeedPlaceholder title="Blog" />;
  }

  const blocks = post.body?.tr ?? [];

  return (
    <Section>
      <Text tone="muted" size="small">
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : ""}
      </Text>
      <Heading level="h1" size="lg" className="mt-2">
        {pickLocalized(post.title)}
      </Heading>
      {post.excerpt?.tr ? (
        <Text size="lg" className="mt-4 max-w-3xl">
          {pickLocalized(post.excerpt)}
        </Text>
      ) : null}
      <div className="mt-10">
        <PortableText blocks={blocks} />
      </div>
    </Section>
  );
}
