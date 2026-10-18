// ONE-OFF (INT milestone 12 follow-up): dentaliva.eu CRM enrichment + images.
// The eu crawl produced name+slug stubs; this script pulls the structured
// fields and photos from the live site and patches the eu dataset
// (84n9qnfg/production) — the eu analog of the com enrich-*.mjs scripts.
//   MIGRATION_PROJECT_ID=84n9qnfg node enrich-eu.mjs
// Token: Sanity CLI session (project-scoped API tokens cannot write).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PROJECT = process.env.MIGRATION_PROJECT_ID ?? "84n9qnfg";
const DATASET = process.env.MIGRATION_DATASET ?? "production";
const BASE = "https://www.dentaliva.eu";
const TOKEN = JSON.parse(
  readFileSync(join(homedir(), ".config", "sanity", "config.json"), "utf8"),
).authToken;
const UA = { "User-Agent": "Mozilla/5.0 (migration; dentaliva-rebuild)" };
const DELAY = 400;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) => console.error(`[enrich-eu] ${new Date().toISOString().slice(11, 19)} ${m}`);

async function fetchText(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.text();
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function ogImage(html) {
  return (html.match(/<meta property="og:image" content="([^"]+)"/) ?? [])[1];
}

/** Download an image and upload it as a Sanity asset; returns the asset ref. */
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
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": mime },
      body,
    },
  );
  if (!up.ok) throw new Error(`upload ${filename} → ${up.status} ${await up.text()}`);
  const json = await up.json();
  const ref = json.document._id;
  assetCache.set(url, ref);
  log(`asset: ${filename} → ${ref}`);
  return ref;
}

/**
 * Surgical updates: enrichments must PATCH, never createOrReplace — the
 * stub docs carry name/slug (and homePage carries the editor's sections)
 * that a full replace would silently delete. New docs (testimonials) use
 * createIfNotExists so re-runs never overwrite editor changes.
 */
