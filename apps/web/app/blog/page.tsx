import type { Metadata } from "next";

import { Reveal, Section, Text } from "@dentaliva/ui";

import { PageHero } from "../../components/page-hero";
import { CtaBand } from "../../components/cta-band";
import { BlogCard, BlogFeature } from "../../components/blog-card";
import { t } from "../../src/i18n";

import { fetchBlogPosts } from "../../src/content/blog";
import { fetchHomePageDocument, fetchSiteSettings } from "../../src/content/home";
import { fetchSiteCopy } from "../../src/content/site-copy";
import { readClient } from "../../src/sanity";
import { pageMetadata } from "../../src/seo";
import { pageString } from "../../src/page-strings";
import { routes } from "../../src/routes";

export const metadata: Metadata = pageMetadata({
  path: routes.blog,
  title: "Blog",
  description: pageString("blogDescription"),
});

/**
 * DSN-72: blog listeleme — Dentologie /blog referanslı editorial düzen.
 * Vitrin (en yeni yazı, 2 kolon portre + altın çerçeve) + kartsız 3 kolon
 * portre grid; başlıklar/tarih/okuma bağlantısı siteCopy'den (sıfır
 * hardcoded — "Oku →" burada emekli oldu), tarih site dilinde formatlanır
 * (eu'nun EN blog'u da bu sayfayı kullanır). Sayfa sonu dönüşüm bandı
 * DSN-24 deseni; fetch hatasında sessizce düşer. Sıfır yeni client yüzeyi.
 */
export default async function BlogPage() {
  const posts = await fetchBlogPosts(readClient);
  const [copy, homePage, settings] = await Promise.all([
    fetchSiteCopy(readClient),
    fetchHomePageDocument(readClient).catch(() => null),
    fetchSiteSettings(readClient),
  ]);

  const readLabel = t(copy?.ui?.blogReadCta) || undefined;
  const featuredEyebrow = t(copy?.sectionHeadings?.blogFeatured) || undefined;
  const [feature, ...rest] = posts;

  return (
    <>
      <PageHero eyebrow="Dentaliva" title="Blog" />
      <Reveal>
        <Section>
          {posts.length === 0 ? (
            <Text className="mt-6">{pageString("blogEmpty")}</Text>
          ) : (
            <>
              {feature ? (
                <BlogFeature post={feature} eyebrow={featuredEyebrow} readLabel={readLabel} />
              ) : null}
              {rest.length > 0 ? (
                <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <BlogCard key={post.slug} post={post} readLabel={readLabel} />
                  ))}
                </div>
              ) : null}
            </>
          )}
        </Section>
      </Reveal>
      <CtaBand
        title={homePage?.cta?.title ?? null}
        text={homePage?.cta?.text ?? null}
        phone={settings?.phone}
      />
    </>
  );
}
