import type { Metadata } from "next";

import Image from "next/image";

import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { buildBreadcrumbJsonLd } from "@dentaliva/seo";

import { Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { PortableText } from "../../../components/portable-text";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { fetchBlogPostBySlug, fetchBlogPosts } from "../../../src/content/blog";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata } from "../../../src/seo";

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
  // PRF-5: _seed placeholder sayfaları dizine eklenmesin.
  if (!post) return { title: "Blog", robots: { index: false, follow: false } };
  return pageMetadata({
    path: `/blog/${slug}`,
    title: pickLocalized(post.title) || "Blog",
    description: pickLocalized(post.excerpt),
    seo: post.seo,
    ogImageRef: post.heroImage?.ref,
    ogImageAlt: post.heroImage?.alt?.tr ?? pickLocalized(post.title),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(readClient, slug);
  if (!post) {
    return <SeedPlaceholder title="Blog" />;
  }

  const blocks = post.body?.tr ?? [];

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Ana Sayfa", url: absoluteUrl("/") },
          { name: "Blog", url: absoluteUrl("/blog") },
          {
            name: pickLocalized(post.title) || "Blog",
            url: absoluteUrl(`/blog/${slug}`),
          },
        ])}
      />
      <Section>
        <Text tone="muted" size="small">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : ""}
          {post.author?.name
            ? ` · ${post.author.name}${post.author.title?.tr ? ` — ${post.author.title.tr}` : ""}`
            : ""}
        </Text>
        {post.heroImage?.ref ? (
          <Image
            src={post.heroImage.ref}
            alt={post.heroImage?.alt?.tr ?? pickLocalized(post.title)}
            width={1200}
            height={600}
            // PRF-5: hero görseli LCP adayı — priority (preload) + varsa
            // CMS'ten gelen inline base64 lqip ile anında blur.
            priority
            sizes="(max-width: 900px) 100vw, 1180px"
            placeholder={post.heroImage.lqip ? "blur" : "empty"}
            blurDataURL={post.heroImage.lqip}
            className="mt-6 h-auto w-full border border-[var(--dvn-line)] object-cover"
          />
        ) : null}
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
    </>
  );
}
