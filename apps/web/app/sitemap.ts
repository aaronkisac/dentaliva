import type { MetadataRoute } from "next";

// Static export: sitemap.xml must be fully prerenderable.
export const dynamic = "force-static";

import { site } from "../src/config";
import { readClient } from "../src/sanity";

/**
 * Per-domain sitemap. hreflang alternates stay dormant until sister domains
 * (dentaliva.eu/.nl) ship translated content — then each entry gains
 * alternates built from `site.sisterDomains` (SEO-3 acceptance).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${site.domain}`;
  const now = new Date();

  const staticPaths = [
    "",
    "/hakkimizda",
    "/hizmetlerimiz",
    "/hekimlerimiz",
    "/subelerimiz",
    "/fotograf-galerisi",
    "/iletisim",
    "/kvkk",
    ...(site.features.blog ? ["/blog"] : []),
  ];

  const cmsSlugs = async (typeQuery: string): Promise<string[]> => {
    // The GROQ projection returns a plain string under key "slug".
    const docs = (await readClient.fetch<Array<{ slug?: string }>>(typeQuery)) ?? [];
    return docs.map((doc) => doc.slug).filter((slug): slug is string => Boolean(slug));
  };

  const [treatments, doctors, branches, blog] = await Promise.all([
    cmsSlugs(`*[_type == "treatment"]{ "slug": slug.current }`),
    cmsSlugs(`*[_type == "doctor"]{ "slug": slug.current }`),
    cmsSlugs(`*[_type == "branch"]{ "slug": slug.current }`),
    site.features.blog ? cmsSlugs(`*[_type == "blogPost"]{ "slug": slug.current }`) : [],
  ]);

  const cmsPaths = [
    ...treatments.map((slug) => `/hizmetlerimiz/${slug}`),
    ...doctors.map((slug) => `/hekimlerimiz/${slug}`),
    ...branches.map((slug) => `/subelerimiz/${slug}`),
    ...blog.map((slug) => `/blog/${slug}`),
  ];

  return [...staticPaths, ...cmsPaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
