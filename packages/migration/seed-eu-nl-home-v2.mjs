#!/usr/bin/env node
/**
 * DSN-98 Wave B — eu/nl home v2 tohumu (com'un DSN-84/89/90 alanları).
 *
 * Aaron: "tüm değişiklikleri diğer domainlere de uygula" — com'da seed'lenen
 * hero carousel + DSN-84 hero alanları eu/nl dataset'lerine EN/NL copy ile
 * yazılır. enrich-* ailesi deseni: dry-run default (--apply ile yazar),
 * idempotent (hedef değerdeyse no-op; Studio'da elle düzenlenmiş banners
 * dizisi --force olmadan EZİLMEZ — DSN-89 dersi).
 *
 * Kullanım:
 *   node packages/migration/seed-eu-nl-home-v2.mjs            # dry-run ×2
 *   node packages/migration/seed-eu-nl-home-v2.mjs --apply    # yaz ×2
 *   node packages/migration/seed-eu-nl-home-v2.mjs --site eu  # tek site
 *
 * Notlar:
 *  - com'un sideImages asset'leri (1080×1080 ×2) eu/nl dataset'lerinde YOK
 *    (probe: boş) — --apply modunda com CDN'inden indirilip hedefe upload
 *    edilir. Dry-run YAN ETKİSİZDIR: ref alanında com id'si gösterilir,
 *    upload yapılmaz. Rerun'da zaten seed'li sideImages (key+alt eşleşmesi)
 *    tekrar upload tetiklemez.
 *  - alt metinler yalnız stüdyo-görünür locale slotuna yazılır (DSN-96 F1:
 *    imageWithAlt.alt validator'ı stüdyo slotu ister — boş bırakılırsa
 *    Studio'da DÜZELTİLEMEZ hata oluşur).
 *  - full-bleed/medilo banner görseli sitenin KENDİ hero.image'idir
 *    (e93f1d86 2400×1400 — probe: eu/nl'de mevcut).
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { createClient } = require("@sanity/client");

const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const SITE_ARG = process.argv.includes("--site")
  ? process.argv[process.argv.indexOf("--site") + 1]
  : null;
const INTERVAL = 3; // com'da Aaron Studio'dan 5→3 çekti (DSN-89 prod notu) — marka tercihi.
const COM_PROJECT = "86x2hbzv";
const COM_DATASET = "production";
const SIDE_SOURCE_IDS = [
  "image-52b6b01b3cb8f94afae672466df73e80edcf3364-1080x1080-webp",
  "image-bbd8466d74d0559bdaaae936d8fed3c2bd09941e-1080x1080-webp",
];
const SIDE_KEYS = ["side-52b6b01b3cb8", "side-bbd8466d74d0"];

const SITES = [
  {
    id: "eu",
    projectId: "84n9qnfg",
    locale: "en",
    eyebrow: "Advanced Dentistry Meets Smile Design",
    body: "See real transformations, explore the treatments behind them, and take the first step toward a smile that changes how you look and feel.",
    highlight: "Designed for You",
    calloutTitle: "Call us for an appointment",
    ctaLabel: "Meet the Team",
    sideAlt: "Dentaliva dental clinic",
  },
  {
    id: "nl",
    projectId: "x8kdvsh2",
    locale: "nl",
    eyebrow: "Geavanceerde tandheelkunde ontmoet glimlachontwerp",
    body: "Bekijk echte transformaties, ontdek de behandelingen erachter en zet de eerste stap naar een glimlach die verandert hoe je eruitziet en je voelt.",
    highlight: "met zorg ontworpen",
    calloutTitle: "Bel ons voor een afspraak",
    ctaLabel: "Maak kennis met het team",
    sideAlt: "Dentaliva tandkliniek",
  },
];

function readToken() {
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
      if (typeof tok === "string" && tok.length > 10) return tok;
    } catch {
      /* sonraki yol */
    }
  }
  console.error("Sanity CLI oturum token'ı bulunamadı (config.json yolları tarandı).");
  process.exit(1);
}

const token = readToken();

