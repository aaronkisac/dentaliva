import type { MetadataRoute } from "next";

// Static export: sitemap.xml must be fully prerenderable.
export const dynamic = "force-static";

import { site } from "../src/config";
import { readClient } from "../src/sanity";
import { isPublishableSlug } from "../src/content/publishable-slug";
import { routes } from "../src/routes";

/**
 * Per-domain sitemap. hreflang alternates stay dormant until sister domains
 * (dentaliva.eu/.nl) ship translated content — then each entry gains
 * alternates built from `site.sisterDomains` (SEO-3 acceptance).
 *
 * DSN-100: slug guard drops malformed slugs (schema validator ikizi) ve CMS
 * girdileri `lastModified` olarak kendi `_updatedAt`'ını taşır — her deploy
 * "tüm sayfalar değişti" lastmod'u yerine gerçek güncelleme zamanını raporlar.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${site.domain}`;
  const now = new Date();

  const staticPaths = [
    "",
    routes.about,
    routes.treatments,
    routes.doctors,
    routes.branches,
    routes.gallery,
    routes.contact,
    routes.legal,
    ...(site.features.blog ? [routes.blog] : []),
  ];

  // The GROQ projection returns a plain string under key "slug".
  const cmsEntries = async (
    typeQuery: string,
  ): Promise<Array<{ slug: string; updatedAt: Date }>> => {
    const docs =
      (await readClient.fetch<Array<{ slug?: string; updatedAt?: string }>>(typeQuery)) ?? [];
    return docs
      .filter((doc) => isPublishableSlug(doc.slug))
      .map((doc) => ({
        slug: doc.slug as string,
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : now,
      }));
  };

  const [treatments, doctors, branches, blog] = await Promise.all([
    cmsEntries(`*[_type == "treatment"]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    cmsEntries(`*[_type == "doctor"]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    cmsEntries(`*[_type == "branch"]{ "slug": slug.current, "updatedAt": _updatedAt }`),
    site.features.blog
      ? cmsEntries(`*[_type == "blogPost"]{ "slug": slug.current, "updatedAt": _updatedAt }`)
      : Promise.resolve([]),
  ]);

  const staticEntries = staticPaths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const cms = [
    ...treatments.map((entry) => ({
      path: routes.treatment(entry.slug),
      updatedAt: entry.updatedAt,
    })),
    ...doctors.map((entry) => ({ path: routes.doctor(entry.slug), updatedAt: entry.updatedAt })),
    ...branches.map((entry) => ({ path: routes.branch(entry.slug), updatedAt: entry.updatedAt })),
    ...blog.map((entry) => ({ path: routes.blogPost(entry.slug), updatedAt: entry.updatedAt })),
  ].map((entry) => ({
    url: `${base}${entry.path}`,
    lastModified: entry.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...cms];
}