async function patch(sets, createDocs = []) {
  const mutations = [
    ...sets.map(({ _id, ...fields }) => ({ patch: { id: _id, set: fields } })),
    ...createDocs.map((doc) => ({ createIfNotExists: doc })),
  ];
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/data/mutate/${DATASET}?returnDocuments=false`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations }),
    },
  );
  if (!res.ok) throw new Error(`mutate → ${res.status} ${await res.text()}`);
}

// ---------------------------------------------------------------- doctors
const doctorLabels = [
  "Professional Interests",
  "Education",
  "Courses",
  "Congresses",
  "Publications",
  "Memberships",
  "Certifications",
  "Languages",
  "Place of Birth",
];

function doctorBio(html) {
  const text = textOf(html);
  const marks = doctorLabels
    .map((label) => {
      // LAST occurrence: navigation/mobile duplicates precede the profile.
      const at = text.lastIndexOf(label);
      return at === -1 ? null : { label, at };
    })
    .filter(Boolean)
    .sort((a, b) => a.at - b.at);
  const parts = [];
  for (let i = 0; i < marks.length; i += 1) {
    const { label, at } = marks[i];
    const end = i + 1 < marks.length ? marks[i + 1].at : Math.min(text.length, at + 1200);
    const body = text
      .slice(at + label.length, end)
      .replace(/^[:\s]+/, "")
      .trim();
    if (body) parts.push(`${label}: ${body.split("\n").filter(Boolean).join(" ")}`);
  }
  return parts.join("\n\n").slice(0, 5000);
}

const doctors = JSON.parse(readFileSync("migration/normalized-eu/doctor.json", "utf8"));
const doctorDocs = [];
for (const page of doctors) {
  const slug = new URL(page.url).pathname.split("/").filter(Boolean).pop();
  const html = await fetchText(page.url);
  await sleep(DELAY);
  const image = ogImage(html);
  const doc = {
    _id: `doctor.${slug}`,
    // The source team cards title every doctor "Dental Spceialist" (sic);
    // store the corrected form — com keeps its real per-doctor titles.
    title: { en: "Dental Specialist" },
    bio: { en: doctorBio(html) },
  };
  if (image) {
    doc.photo = {
      _type: "image",
      asset: { _type: "reference", _ref: await uploadImage(image) },
      alt: { en: `${page.h1 ?? slug} — portrait` },
    };
  }
  doctorDocs.push(doc);
  log(`doctor: ${slug} (bio ${doc.bio.en.length} chars, photo ${image ? "yes" : "no"})`);
}
await patch(doctorDocs);
log(`doctors patched: ${doctorDocs.length}`);

// ---------------------------------------------------------------- branches
const BRANCH_NAP = {
  avcilar: {
    address: "Üniversite Mahallesi Londra Asfaltı E5 Yanyol Çimli Sokak No:24 Avcılar/İstanbul",
    phone: "+90 530 840 5482",
  },
  basaksehir: {
    address: "Başakşehir Mahallesi Hürriyet Bulvarı No:131/A 34306 Başakşehir/İstanbul",
    phone: "+90 507 624 9120",
  },
  altunizade: {
    address: "Altunizade Mahallesi Nuhkuyusu Caddesi No:90/B 34662 Üsküdar/İstanbul",
    phone: "+90 216 555 54 82",
  },
};
const HOURS_EN = "Every day 09:00–23:00";
const mapUrl = (address) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Dentaliva " + address)}`;

const branches = JSON.parse(readFileSync("migration/normalized-eu/branch.json", "utf8"));
const branchDocs = [];
for (const page of branches) {
  const slug = new URL(page.url).pathname.split("/").filter(Boolean).pop();
  const nap = BRANCH_NAP[slug];
  if (!nap) throw new Error(`unknown branch slug: ${slug}`);
  const html = await fetchText(page.url);
  await sleep(DELAY);
  const image = ogImage(html);
  const doc = {
    _id: `branch.${slug}`,
    // Source branch map links all point at the Başakşehir listing; build
    // correct per-branch links from the address instead.
    address: { en: nap.address },
    phone: nap.phone,
    hours: { en: HOURS_EN },
    mapUrl: mapUrl(nap.address),
  };
  if (image) {
    doc.image = {
      _type: "image",
      asset: { _type: "reference", _ref: await uploadImage(image) },
      alt: { en: `Dentaliva ${slug} clinic` },
    };
  }
  branchDocs.push(doc);
  log(`branch: ${slug}`);
}
await patch(branchDocs);
log(`branches patched: ${branchDocs.length}`);

// ------------------------------------------------------------ testimonials
const home = await fetchText(BASE + "/");
await sleep(DELAY);
const videoIds = [
  ...new Set(
    [...home.matchAll(/youtube\.com\/(?:embed\/|watch\?v=)([A-Za-z0-9_-]{8,15})/g)].map(
      (m) => m[1],
    ),
  ),
];
const videoDocs = [];
for (const id of videoIds) {
  const meta = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
    { headers: UA },
  )
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  await sleep(DELAY);
  videoDocs.push({
    _id: `testimonial.video-${id}`,
    _type: "testimonial",
    author: meta?.author_name ?? "Dentaliva",
    quote: { en: meta?.title ?? "Patient video review" },
    youtubeId: id,
    source: "YouTube",
  });
  log(`video: ${id} — ${meta?.title ?? "?"}`);
}
await patch([], videoDocs); // create-if-missing (re-runs keep editor edits)
log(`video testimonials patched: ${videoDocs.length}`);

// ---------------------------------------------------------------- gallery
const galleryHtml = await fetchText(BASE + "/image-gallery/");
await sleep(DELAY);
const galleryUrls = [
  ...new Set(
    [
      ...galleryHtml.matchAll(
        /https:\/\/www\.dentaliva\.eu\/wp-content\/uploads\/[^"' )]+\.(?:jpg|jpeg|png|webp)/g,
      ),
    ].map((m) => m[0]),
  ),
].filter((url) => !/logo|icon|favicon/i.test(url));
const gallery = [];
let n = 0;
for (const url of galleryUrls) {
  n += 1;
  try {
    gallery.push({
      _key: `gal${n}`,
      _type: "image",
      asset: { _type: "reference", _ref: await uploadImage(url) },
      alt: { en: `Dentaliva clinic — photo ${n}` },
    });
  } catch (err) {
    log(`gallery skip ${url}: ${err.message}`);
  }
}
await sleep(DELAY);
await patch([{ _id: "homePage", gallery }]);
log(`gallery patched: ${gallery.length} images`);

// Persist the asset map next to the com one (committed record).
mkdirSync("migration", { recursive: true });
writeFileSync(
  "migration/eu-enrich-asset-map.json",
  JSON.stringify(
    {
      images: Object.fromEntries(assetCache),
      counts: {
        doctors: doctorDocs.length,
        branches: branchDocs.length,
        videos: videoDocs.length,
        gallery: gallery.length,
      },
    },
    null,
    2,
  ),
);
log("DONE");
