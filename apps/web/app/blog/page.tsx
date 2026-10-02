import type { Metadata } from "next";

import Image from "next/image";

import { Reveal, Card, Heading, Section, Text } from "@dentaliva/ui";
import { PageHero } from "../../components/page-hero";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Link } from "@dentaliva/ui";
import { fetchBlogPosts } from "../../src/content/blog";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";

export const metadata: Metadata = pageMetadata({
  path: "/blog",
  title: "Blog",
  description: "Dentaliva blog — diş sağlığı yazıları",
});

export default async function BlogPage() {
  const posts = await fetchBlogPosts(readClient);

  return (
    <>
      <PageHero eyebrow="Dentaliva" title="Blog" />
      <Reveal>
        <Section>
          {posts.length === 0 ? (
            <Text className="mt-6">Yazılar hazırlanıyor.</Text>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.slug} hover="lift">
                  {post.heroImage?.ref ? (
                    <Image
                      src={post.heroImage.ref}
                      alt={post.heroImage.alt?.tr ?? ""}
                      width={600}
                      height={400}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      placeholder={post.heroImage.lqip ? "blur" : "empty"}
                      blurDataURL={post.heroImage.lqip}
                      className="h-48 w-full object-cover"
                    />
                  ) : null}
                  <Text tone="muted" size="small">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : ""}
                  </Text>
                  <Heading level="h3" size="title" className="mt-2">
                    {pickLocalized(post.title)}
                  </Heading>
                  <Text className="mt-2">{pickLocalized(post.excerpt)}</Text>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-block font-sans text-sm font-semibold text-navy hover:text-gold-deep"
                  >
                    Oku →
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </Section>
      </Reveal>
    </>
  );
}
