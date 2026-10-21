// ENR-NL-IMG: heroImage enrichment for the dentaliva.nl (nl) dataset.
//
// The nl migration imported Dutch treatment TEXT but no images, and
// homePage.hero.image / about.image were never seeded — /behandelingen and
// the home services carousel render text-only navy cards (Aaron report
// 2026-10-21, issue #300). Doctors/branches/gallery were already enriched by
// enrich-nl.mjs; what stayed empty is exactly the eu gap #298 fixed. Unlike
// the doctors' photos (whose og:image full-size variants 404, hence the
// fallback chain there), the legacy TREATMENT pages' og:image entries resolve
// at the source (24/24 verified 200), so this script follows the
// enrich-eu-images.mjs pattern:
//
//   1. treatment.heroImage ← og:image of the matching legacy dentaliva.nl page
//   2. homePage.hero.image + about.image ← com's brand photos (upload to nl)
//
// (nl has no blogPost corpus by design — /blog is not an nl route.)
//
// Same rules as the other enrich-* scripts: PATCH (never createOrReplace),
// CLI-session token, dry-run by default, `--apply` to write.
//
//   node packages/migration/enrich-nl-images.mjs            # plan only
//   node packages/migration/enrich-nl-images.mjs --apply    # write

import { readFileSync, writeFileSync } from "node:fs";

const PROJECT = "x8kdvsh2"; // nl
const COM_PROJECT = "86x2hbzv"; // com — hero/about brand photos
const DATASET = "production";
const BASE = "https://www.dentaliva.nl";
const APPLY = process.argv.includes("--apply");
const DELAY = 400;
const UA = { "User-Agent": "Mozilla/5.0 (migration; dentaliva-rebuild)" };

const TOKEN = JSON.parse(
  readFileSync(`${process.env.USERPROFILE}/.config/sanity/config.json`, "utf8"),
).authToken;
if (!TOKEN) throw new Error("no Sanity CLI session token");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) =>
  console.error(`[enrich-nl-images] ${new Date().toISOString().slice(11, 19)} ${m}`);

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

/**
 * The nl site's og:image entries can 404 on one variant while another
 * resolves (enrich-nl.mjs doctors needed the same chain); try the page's
 * URL as-is, then the full-size filename, then the eu site's copy.
 */
async function uploadWithFallback(image) {
  const candidates = [
    image,
    image.replace(/-\d+x\d+(\.\w+)$/, "$1"),
    image.replace("www.dentaliva.nl", "www.dentaliva.eu"),
  ];
  for (const candidate of candidates) {
    try {
      return await uploadImage(candidate);
    } catch (err) {
      log(`fallback: ${candidate.split("/").pop()} (${err.message})`);
    }
  }
  throw new Error(`all ${candidates.length} candidates failed for ${image}`);
}

/** com asset ref ("image-<hash>-WxH-webp") → its CDN URL on the com project. */
function comAssetUrl(ref) {
  const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  if (!m) throw new Error(`unparsable com asset ref: ${ref}`);
  return `https://cdn.sanity.io/images/${COM_PROJECT}/${DATASET}/${m[1]}-${m[2]}.${m[3]}`;
}

async function main() {
  const plan = { treatments: [], homePage: null, skipped: [] };

  // ---- 1. treatments ----------------------------------------------------
  const treatments = await groq(
    PROJECT,
    '*[_type=="treatment"]{_id, "slug": slug.current, "name": name.nl} | order(slug.current asc)',
  );
  for (const t of treatments) {
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
          asset: { _type: "reference", _ref: "PENDING" },
          alt: { _type: "localeString", nl: t.name ?? t.slug },
        },
      },
    });
    await sleep(DELAY);
  }

  // ---- 2. homePage hero + about from com brand photos --------------------
  const comHome = await groq(
    COM_PROJECT,
    '*[_type=="homePage"][0]{"heroRef": hero.image.asset._ref, "aboutRef": about.image.asset._ref}',
  );
  const home = await groq(PROJECT, '*[_type=="homePage"][0]{_id}');
  plan.homePage = {
    _id: home._id,
    hero: { source: comAssetUrl(comHome.heroRef), alt_nl: "Dentaliva Tandkliniek" },
    about: { source: comAssetUrl(comHome.aboutRef), alt_nl: "Dentaliva kliniek" },
  };

  // ---- report ------------------------------------------------------------
  console.log(`\n=== PLAN (${APPLY ? "APPLY" : "DRY-RUN"}) ===`);
  console.log(`treatments to patch : ${plan.treatments.length}`);
  console.log(`homePage images     : hero + about from com`);
  console.log(`skipped             : ${plan.skipped.length}`);
  for (const s of plan.skipped) console.log(`  SKIP ${s.type}/${s.slug}: ${s.reason}`);
  for (const t of plan.treatments) console.log(`  T ${t.slug} ← ${t.source.split("/").pop()}`);

  if (!APPLY) {
    writeFileSync("packages/migration/enrich-nl-images-plan.json", JSON.stringify(plan, null, 2));
    console.log(
      "\ndry-run: plan written to packages/migration/enrich-nl-images-plan.json (nothing written to Sanity)",
    );
    return;
  }

  // ---- apply ------------------------------------------------------------
  for (const t of plan.treatments) t.set.heroImage.asset._ref = await uploadWithFallback(t.source);
  const heroRef = await uploadImage(plan.homePage.hero.source);
  const aboutRef = await uploadImage(plan.homePage.about.source);

  const mutations = [
    ...plan.treatments.map(({ _id, set }) => ({ patch: { id: _id, set } })),
    {
      patch: {
        id: plan.homePage._id,
        set: {
          "hero.image": {
            _type: "imageWithAlt",
            asset: { _type: "reference", _ref: heroRef },
            alt: { _type: "localeString", nl: plan.homePage.hero.alt_nl },
          },
          "about.image": {
            _type: "imageWithAlt",
            asset: { _type: "reference", _ref: aboutRef },
            alt: { _type: "localeString", nl: plan.homePage.about.alt_nl },
          },
        },
      },
    },
  ];

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
    "packages/migration/enrich-nl-images-report.json",
    JSON.stringify(
      { applied: mutations.length, assets: [...assetCache.values()], ...plan },
      null,
      2,
    ),
  );
  console.log("done — report: packages/migration/enrich-nl-images-report.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
