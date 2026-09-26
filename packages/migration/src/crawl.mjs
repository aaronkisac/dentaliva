// One-off crawler: dentaliva.com → normalized JSON (MIG-1).
// Usage: node src/crawl.mjs [outDir] [delayMs]
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import * as cheerio from "cheerio";

const BASE = "https://www.dentaliva.com";
const outDir = process.argv[2] ?? "normalized";
const delayMs = Number(process.argv[3] ?? 400);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (msg) => console.error(`[crawl] ${new Date().toISOString().slice(11, 19)} ${msg}`);

const robots = await (await fetch(`${BASE}/robots.txt`)).text();
const disallowed = robots
  .split("\n")
  .map((l) => l.trim())
  .filter((l, i, arr) => {
    const prev = arr[i - 1]?.trim() ?? "";
    return l.startsWith("Disallow:") && (prev.startsWith("User-Agent: *") || prev === "");
  })
  .map((l) => l.slice("Disallow:".length).trim())
  .filter(Boolean);
log(`robots: ${disallowed.length} disallow rules`);

function classify(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1];
  if (last === undefined) return "core";
  if (segments[0] === "blog") {
    if (segments.length === 1) return "ignored";
    if (segments[1] === "category" || segments[1] === "author") return "ignored";
    return "blog";
  }
  if (["avcilar", "basaksehir", "altunizade"].includes(last)) return "branch";
  if (last.includes("kvkk")) return "legal";
  if (
    [
      "hakkimizda",
      "iletisim",
      "fotograf-galerisi",
      "insan-kaynaklari",
      "hekimlerimiz",
      "hizmetlerimiz",
      "subelerimiz",
    ].includes(last)
  )
    return "core";
  if (segments.length === 1) return /^(dr-dt|dr|dt)-/.test(last) ? "doctor" : "treatment";
  return "ignored";
}

const indexXml = await (await fetch(`${BASE}/sitemap_index.xml`)).text();
const sitemaps = [...indexXml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
const urls = [];
for (const sm of sitemaps) {
  const xml = await (await fetch(sm)).text();
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) urls.push(m[1]);
}
log(`sitemap: ${urls.length} urls from ${sitemaps.length} sitemaps`);

const allowed = urls.filter((url) => {
  const { pathname } = new URL(url);
  return !disallowed.some((rule) => pathname.startsWith(rule) || pathname.includes(rule));
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
    const $ = cheerio.load(html);
    const title = $("title").first().text().replace(/\s+/g, " ").trim();
    const h1 = $("h1").first().text().replace(/\s+/g, " ").trim();
    const paragraphs = [];
    $("h1, h2, h3, p, li").each((_i, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (text.length < 40) return;
      paragraphs.push(text);
    });
    byType[type].push({ url, title, h1, paragraphs });
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
