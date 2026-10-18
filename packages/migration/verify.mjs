// MIG-5: verify the imported production dataset against the NDJSON outputs.
// Usage (packages/migration): node verify.mjs [--dataset production]
// Token: env SANITY_READ_TOKEN → apps/web/.env → Sanity CLI config.
// Exits 1 on FAIL checks; WARN items are reported but tolerated.
import { readFile } from "node:fs/promises";

import { existsSync } from "node:fs";

const args = process.argv.slice(2);
const dataset = args.includes("--dataset") ? args[args.indexOf("--dataset") + 1] : "production";
const PROJECT = process.env.MIGRATION_PROJECT_ID ?? "86x2hbzv";

/** First non-empty TR value across a doc's localized text fields. */
function trText(doc, fields) {
  for (const field of fields) {
    const value = doc[field];
    if (typeof value === "string" && value.trim()) return value; // plain string (doctor.name)
    if (value?.tr?.trim()) return value.tr;
  }
  return null;
}

/** Per-type TR text fields: string or localeString/localeText mixed by schema. */
const TR_FIELDS = {
  treatment: ["name", "summary", "body"],
  doctor: ["name", "title", "bio"],
  branch: ["name", "address"],
  blogPost: ["title", "excerpt", "body"],
  legalPage: ["title", "body"],
};

async function resolveToken() {
  if (process.env.SANITY_READ_TOKEN) return process.env.SANITY_READ_TOKEN;
  const envPath = "../../apps/web/.env";
  if (existsSync(envPath)) {
    const match = (await readFile(envPath, "utf8")).match(/SANITY_READ_TOKEN=(.+)/);
    if (match) return match[1].trim();
  }
  const cli = JSON.parse(
    await readFile(process.env.USERPROFILE + "/.config/sanity/config.json", "utf8"),
  );
  return cli.authToken;
}

const TOKEN = await resolveToken();
if (!TOKEN) throw new Error("No Sanity token found (env, apps/web/.env, CLI config)");

async function groq(query) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/data/query/${dataset}?query=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  );
  if (!res.ok) throw new Error(`query failed ${res.status}: ${await res.text()}`);
  return (await res.json()).result;
}

const ndjsonDir = "../../migration/ndjson";
const FILES = ["core.ndjson", "blog.ndjson", "redirects.ndjson"];
const ndjson = { byType: {}, ids: new Set(), redirects: [] };
for (const file of FILES) {
  for (const line of (await readFile(`${ndjsonDir}/${file}`, "utf8")).split("\n")) {
    if (!line.trim()) continue;
    const doc = JSON.parse(line);
    ndjson.byType[doc._type] = (ndjson.byType[doc._type] ?? 0) + 1;
    ndjson.ids.add(doc._id);
    if (doc._type === "redirect") ndjson.redirects.push({ from: doc.from.current, to: doc.to });
  }
}

const fails = [];
const warns = [];
const info = [];
const fail = (msg) => fails.push(msg);
const warn = (msg) => warns.push(msg);

// 1. Document counts per migrated type match the NDJSON outputs exactly.
// legalPage is authored (decision #6: KVKK adapted, not crawled) → checked
// separately below, not against the NDJSON.
const MIGRATED = ["treatment", "doctor", "branch", "blogPost", "redirect"];
const counts = await groq(
  `{${MIGRATED.map((t) => `"${t}": count(*[_type=="${t}"])`).join(", ")}, "legalPage": count(*[_type=="legalPage"])}`,
);
for (const type of MIGRATED) {
  const expected = ndjson.byType[type] ?? 0;
  if (counts[type] !== expected) {
    fail(`count mismatch ${type}: dataset ${counts[type]} ≠ NDJSON ${expected}`);
  }
}
info.push(`counts: ${JSON.stringify(counts)}`);

// 2. Every migrated _id exists in the dataset (and nothing extra of these types).
const datasetIds = new Set(
  await groq(`*[_type in ${JSON.stringify([...MIGRATED, "legalPage"])}]._id`),
);
const missing = [...ndjson.ids].filter((id) => !datasetIds.has(id));
const extra = [...datasetIds].filter((id) => !ndjson.ids.has(id));
if (missing.length) fail(`missing in dataset: ${missing.join(", ")}`);
if (extra.length) warn(`dataset-only docs (kept): ${extra.join(", ")}`);

// 3. KVKK legal page (authored): render-critical, must exist with real TR text.
const kvkk = await groq(`*[_id == "legalPage.kvkk"][0]{title, body}`);
if (!kvkk?.body?.tr || kvkk.body.tr.length < 100) {
  fail("legalPage.kvkk missing or has no usable TR body (KVKK page renders from it)");
}

// 4. Fetch migrated docs once: featured images, hotlinks, TR/EN completeness.
const docs = await groq(
  `*[_type in ${JSON.stringify([...MIGRATED, "legalPage"])}]{_id,_type,name,title,summary,body,excerpt,address,"img": coalesce(heroImage.asset._ref, photo.asset._ref)}`,
);

const noImage = docs
  .filter((d) => (d._type === "treatment" || d._type === "doctor") && !d.img)
  .map((d) => d._id);
