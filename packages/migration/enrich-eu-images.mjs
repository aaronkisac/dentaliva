// ENR-EU-IMG: heroImage enrichment for the dentaliva.eu (eu) dataset.
//
// The eu migration imported treatment/blog TEXT but no images (the legacy
// service-grid thumbnails were the broken elementor thumbs, so nothing was
// carried), and homePage.hero.image / about.image were never seeded — the
// built site renders texts with no images. This script backfills:
//
//   1. treatment.heroImage  ← og:image of the matching legacy page
//   2. blogPost.heroImage   ← og:image of the matching legacy blog page
//   3. homePage.hero.image + about.image ← com's brand photos (upload to eu)
//   4. deletes the junk "locations.kml" treatment (a WP sitemap artifact the
//      crawl mistook for a page)
//
// Same rules as enrich-eu.mjs: PATCH (never createOrReplace), CLI-session
// token, dry-run by default, `--apply` to write.
//
//   node packages/migration/enrich-eu-images.mjs            # plan only
//   node packages/migration/enrich-eu-images.mjs --apply    # write

import { readFileSync, writeFileSync } from "node:fs";

const PROJECT = "84n9qnfg"; // eu
const COM_PROJECT = "86x2hbzv"; // com — hero/about brand photos
const DATASET = "production";
const BASE = "https://www.dentaliva.eu";
const APPLY = process.argv.includes("--apply");
const DELAY = 400;
const UA = { "User-Agent": "Mozilla/5.0 (migration; dentaliva-rebuild)" };

const TOKEN = JSON.parse(
  readFileSync(`${process.env.USERPROFILE}/.config/sanity/config.json`, "utf8"),
).authToken;
if (!TOKEN) throw new Error("no Sanity CLI session token");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) =>
  console.error(`[enrich-eu-images] ${new Date().toISOString().slice(11, 19)} ${m}`);

