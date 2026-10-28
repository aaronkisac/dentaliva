// DSN-72: blogPost.heroImage backfill for the dentaliva.com (com) dataset.
//
// The com migration carried blog TEXT but no images (blogPost.heroImage was
// 0/24, so /blog rendered 24 imageless text cards). The legacy WordPress
// pages keep an og:image per post (683x1024 portrait webp) — verified 24/24
// on 2026-10-27. This script backfills:
//
//   blogPost.heroImage ← og:image of the matching legacy /blog/<slug>/ page
//
// Same rules as enrich-eu-images.mjs: PATCH (never createOrReplace), CLI
// session token, dry-run by default, `--apply` to write. Idempotent: posts
// that already have a heroImage are skipped, so a rerun is a no-op.

import { readFileSync, writeFileSync } from "node:fs";

const PROJECT = "86x2hbzv"; // com
const DATASET = "production";
const BASE = "https://www.dentaliva.com";
const APPLY = process.argv.includes("--apply");
const DELAY = 400;
const UA = { "User-Agent": "Mozilla/5.0 (migration; dentaliva-rebuild)" };

const TOKEN = JSON.parse(
  readFileSync(`${process.env.USERPROFILE}/.config/sanity/config.json`, "utf8"),
).authToken;
// The CLI stores either a plain string or {type,value} depending on version.
const token = typeof TOKEN === "string" ? TOKEN : TOKEN?.value;
if (!token) throw new Error("no Sanity CLI session token");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) =>
  console.error(`[enrich-com-blog-images] ${new Date().toISOString().slice(11, 19)} ${m}`);

async function groq(query) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v2024-10-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const json = await res.json();
  if (json.error) throw new Error(`GROQ ${json.error.type}: ${json.error.description}`);
  return json.result;
}

function ogImage(html) {
  const raw =
    (html.match(/<meta property="og:image" content="([^"]+)"/) ?? [])[1] ??
    (html.match(/<meta name="og:image" content="([^"]+)"/) ?? [])[1];
  return raw ? raw.replaceAll("&amp;", "&") : null;
}

const assetCache = new Map();
async function uploadImage(url) {
  if (assetCache.has(url)) return assetCache.get(url);
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`image ${url} → ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  const filename = url.split("/").pop().split("?")[0] || "image";
  const mime = filename.endsWith(".png")
    ? "image/png"
    : filename.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";
  const up = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/assets/images/${DATASET}?filename=${filename}`,
    { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": mime }, body },
  );
  if (!up.ok) throw new Error(`upload ${filename} → ${up.status}`);
  const json = await up.json();
  const ref = json.document._id;
  assetCache.set(url, ref);
  log(`asset: ${filename} → ${ref}`);
  return ref;
}

async function main() {
  const plan = { posts: [], skipped: [] };

  const posts = await groq(
    `*[_type=="blogPost"]{_id, "slug": slug.current, "title": coalesce(title.tr, title), "heroRef": heroImage.asset._ref} | order(slug.current asc)`,
  );
  for (const p of posts) {
    if (p.heroRef) {
      plan.skipped.push({ slug: p.slug, reason: "heroImage already set" });
      continue;
    }
    const res = await fetch(`${BASE}/blog/${p.slug}/`, { headers: UA });
    const html = res.ok ? await res.text() : "";
    const img = html ? ogImage(html) : null;
    if (!img) {
      plan.skipped.push({ slug: p.slug, reason: res.ok ? "no og:image" : `page ${res.status}` });
      continue;
    }
    plan.posts.push({
      _id: p._id,
      slug: p.slug,
      source: img,
      set: {
        heroImage: {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: `UPLOAD:${img}` },
          alt: { _type: "localeString", tr: p.title ?? p.slug },
        },
      },
    });
    await sleep(DELAY);
  }

  console.log(`\n=== PLAN (${APPLY ? "APPLY" : "DRY-RUN"}) ===`);
  console.log(`posts to patch : ${plan.posts.length}`);
  console.log(`skipped        : ${plan.skipped.length}`);
  for (const s of plan.skipped) console.log(`  SKIP ${s.slug}: ${s.reason}`);
  for (const b of plan.posts) console.log(`  B ${b.slug} ← ${b.source.split("/").pop()}`);

  if (!APPLY) {
    writeFileSync(
      "packages/migration/enrich-com-blog-images-plan.json",
      JSON.stringify(plan, null, 2),
    );
    console.log(
      "\ndry-run: plan written to packages/migration/enrich-com-blog-images-plan.json (nothing written to Sanity)",
    );
    return;
  }

  for (const entry of plan.posts) entry.set.heroImage.asset._ref = await uploadImage(entry.source);

  // Chunk mutations (upload-heavy runs can exceed body limits).
  const mutations = plan.posts.map(({ _id, set }) => ({ patch: { id: _id, set } }));
  for (let i = 0; i < mutations.length; i += 25) {
    const res = await fetch(
      `https://${PROJECT}.api.sanity.io/v1/data/mutate/${DATASET}?returnDocuments=false`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: mutations.slice(i, i + 25) }),
      },
    );
    if (!res.ok) throw new Error(`mutate chunk ${i} → ${res.status}: ${await res.text()}`);
  }
  console.log(`applied ${mutations.length} patches`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
