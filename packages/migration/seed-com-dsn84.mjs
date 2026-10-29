#!/usr/bin/env node
/**
 * DSN-84 — com anasayfa v2 CMS tohumu (yalnız EKSİK/yeni alanlar).
 *
 * enrich-* ailesi deseni: PATCH-never-replace, dry-run default (--apply ile
 * yazar), idempotent (hedef değerdeyse no-op). com dataset'inde homePage
 * yalnız drafts.homePage olarak var (DSN-77 dersi (a)) — build draft'ı
 * okur, patch de draft'a yazılır.
 *
 * Dokunulanlar:
 *  - hero.eyebrow / hero.body        (yeni alanlar — doküman #01 TR)
 *  - hero.sideImages                 (yeni alan — homePage.gallery'nin ilk
 *                                     2 karesi; Aaron Studio'dan değiştirir)
 *  - teamSection.eyebrow/heading/    (doküman #14 TR; mevcut değerce
 *    ctaLabel                          aynıysa no-op)
 *
 * Bilinçli DOKUNULMAYANLAR (raporda listelenir):
 *  - sectionHeadings.* (DSN-61..77'de dokümandan çevrilmiş durumda)
 *  - trustStrip (4,6★/93 Avcılar şube kartı verisi; marka geneli puan
 *    kararı Aaron'da — uydurma gösterge kuralı)
 *  - onceSonraCases[].meta (placeholder vakalara künye uydurulmaz)
 *  - travelStay.image (görsel kararı Aaron'da)
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

// pnpm strict resolution: @sanity/client yalnız apps/web'de declared
// (DSN-45 dersi) — resolve base'i web paketi yapılır.
const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { createClient } = require("@sanity/client");

const APPLY = process.argv.includes("--apply");
const PROJECT_ID = process.env.MIGRATION_PROJECT_ID ?? "86x2hbzv";
const DATASET = process.env.MIGRATION_DATASET ?? "production";
const API_VERSION = "2024-10-01";

function readToken() {
  // Sanity CLI oturum token'ı (#200 deseni): config.json'da token düz string
  // olabileceği gibi {value} sarmalısında da olabilir.
  for (const p of [
    join(homedir(), ".config", "sanity", "config.json"),
    join(homedir(), "AppData", "Local", "sanity", "config.json"),
  ]) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8"));
      const tok =
        raw.authToken && typeof raw.authToken === "object"
          ? (raw.authToken.value ?? null)
          : (raw.authToken ?? null);
      const alt = typeof raw === "string" ? raw : null;
      if (typeof tok === "string" && tok.length > 10) return tok;
      if (typeof alt === "string" && alt.length > 10) return alt;
    } catch {
      /* sonraki yol */
    }
  }
  console.error("Sanity CLI oturum token'ı bulunamadı (config.json yolları tarandı).");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: readToken(),
  useCdn: false,
});

// Ana doküman: com'da published homePage yok, draft var (DSN-77 dersi (a)).
async function resolveHomePage() {
  const draft = await client.fetch(
    `*[_type == "homePage" && _id == "drafts.homePage"][0]{_id, "galleryRefs": gallery[].asset._ref}`,
  );
  if (draft) return { id: draft._id, galleryRefs: draft.galleryRefs ?? [] };
  const published = await client.fetch(
    `*[_type == "homePage"][0]{_id, "galleryRefs": gallery[].asset._ref}`,
  );
  if (!published) {
    console.error("homePage dokümanı bulunamadı.");
    process.exit(1);
  }
  console.log(
    `UYARI: published homePage kullanılıyor (${published._id}) — com'da draft beklenirdi.`,
  );
  return { id: published._id, galleryRefs: published.galleryRefs ?? [] };
}

