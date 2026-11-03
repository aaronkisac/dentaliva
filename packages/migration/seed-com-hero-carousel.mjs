#!/usr/bin/env node
/**
 * DSN-89 — com hero banner carousel tohumu.
 *
 * enrich-* ailesi deseni: PATCH-never-replace, dry-run default (--apply ile
 * yazar), idempotent (hedef değerdeyse no-op). com dataset'inde homePage
 * yalnız drafts.homePage olarak var (DSN-77 dersi (a)) — build draft'ı
 * okur, patch de draft'a yazılır.
 *
 * Dokunulanlar:
 *  - hero.interval                    (5 saniye — Aaron Studio'dan değiştirir)
 *  - hero.banners                     (3 örnek banner: mevcut split hero
 *                                     copy'si + full-bleed + medilo varyantı;
 *                                     içerik mevcut hero alanlarından
 *                                     türetilir)
 *
 * KORUMA: Studio'da banners elle düzenlenmişse (dizi doluysa) script EZMEZ —
 * ezmek için --force şart (DSN-83 sections ezme dersi).
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
const FORCE = process.argv.includes("--force");
const PROJECT_ID = process.env.MIGRATION_PROJECT_ID ?? "86x2hbzv";
const DATASET = process.env.MIGRATION_DATASET ?? "production";
const API_VERSION = "2024-10-01";
const INTERVAL = 5;

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
  const draft = await client.fetch(`*[_type == "homePage" && _id == "drafts.homePage"][0]{_id}`);
  if (draft) return draft._id;
  const published = await client.fetch(`*[_type == "homePage"][0]{_id}`);
  if (!published) {
    console.error("homePage dokümanı bulunamadı.");
    process.exit(1);
  }
  console.log(
    `UYARI: published homePage kullanılıyor (${published._id}) — com'da draft beklenirdi.`,
  );
  return published._id;
}

const homeId = await resolveHomePage();
const doc = await client.getDocument(homeId);
const hero = doc.hero ?? {};

const diff = [];

function plan(path, current, next, note = "") {
  const same = JSON.stringify(current) === JSON.stringify(next);
  diff.push({ path, current: current ?? null, next, same, note });
  return !same;
}

const patches = {};

// 1) hero.interval — banner geçiş süresi (saniye).
if (plan("hero.interval", hero.interval, INTERVAL)) {
  patches["hero.interval"] = INTERVAL;
}

// 2) hero.banners — mevcut hero içeriğinden 2 örnek banner türetilir.
if (Array.isArray(hero.banners) && hero.banners.length > 0 && !FORCE) {
  diff.push({
    path: "hero.banners",
    current: `${hero.banners.length} banner (Studio'da elle düzenlenmiş)`,
    next: null,
    same: true,
    note: "elle düzenlenmiş dizi EZİLMEDİ — ezmek için --force",
  });
} else {
  const banners = [];
  const headline = hero.headline;
  if (headline?.tr || headline?.en || headline?.nl) {
    const bannerSplit = {
      _type: "heroBanner",
      _key: "banner-split",
      variant: "split",
      eyebrow: hero.eyebrow,
      headline,
      body: hero.body,
      sideImages: hero.sideImages ?? [],
    };
    if (Array.isArray(bannerSplit.sideImages) && bannerSplit.sideImages.length > 0) {
      banners.push(bannerSplit);
    }
    if (hero.image?.asset?._ref) {
      banners.push({
        _type: "heroBanner",
        _key: "banner-bleed",
        variant: "full-bleed",
        headline,
        image: hero.image,
      });
      // DSN-90: Medilo varyantı örneği — vurgu başlığın son cümlesinden,
      // bilgi bloğu başlığı fonksiyonel taslak (Aaron Studio'dan düzenler).
      banners.push({
        _type: "heroBanner",
        _key: "banner-medilo",
        variant: "medilo",
        headline,
        highlight: { _type: "localeString", tr: "Gülüş Dönüşümü." },
        body: hero.body,
        calloutTitle: { _type: "localeString", tr: "Randevu için bizi arayın" },
        image: hero.image,
      });
    }
  }
  if (banners.length === 0) {
    diff.push({
      path: "hero.banners",
      current: null,
      next: null,
      same: true,
      note: "türetme malzemesi yok (headline/sideImages/image boş) — atlandı",
    });
  } else {
    if (
      plan("hero.banners", hero.banners ?? null, banners, "split + full-bleed + medilo örnekleri")
    ) {
      patches["hero.banners"] = banners;
    }
  }
}

console.log(
  `\n=== DSN-89 hero carousel seed planı — ${PROJECT_ID}/${DATASET} → ${homeId} (${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`,
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

const changes = Object.keys(patches).length;
console.log(`\n${changes} alan değişecek, ${diff.length - changes} no-op.\n`);

if (!APPLY) {
  console.log("Dry-run — yazmak için: node packages/migration/seed-com-hero-carousel.mjs --apply");
  process.exit(0);
}

if (changes === 0) {
  console.log("Yazılacak değişiklik yok.");
  process.exit(0);
}

await client.patch(homeId).set(patches).commit();
console.log(`OK — ${changes} alan yazıldı. Doğrulama: homePageQuery projeksiyonuyla site build'i.`);
