import type { Metadata } from "next";

import Image from "next/image";

import { t, tBlocks } from "../../../src/i18n";
import { buildBlogPostingJsonLd, buildBreadcrumbJsonLd } from "@dentaliva/seo";

import { Reveal, Heading, Section, Text } from "@dentaliva/ui";
import { JsonLd } from "../../../components/json-ld";
import { CtaBand } from "../../../components/cta-band";
import { PortableTextSections } from "../../../components/portable-text-sections";
import { formatPostDate } from "../../../components/blog-card";
import { SeedPlaceholder } from "../../../components/seed-placeholder";
import { fetchBlogPostBySlug, fetchBlogPosts } from "../../../src/content/blog";
import { fetchHomePageDocument, fetchSiteSettings } from "../../../src/content/home";
import { fetchSiteCopy } from "../../../src/content/site-copy";
import { readClient } from "../../../src/sanity";
import { absoluteUrl, pageMetadata, sanityImageUrl } from "../../../src/seo";
import { pageString } from "../../../src/page-strings";
import { routes } from "../../../src/routes";

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
    path: routes.blogPost(slug),
    title: t(post.title) || "Blog",
    description: t(post.excerpt),
    seo: post.seo,
    ogImageRef: post.heroImage?.ref,
    ogImageAlt: t(post.heroImage?.alt) || t(post.title),
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlug(readClient, slug);
  if (!post) {
    return <SeedPlaceholder title="Blog" />;
  }

  const blocks = tBlocks(post.body);

  // DSN-24: sayfa sonu bandının CMS içeriği; fetch hatasında sessizce düşer.
  const [homePage, settings, copy] = await Promise.all([
    fetchHomePageDocument(readClient).catch(() => null),
    fetchSiteSettings(readClient),
    fetchSiteCopy(readClient),
  ]);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: pageString("breadcrumbHome"), url: absoluteUrl("/") },
          // "Blog" literal: bu sayfanın breadcrumb'ı ve listing hero'su ile
          // aynı (hardcode sweep kapsamı dışı gezinme etiketi).
          { name: "Blog", url: absoluteUrl(routes.blog) },
          {
            name: t(post.title) || "Blog",
            url: absoluteUrl(routes.blogPost(slug)),
          },
        ])}
      />
      {/* DSN-101: BlogPosting varlığı — article rich result sinyali. */}
      <JsonLd
        data={buildBlogPostingJsonLd({
          headline: t(post.title) || "Blog",
          url: absoluteUrl(routes.blogPost(slug)),
          ...(post.heroImage?.ref ? { imageUrl: sanityImageUrl(post.heroImage.ref) } : {}),
          ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
          ...(post.author?.name ? { authorName: post.author.name } : {}),
        })}
      />
      <Section>
        {/* DSN-94: sayfa ailesinin gold-dash eyebrow'i — listeye dönüş
            bağlantısı (breadcrumb "Blog" literalini paylaşır). */}
        <a
          href={routes.blog}
          className="group inline-flex items-center gap-3 font-sans text-xs uppercase tracking-widest text-gold-deep no-underline hover:text-gold"
        >
          <span
            aria-hidden="true"
            className="h-px w-8 bg-gold transition-colors group-hover:bg-gold-deep"
          />
          Blog
        </a>
        {post.heroImage?.ref ? (
          <Image
            src={post.heroImage.ref}
            alt={t(post.heroImage?.alt) || t(post.title)}
            width={1200}
            height={600}
            // PRF-5: hero görseli LCP adayı — priority (preload) + varsa
            // CMS'ten gelen inline base64 lqip ile anında blur.
            priority
            sizes="(max-width: 900px) 100vw, 1180px"
            placeholder={post.heroImage.lqip ? "blur" : "empty"}
            blurDataURL={post.heroImage.lqip}
            className="mt-6 h-auto w-full border border-[var(--dvn-line-soft)] object-cover"
          />
        ) : null}
        {/* DSN-94: tarih·yazar satırı görselin altında, h1'in üstünde —
            tepedeki yapay boşluk yerine künye akışı; tarih site dilinde
            (formatPostDate) — ham 19.03.2026 yerine "18 Mart 2026". */}
        <p className="mt-5 font-sans text-[length:var(--dvn-text-small-size)] leading-[var(--dvn-text-small-lh)] text-muted">
          {post.publishedAt ? formatPostDate(post.publishedAt) : ""}
          {post.author?.name
            ? ` · ${post.author.name}${t(post.author.title) ? ` — ${t(post.author.title)}` : ""}`
            : ""}
        </p>
        <Heading level="h1" size="lg" className="mt-2">
          {t(post.title)}
        </Heading>
        {t(post.excerpt) ? (
          <Text size="lg" className="mt-4 max-w-3xl">
            {t(post.excerpt)}
          </Text>
        ) : null}
      </Section>

      {/* DSN-94: gövde marka bantlarında (24/24 yazıda 2-8 h2 — veri
          probu); bantlar tam genişlik — Section konteynerinin DIŞINDA. */}
      <Reveal>
        <PortableTextSections blocks={blocks} />
      </Reveal>

      {/* DSN-24: sayfa sonu dönüşüm bandı. */}
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
        actionLabel={t(copy?.ui?.appointmentCta)}
      />
    </>
  );
}
