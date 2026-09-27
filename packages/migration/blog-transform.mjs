// Runner: post-sitemap lastmod + normalized pages → blogPost docs + redirects.
// Usage (repo root): node packages/migration/blog-transform.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";

import { splitByLastmod, toBlogPostDoc, toRedirectDoc } from "./src/blog-transform.ts";

const POST_SITEMAP = "https://www.dentaliva.com/post-sitemap.xml";
// CPT-1: optional argv overrides for v2 re-extraction runs.
const normalizedDir = process.argv[2] ?? "migration/normalized";
const outDir = process.argv[3] ?? "migration/ndjson";
const normalized = JSON.parse(await readFile(`${normalizedDir}/blog.json`, "utf8"));

const sitemapXml = await (await fetch(POST_SITEMAP)).text();
const urlBlocks = sitemapXml.split("<url>").slice(1);
const entries = urlBlocks.map((block) => ({
  loc: (block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/) ?? [])[1] ?? "",
  lastmod: (block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/) ?? [])[1] ?? "2025-07-01",
}));

const { substantial, stubs } = splitByLastmod(entries);
console.log(`substantial: ${substantial.length}, stubs: ${stubs.length}`);

const byUrl = new Map(normalized.map((p) => [p.url, p]));
const postDocs = [];
const redirectDocs = [];

for (const entry of substantial) {
  const page = byUrl.get(entry.loc);
  if (!page) {
    console.error(`missing normalized page: ${entry.loc}`);
    continue;
  }
  postDocs.push(toBlogPostDoc(page, entry.lastmod));
}
for (const entry of stubs) {
  const slug = slugOf(entry.loc);
  redirectDocs.push(toRedirectDoc(slug));
}
function slugOf(loc) {
  const segments = new URL(loc).pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? "";
}

console.log(`blogPost docs: ${postDocs.length}, redirect docs: ${redirectDocs.length}`);

await mkdir("migration/ndjson", { recursive: true });
await writeFile(`${outDir}/blog.ndjson`, postDocs.map((d) => JSON.stringify(d)).join("\n"));
await writeFile(
  `${outDir}/redirects.ndjson`,
  redirectDocs.map((d) => JSON.stringify(d)).join("\n"),
);
log2(`wrote ${postDocs.length} posts + ${redirectDocs.length} redirects`);
function log2(msg) {
  console.log(msg);
}