function makeClient(projectId) {
  return createClient({
    projectId,
    dataset: "production",
    apiVersion: "2024-10-01",
    token,
    useCdn: false,
  });
}

const sites = SITE_ARG ? SITES.filter((s) => s.id === SITE_ARG) : SITES;
if (sites.length === 0) {
  console.error(`Bilinmeyen --site "${SITE_ARG}" (eu|nl).`);
  process.exit(1);
}

const uploadMemo = new Map();

/**
 * com asset'ini hedef dataset'e getirir ve ref döner. --apply'sız (dry-run)
 * yan etkisizdir: com id'si olduğu gibi döner. Memo ANAHTARI projeyi içerir —
 * aynı com id farklı projelere AYRI yüklenir (eu'ya yüklenen asset nl'de
 * yoktur; Sanity asset referansları dataset-kapsamlıdır).
 */
async function resolveSideRef(target, comAssetId, projectKey) {
  const memoKey = `${projectKey}:${comAssetId}`;
  if (APPLY && uploadMemo.has(memoKey)) return uploadMemo.get(memoKey);
  if (!APPLY) return comAssetId;
  const match = comAssetId.match(/^image-(.+)-(\d+x\d+)-([a-z]+)$/);
  if (!match) throw new Error(`asset id çözülemedi: ${comAssetId}`);
  const url = `https://cdn.sanity.io/images/${COM_PROJECT}/${COM_DATASET}/${match[1]}-${match[2]}.${match[3]}`;
  console.log(`  com CDN'den indiriliyor: ${match[1]}-${match[2]}.${match[3]}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`com CDN indirme başarısız (${res.status}): ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await target.assets.upload("image", buffer, {
    filename: `${match[1]}-${match[2]}.${match[3]}`,
    contentType: `image/${match[3]}`,
  });
  console.log(`  asset yüklendi: ${asset._id}`);
  uploadMemo.set(memoKey, asset._id);
  return asset._id;
}

function plan(diff, path, current, next, note = "") {
  const same = JSON.stringify(current) === JSON.stringify(next);
  diff.push({ path, current: current ?? null, next, same, note });
  return !same;
}

/** Ref listesindeki asset'lerin tamamı hedef dataset'te var mı? */
async function refsExist(client, refs) {
  const ids = (refs ?? []).map((r) => r?.asset?._ref).filter(Boolean);
  if (ids.length === 0) return false;
  const found = await client.fetch(`count(*[_id in $ids])`, { ids });
  return found === ids.length;
}

for (const site of sites) {
  const client = makeClient(site.projectId);
  console.log(`\n########## ${site.id} (${site.projectId}) ##########`);

  const home =
    (await client.fetch(`*[_type == "homePage" && _id == "drafts.homePage"][0]{_id}`)) ??
    (await client.fetch(`*[_type == "homePage"][0]{_id}`));
  if (!home) {
    console.error("homePage dokümanı bulunamadı — atlanıyor.");
    continue;
  }
  const doc = await client.getDocument(home._id);
  const hero = doc.hero ?? {};
  const diff = [];
  const patches = {};

  // 1) hero.interval — com'un Aaron tercihi (5→3).
  if (plan(diff, "hero.interval", hero.interval ?? null, INTERVAL)) {
    patches["hero.interval"] = INTERVAL;
  }

  // 2) hero.eyebrow + hero.body (legacy hero alanları — banners boşalrsa
  //    fallback sahneyi besler; DSN-84 deseni).
  const eyebrowObj = { _type: "localeString", [site.locale]: site.eyebrow };
  if (plan(diff, "hero.eyebrow", hero.eyebrow ?? null, eyebrowObj)) {
    patches["hero.eyebrow"] = eyebrowObj;
  }
  const bodyObj = { _type: "localeText", [site.locale]: site.body };
  if (plan(diff, "hero.body", hero.body ?? null, bodyObj)) {
    patches["hero.body"] = bodyObj;
  }

  // 3) hero.sideImages — zaten seed'liyse (key+alt eşleşiyor VE asset'ler
  //    hedef dataset'te var) upload'sız no-op; değilse com kaynak
  //    id'lerinden ref çöz.
  const alreadySide =
    Array.isArray(hero.sideImages) &&
    hero.sideImages.length === SIDE_SOURCE_IDS.length &&
    hero.sideImages.every(
      (img, i) => img?._key === SIDE_KEYS[i] && img?.alt?.[site.locale] === site.sideAlt,
    ) &&
    (await refsExist(client, hero.sideImages));
  let sideRefs;
  if (alreadySide) {
    sideRefs = hero.sideImages;
    plan(diff, "hero.sideImages", sideRefs, sideRefs, "zaten seed'li — upload yok");
  } else {
    sideRefs = [];
    for (let i = 0; i < SIDE_SOURCE_IDS.length; i++) {
      const ref = await resolveSideRef(client, SIDE_SOURCE_IDS[i], site.projectId);
      sideRefs.push({
        _type: "image",
        _key: SIDE_KEYS[i],
        asset: { _type: "reference", _ref: ref },
        alt: { _type: "localeString", [site.locale]: site.sideAlt },
      });
    }
    if (plan(diff, "hero.sideImages", hero.sideImages ?? null, sideRefs)) {
      patches["hero.sideImages"] = sideRefs;
    }
  }

  // 4) teamSection.ctaLabel — yalnız eksik alan (mevcut eyebrow/heading
  //    eu/nl'in kendi lokalize copy'si; ezilmez).
  const team = doc.teamSection ?? {};
  const ctaObj = { _type: "localeString", [site.locale]: site.ctaLabel };
  if (plan(diff, "teamSection.ctaLabel", team.ctaLabel ?? null, ctaObj)) {
    patches["teamSection.ctaLabel"] = ctaObj;
  }

  // 5) hero.banners — split + full-bleed + medilo (com DSN-89/90 deseni,
  //    site kendi headline'ı + kendi hero görseliyle).
  if (Array.isArray(hero.banners) && hero.banners.length > 0 && !FORCE) {
    diff.push({
      path: "hero.banners",
      current: `${hero.banners.length} banner (Studio'da elle düzenlenmiş)`,
      next: null,
      same: true,
      note: "elle düzenlenmiş dizi EZİLMEDİ — ezmek için --force",
    });
  } else {
    const headline = hero.headline;
    const hasLocale = Boolean(headline && headline[site.locale]);
    if (!hasLocale || !hero.image?.asset?._ref) {
      diff.push({
        path: "hero.banners",
        current: null,
        next: null,
        same: true,
        note: "headline/image eksik — atlandı",
      });
    } else {
      if (!headline[site.locale].includes(site.highlight)) {
        throw new Error(
          `${site.id}: highlight "${site.highlight}" headline içinde yok (medilo vurgusu kırılır)`,
        );
      }
      const image = { _type: "image", asset: { _type: "reference", _ref: hero.image.asset._ref } };
      const banners = [
        {
          _type: "heroBanner",
          _key: "banner-split",
          variant: "split",
          eyebrow: eyebrowObj,
          headline,
          body: bodyObj,
          sideImages: sideRefs,
        },
        {
          _type: "heroBanner",
          _key: "banner-bleed",
          variant: "full-bleed",
          headline,
          image,
        },
        {
          _type: "heroBanner",
          _key: "banner-medilo",
          variant: "medilo",
          headline,
          highlight: { _type: "localeString", [site.locale]: site.highlight },
          body: bodyObj,
          calloutTitle: { _type: "localeString", [site.locale]: site.calloutTitle },
          image,
        },
      ];
      if (
        plan(diff, "hero.banners", hero.banners ?? null, banners, "split + full-bleed + medilo")
      ) {
        patches["hero.banners"] = banners;
      }
    }
  }

  console.log(`\n=== seed planı ${site.id} → ${home._id} (${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`);
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

  if (!APPLY) continue;
  if (changes === 0) {
    console.log("Yazılacak değişiklik yok.");
    continue;
  }
  await client.patch(home._id).set(patches).commit();
  console.log(`OK — ${changes} alan yazıldı.`);
}

if (!APPLY) {
  console.log("\nDry-run — yazmak için: node packages/migration/seed-eu-nl-home-v2.mjs --apply");
}