// Hero sağ kartları dikey 3/4 kutuda render edilir — adaylar en az 1000px
// yükseklikteki KARE/portre klinik fotoları olsun (DSN-83 dis-genel
// kütüphanesi 1080x1080). Yetersiz aday yoksa galeri ilk 2'ye düşer.
async function pickSideImages(galleryRefs) {
  const tall = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename match "dis-genel-*" && metadata.dimensions.height >= 1000] | order(_createdAt asc) [0...4]{"ref": _id, "h": metadata.dimensions.height, "w": metadata.dimensions.width}`,
  );
  if (tall.length >= 2) return tall.slice(0, 2).map((a) => a.ref);
  return galleryRefs.filter(Boolean).slice(0, 2);
}

const targets = {
  eyebrow: "İleri Diş Hekimliği Gülüş Tasarımıyla Buluşuyor",
  body: "Gerçek dönüşümleri görün, arkasındaki tedavileri keşfedin ve görünüşünüzü ve hissinizi değiştiren bir gülüşe giden ilk adımı atın.",
  teamEyebrow: "Her Gülüşün Arkasındaki Uzmanlık",
  teamHeading: "Dönüşümünüzün Arkasındaki Diş Hekimlerini Tanıyın",
  teamCta: "Ekibimizle Tanışın",
};

const diff = [];

function plan(path, current, next, note = "") {
  const same = JSON.stringify(current) === JSON.stringify(next);
  diff.push({ path, current: current ?? null, next, same, note });
  return !same;
}

const home = await resolveHomePage();
const doc = await client.getDocument(home.id);

// 1) hero.eyebrow / hero.body — yeni alanlar (localeString/localeText .tr)
const heroPatch = {};
if (plan("hero.eyebrow.tr", doc.hero?.eyebrow?.tr, targets.eyebrow)) {
  heroPatch["hero.eyebrow"] = {
    _type: "localeString",
    tr: targets.eyebrow,
    en: doc.hero?.eyebrow?.en,
  };
}
if (plan("hero.body.tr", doc.hero?.body?.tr, targets.body)) {
  heroPatch["hero.body"] = { _type: "localeText", tr: targets.body, en: doc.hero?.body?.en };
}

// 2) hero.sideImages — kare/portre klinik fotoları (Studio'dan değiştirilebilir).
const sideRefs = await pickSideImages(home.galleryRefs);
if (sideRefs.length === 2) {
  const currentRefs = (doc.hero?.sideImages ?? []).map((i) => i?.asset?._ref ?? null);
  const sameSides =
    currentRefs.length === 2 && currentRefs[0] === sideRefs[0] && currentRefs[1] === sideRefs[1];
  diff.push({
    path: "hero.sideImages",
    current: currentRefs,
    next: sideRefs,
    same: sameSides,
    note: "dis-genel kütüphanesinden 1080px+ kareler (Studio'dan değiştirilebilir)",
  });
  if (!sameSides) {
    heroPatch["hero.sideImages"] = sideRefs.map((ref) => ({
      _type: "image",
      asset: { _type: "reference", _ref: ref },
    }));
  }
} else {
  diff.push({
    path: "hero.sideImages",
    current: null,
    next: null,
    same: true,
    note: "galeride 2 kare yok — atlandı (split yerine v1 full-bleed)",
  });
}

// 3) teamSection eyebrow/heading/ctaLabel
const teamPatch = {};
if (plan("teamSection.eyebrow.tr", doc.teamSection?.eyebrow?.tr, targets.teamEyebrow)) {
  teamPatch["teamSection.eyebrow"] = {
    _type: "localeString",
    tr: targets.teamEyebrow,
    en: doc.teamSection?.eyebrow?.en,
  };
}
if (plan("teamSection.heading.tr", doc.teamSection?.heading?.tr, targets.teamHeading)) {
  teamPatch["teamSection.heading"] = {
    _type: "localeString",
    tr: targets.teamHeading,
    en: doc.teamSection?.heading?.en,
  };
}
if (plan("teamSection.ctaLabel.tr", doc.teamSection?.ctaLabel?.tr, targets.teamCta)) {
  teamPatch["teamSection.ctaLabel"] = {
    _type: "localeString",
    tr: targets.teamCta,
    en: doc.teamSection?.ctaLabel?.en,
  };
}

console.log(
  `\n=== DSN-84 seed planı — ${PROJECT_ID}/${DATASET} → ${home.id} (${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`,
);
for (const d of diff) {
  const mark = d.same ? "  =  " : "  →  ";
  console.log(`${mark}${d.path}`);
  if (!d.same) {
    console.log(`        mevcut: ${JSON.stringify(d.current)}`);
    console.log(`        hedef : ${JSON.stringify(d.next)}${d.note ? `   (${d.note})` : ""}`);
  } else if (d.note) {
    console.log(`        ${d.note}`);
  }
}

const patches = { ...heroPatch, ...teamPatch };
const changes = Object.keys(patches).length;
console.log(`\n${changes} alan değişecek, ${diff.length - changes} no-op.\n`);

if (!APPLY) {
  console.log("Dry-run — yazmak için: node packages/migration/seed-com-dsn84.mjs --apply");
  process.exit(0);
}

if (changes === 0) {
  console.log("Yazılacak değişiklik yok.");
  process.exit(0);
}

await client.patch(home.id).set(patches).commit();
console.log(`OK — ${changes} alan yazıldı. Doğrulama: homePageQuery projeksiyonuyla site build'i.`);