if (noImage.length) warn(`no featured image: ${noImage.join(", ")}`);
const assetIds = new Set(await groq(`*[_type == "sanity.imageAsset"]._id`));
const usedRefs = docs.map((d) => d.img).filter(Boolean);
const dangling = [...new Set(usedRefs)].filter((ref) => !assetIds.has(ref));
if (dangling.length) fail(`asset refs without imageAsset: ${dangling.join(", ")}`);
info.push(
  `images: ${new Set(usedRefs).size} distinct assets referenced, ${assetIds.size} uploaded`,
);

// 5. Zero hotlinks to the old CDN anywhere in migrated text.
const hotlinks = JSON.stringify(docs).match(/dentaliva\.com\/wp-content/g) ?? [];
if (hotlinks.length) fail(`hotlinks to old CDN in dataset text: ${hotlinks.length}`);

// 6. TR completeness + EN placeholder policy (EN authored fresh; empty = OK).
// redirect docs are from→to pairs — no text by design.
const thinTr = docs
  .filter((d) => d._type !== "redirect" && !trText(d, TR_FIELDS[d._type] ?? []))
  .map((d) => d._id);
if (thinTr.length) warn(`no TR text in expected fields: ${thinTr.join(", ")}`);
const enFields = docs.flatMap((d) =>
  Object.entries(d)
    .filter(([, v]) => v?.en?.trim())
    .map(([k]) => `${d._id}.${k}`),
);
info.push(
  `EN placeholder policy: ${enFields.length} EN value(s) (${enFields.join(", ") || "none"}) — EN is authored fresh; PGT-9 fallback renders TR`,
);

// 7. Redirect from-slugs are unique.
const froms = ndjson.redirects.map((r) => r.from);
const dupes = froms.filter((f, i) => froms.indexOf(f) !== i);
if (dupes.length) fail(`duplicate redirect from-slugs: ${[...new Set(dupes)].join(", ")}`);

// ===== CPT-7: junk corpus + completeness gates =====
// Dataset'e karşı koşar; CPT-8 import'unun kalite kanıtıdır.
const JUNK_CORPUS = [
  "Hakkımızda İnsan Kaynakları",
  "Tüm hakları saklıdır",
  "Dentaliva Studio",
  "Şubelerimiz Avcılar Başakşehir Altunizade",
];

const junkQuery = encodeURIComponent(
  `*[_type in ["treatment","doctor","branch","blogPost","legalPage"]]{
    _id, name, title, summary, body, excerpt, bio, address
  }`,
);
const junkRes = await fetch(
  `https://${PROJECT}.api.sanity.io/v1/data/query/${dataset}?query=${junkQuery}`,
  { headers: { Authorization: `Bearer ${TOKEN}` } },
);
if (junkRes.ok) {
  const docs2 = (await junkRes.json()).result ?? [];
  for (const doc of docs2) {
    const haystack = JSON.stringify(doc);
    for (const junk of JUNK_CORPUS) {
      if (haystack.includes(junk)) fail(`${doc._id}: junk corpus hit "${junk}"`);
    }
  }
}

// Completeness (CPT-2..4 çıktılarının kalıcılığı)
const completeness = await groq(`{
  "doctorsWithTitle": count(*[_type=="doctor" && defined(title) && title != ""]),
  "doctors": count(*[_type=="doctor"]),
  "doctorsWithBio": count(*[_type=="doctor" && defined(bio)]),
  "branchesWithPhone": count(*[_type=="branch" && defined(phone) && phone != ""]),
  "branchesWithAddress": count(*[_type=="branch" && defined(address)]),
  "branches": count(*[_type=="branch"]),
  "homePage": count(*[_type=="homePage" && defined(hero.headline) && defined(about.title) && defined(cta.title)]),
  "videoTestimonials": count(*[_type=="testimonial" && defined(youtubeId)]),
  "googleReviews": count(*[_type=="testimonial" && source=="Google"]),
  "faqs": count(*[_type=="faq"]),
  "homeFaqs": count(*[_type=="faq" && displayOnHome == true]),
  "treatmentsWithFaqs": count(*[_type=="treatment" && defined(faqs)])
}`);
const expectAtLeast = (label, value, min) => {
  if (value < min) fail(`${label}: ${value} < ${min}`);
};
expectAtLeast("doctorsWithTitle", completeness.doctorsWithTitle ?? 0, 19);
expectAtLeast("doctorsWithBio", completeness.doctorsWithBio ?? 0, 19);
expectAtLeast("branchesWithPhone", completeness.branchesWithPhone ?? 0, 3);
expectAtLeast("branchesWithAddress", completeness.branchesWithAddress ?? 0, 3);
expectAtLeast("homePage", completeness.homePage ?? 0, 1);
expectAtLeast("videoTestimonials", completeness.videoTestimonials ?? 0, 6);
expectAtLeast("googleReviews", completeness.googleReviews ?? 0, 8);
expectAtLeast("faqs", completeness.faqs ?? 0, 30);
expectAtLeast("homeFaqs", completeness.homeFaqs ?? 0, 6);
expectAtLeast("treatmentsWithFaqs", completeness.treatmentsWithFaqs ?? 0, 20);
info.push(`completeness: ${JSON.stringify(completeness)}`);

console.log(`dataset: ${PROJECT}/${dataset}`);
for (const line of info) console.log(`ℹ️  ${line}`);
for (const line of warns) console.log(`⚠️  WARN ${line}`);
for (const line of fails) console.error(`❌ FAIL ${line}`);
if (fails.length) {
  console.error(`verify: ${fails.length} failure(s)`);
  process.exit(1);
}
console.log(`verify: OK (${warns.length} warning(s))`);