async function groq(project, query) {
  const res = await fetch(
    `https://${project}.api.sanity.io/v2024-10-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
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
    { method: "POST", headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": mime }, body },
  );
  if (!up.ok) throw new Error(`upload ${filename} → ${up.status}`);
  const json = await up.json();
  const ref = json.document._id;
  assetCache.set(url, ref);
  log(`asset: ${filename} → ${ref}`);
  return ref;
}

/** com asset ref ("image-<hash>-WxH-webp") → its CDN URL on the com project. */
function comAssetUrl(ref) {
  const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!m) throw new Error(`unparsable com asset ref: ${ref}`);
  return `https://cdn.sanity.io/images/${COM_PROJECT}/${DATASET}/${m[1]}-${m[2]}.${m[3] === "jpg" ? "jpg" : m[3]}`;
}

async function main() {
  const plan = { treatments: [], blogPosts: [], homePage: null, delete: [], skipped: [] };

  // ---- 1+4. treatments -------------------------------------------------
  const treatments = await groq(
    PROJECT,
    '*[_type=="treatment"]{_id, "slug": slug.current, "name": name.en} | order(slug.current asc)',
  );
  for (const t of treatments) {
    if (t.slug === "locations.kml") {
      plan.delete.push({ _id: t._id, why: "WP sitemap artifact crawled as a treatment" });
      continue;
    }
    const res = await fetch(`${BASE}/${t.slug}/`, { headers: UA });
    const html = res.ok ? await res.text() : "";
    const img = html ? ogImage(html) : null;
    if (!img) {
      plan.skipped.push({
        type: "treatment",
        slug: t.slug,
        reason: res.ok ? "no og:image" : `page ${res.status}`,
      });
      continue;
    }
    plan.treatments.push({
      _id: t._id,
      slug: t.slug,
      source: img,
      set: {
        heroImage: {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: `UPLOAD:${img}` },
          alt: { _type: "localeString", en: t.name ?? t.slug },
        },
      },
    });
    await sleep(DELAY);
  }

  // ---- 2. blog posts ---------------------------------------------------
  const posts = await groq(
    PROJECT,
    '*[_type=="blogPost"]{_id, "slug": slug.current, "title": coalesce(title.en, title)} | order(slug.current asc)',
  );
  for (const p of posts) {
    const res = await fetch(`${BASE}/blog/${p.slug}/`, { headers: UA });
    const html = res.ok ? await res.text() : "";
    const img = html ? ogImage(html) : null;
    if (!img) {
      plan.skipped.push({
        type: "blogPost",
        slug: p.slug,
        reason: res.ok ? "no og:image" : `page ${res.status}`,
      });
      continue;
    }
    plan.blogPosts.push({
      _id: p._id,
      slug: p.slug,
      source: img,
      set: {
        heroImage: {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: `UPLOAD:${img}` },
          alt: { _type: "localeString", en: p.title ?? p.slug },
        },
      },
    });
    await sleep(DELAY);
  }

  // ---- 3. homePage hero + about from com brand photos -------------------
  const comHome = await groq(
    COM_PROJECT,
    '*[_type=="homePage"][0]{"heroRef": hero.image.asset._ref, "aboutRef": about.image.asset._ref}',
  );
  const home = await groq(PROJECT, '*[_type=="homePage"][0]{_id}');
  plan.homePage = {
    _id: home._id,
    hero: { source: comAssetUrl(comHome.heroRef), alt_en: "Dentaliva Dental Clinic" },
    about: { source: comAssetUrl(comHome.aboutRef), alt_en: "Dentaliva clinic" },
  };

  // ---- report -----------------------------------------------------------
  const resolveUploads = async (entry) => {
    if (entry.set) entry.set.heroImage.asset._ref = await uploadImage(entry.source);
  };

  console.log(`\n=== PLAN (${APPLY ? "APPLY" : "DRY-RUN"}) ===`);
  console.log(`treatments to patch : ${plan.treatments.length}`);
  console.log(`blog posts to patch : ${plan.blogPosts.length}`);
  console.log(`homePage images     : hero + about from com`);
  console.log(`docs to DELETE      : ${plan.delete.map((d) => d._id).join(", ") || "none"}`);
  console.log(`skipped             : ${plan.skipped.length}`);
  for (const s of plan.skipped) console.log(`  SKIP ${s.type}/${s.slug}: ${s.reason}`);
  for (const t of plan.treatments.slice(0, 40))
    console.log(`  T ${t.slug} ← ${t.source.split("/").pop()}`);
  for (const b of plan.blogPosts.slice(0, 40))
    console.log(`  B ${b.slug} ← ${b.source.split("/").pop()}`);

  if (!APPLY) {
    writeFileSync("packages/migration/enrich-eu-images-plan.json", JSON.stringify(plan, null, 2));
    console.log(
      "\ndry-run: plan written to packages/migration/enrich-eu-images-plan.json (nothing written to Sanity)",
    );
    return;
  }

  // ---- apply ------------------------------------------------------------
  const mutations = [];
  for (const d of plan.delete) mutations.push({ delete: { id: d._id } });
  for (const entry of [...plan.treatments, ...plan.blogPosts]) await resolveUploads(entry);
  mutations.push(
    ...[...plan.treatments, ...plan.blogPosts].map(({ _id, set }) => ({ patch: { id: _id, set } })),
  );

  const heroRef = await uploadImage(plan.homePage.hero.source);
  const aboutRef = await uploadImage(plan.homePage.about.source);
  mutations.push({
    patch: {
      id: plan.homePage._id,
      set: {
        "hero.image": {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: heroRef },
          alt: {
            _type: "localeString",
            en: plan.homePage.hero.alt_en,
            tr: "Dentaliva Diş Kliniği",
          },
        },
        "about.image": {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: aboutRef },
          alt: { _type: "localeString", en: plan.homePage.about.alt_en },
        },
      },
    },
  });

  // Chunk mutations (upload-heavy runs can exceed body limits).
  for (let i = 0; i < mutations.length; i += 25) {
    const res = await fetch(
      `https://${PROJECT}.api.sanity.io/v1/data/mutate/${DATASET}?returnDocuments=false`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: mutations.slice(i, i + 25) }),
      },
    );
    if (!res.ok) throw new Error(`mutate chunk ${i} → ${res.status} ${await res.text()}`);
  }
  log(`applied ${mutations.length} mutations`);
  writeFileSync(
    "packages/migration/enrich-eu-images-report.json",
    JSON.stringify(
      { applied: mutations.length, assetCache: [...assetCache.entries()], ...plan },
      null,
      2,
    ),
  );
  console.log("done — report: packages/migration/enrich-eu-images-report.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
