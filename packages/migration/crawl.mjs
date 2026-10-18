// One-off crawler: a clinic site → normalized JSON (MIG-1; INT-10: any base).
// Usage: node crawl.mjs [outDir] [delayMs] [base]
//   eu run: node crawl.mjs normalized-eu 400 https://www.dentaliva.eu
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { classifyUrl } from "./src/classify.ts";
import { extractPage } from "./src/extract.ts";
import { isAllowed, parseDisallowedPaths, parseLocs } from "./src/sitemap.ts";

const BASE = process.argv[4] ?? "https://www.dentaliva.com";
const SITE = BASE.includes("eu") ? "eu" : "com";
const outDir = process.argv[2] ?? "normalized";
const delayMs = Number(process.argv[3] ?? 400);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (msg) => console.error(`[crawl] ${new Date().toISOString().slice(11, 19)} ${msg}`);

const robots = await (await fetch(`${BASE}/robots.txt`)).text();
const disallowed = parseDisallowedPaths(robots);
log(`robots: ${disallowed.length} disallow rules`);

function classify(pathname) {
  return classifyUrl(pathname, SITE);
}

const indexXml = await (await fetch(`${BASE}/sitemap_index.xml`)).text();
const sitemaps = parseLocs(indexXml);
const urls = [];
for (const sm of sitemaps) {
  const xml = await (await fetch(sm)).text();
  urls.push(...parseLocs(xml));
}
log(`sitemap: ${urls.length} urls from ${sitemaps.length} sitemaps`);

const allowed = urls.filter((url) => {
  const { pathname } = new URL(url);
  return isAllowed(pathname, disallowed);
});
log(`allowed after robots: ${allowed.length}`);

const byType = { core: [], treatment: [], doctor: [], branch: [], legal: [], blog: [] };
let done = 0;
for (const url of allowed) {
  const { pathname } = new URL(url);
  const type = classify(pathname);
  if (type === "ignored") continue;
  try {
    const html = await (await fetch(url)).text();
    // CPT-1: shared scoped extraction (main container, junk filters, blocks).
    const { title, h1, blocks, paragraphs } = extractPage(html);
    byType[type].push({ url, title, h1, blocks, paragraphs });
  } catch (error) {
    log(`FETCH FAIL ${url}: ${error.message}`);
  }
  done += 1;
  if (done % 25 === 0) log(`fetched ${done}/${allowed.length}`);
  await sleep(delayMs);
}

await mkdir(outDir, { recursive: true });
for (const [type, pages] of Object.entries(byType)) {
  const file = path.join(outDir, `${type}.json`);
  await writeFile(file, JSON.stringify(pages, null, 1));
  log(`wrote ${file} (${pages.length})`);
}
log(`DONE: ${Object.values(byType).reduce((a, b) => a + b.length, 0)} pages normalized`);
