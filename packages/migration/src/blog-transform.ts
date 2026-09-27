/** Blog transform: substantial posts → blogPost docs; bulk posts → redirects. */
import { isJunkLine } from "./extract.ts";

export interface NormalizedBlogPage {
  url: string;
  title: string;
  h1: string;
  paragraphs: string[];
}

export interface BlogPostDoc {
  _id: string;
  _type: "blogPost";
  title: { tr: string };
  slug: { _type: "slug"; current: string };
  excerpt: { tr: string };
  body: { tr: Array<Record<string, unknown>> };
  publishedAt: string;
}

export interface RedirectDoc {
  _id: string;
  _type: "redirect";
  from: { _type: "slug"; current: string };
  to: string;
  permanent: boolean;
}

export interface SitemapEntry {
  loc: string;
  lastmod: string;
}

/** Bulk-imported stubs were all lastmod'd in this month (2025-07 batch). */
export const BULK_CUTOFF = "2025-08-01";

export function splitByLastmod(
  entries: SitemapEntry[],
  cutoff = BULK_CUTOFF,
): {
  substantial: SitemapEntry[];
  stubs: SitemapEntry[];
} {
  const substantial = entries.filter((e) => e.lastmod >= cutoff);
  const stubs = entries.filter((e) => e.lastmod < cutoff);
  return { substantial, stubs };
}

function slugOf(loc: string): string {
  const segments = new URL(loc).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

function docId(slug: string): string {
  return `blogPost.${slug}`;
}

function toBlock(text: string, index: number): Record<string, unknown> {
  // CPT-1: H2/H3 markers become real Portable Text headings.
  const heading = text.startsWith("### ") ? "h3" : text.startsWith("## ") ? "h2" : "normal";
  const clean = text.replace(/^#{2,3} /, "");
  return {
    _type: "block",
    _key: `b${index}`,
    style: heading,
    children: [{ _type: "span", _key: `s${index}`, text: clean, marks: [] }],
    markDefs: [],
  };
}

export function toBlogPostDoc(page: NormalizedBlogPage, publishedAt: string): BlogPostDoc {
  const slug = slugOf(page.url);
  const clean = page.paragraphs.filter((p) => !p.includes("Dentaliva Studio") && !isJunkLine(p));
  const candidates = clean.filter((p) => !p.startsWith("#"));
  const excerpt = candidates.find((p) => p.length >= 60) ?? candidates[0] ?? "";
  const bodyParas = clean.filter((p) => p !== excerpt);
  return {
    _id: docId(slug),
    _type: "blogPost",
    title: { tr: page.h1 || page.title.replace(/\s*\|\s*Dentaliva.*$/i, "") },
    slug: { _type: "slug", current: slug },
    excerpt: { tr: excerpt },
    body: { tr: bodyParas.map((text, i) => toBlock(text, i)) },
    publishedAt,
  };
}

export function toRedirectDoc(slug: string): RedirectDoc {
  return {
    _id: `redirect.blog-${slug}`,
    _type: "redirect",
    from: { _type: "slug", current: `/blog/${slug}` },
    to: "/",
    permanent: true,
  };
}
