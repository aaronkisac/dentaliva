// CPT-4: live home + gallery page → homePage singleton (hero/about/stats/
// cta) + gallery assets. Idempotent (createOrReplace on the singleton).
// Usage (repo root): node packages/migration/enrich-homepage.mjs
import { readFile, writeFile } from "node:fs/promises";

const TOKEN = JSON.parse(
  await readFile(process.env.USERPROFILE + "/.config/sanity/config.json", "utf8"),
).authToken;
const PROJECT = "86x2hbzv";
const DATASET = "production";
const BASE = "https://www.dentaliva.com";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const galleryHtml = await (await fetch(`${BASE}/fotograf-galerisi/`)).text();

async function uploadImage(url, filename) {
  const bin = Buffer.from(await (await fetch(url)).arrayBuffer());
  const ext = filename.split(".").pop().toLowerCase();
  const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/assets/images/${DATASET}?filename=${filename}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": MIME[ext] ?? "application/octet-stream",
      },
      body: bin,
    },
  );
  if (!res.ok) throw new Error(`upload failed ${res.status}: ${await res.text()}`);
  const doc = await res.json();
  return doc.document?._id;
}

function imageWithAlt(assetId, alt) {
  return { _type: "imageWithAlt", asset: { _type: "reference", _ref: assetId }, alt: { tr: alt } };
}

// Hero + about görselleri: anasayfadaki 2026/03 slider görsellerinden
// (hangisinin hangi slayt olduğu Studio'dan değiştirilebilir).
const HERO_IMG = `${BASE}/wp-content/uploads/2026/03/web-guncelle-kopyasi-6-1.webp`;
const ABOUT_IMG = `${BASE}/wp-content/uploads/2026/03/web-guncelle-kopyasi-3-1.webp`;

// Galeri: galeri sayfasındaki klinik fotoğrafları (logo/icon/thumb hariç).
const galleryHtml$ = galleryHtml; // zaten string
const galleryUrls = [
  ...new Set(
    [
      ...galleryHtml$
        .matchAll(
          /https:\/\/www\.dentaliva\.com\/wp-content\/uploads\/[^\s"'()<>]+\.(?:jpe?g|png|webp)/gi,
        )
        .map((m) => m[0]),
    ].filter((url) => !/logo|icon|thumbs|cropped-|smilepng/i.test(url) && !/-\d+x\d+\./.test(url)),
  ),
].slice(0, 24);
console.log(`galeri adayı: ${galleryUrls.length}`);

const gallery = [];
for (const [index, url] of galleryUrls.entries()) {
  const filename = `galeri-${index + 1}.${url.split(".").pop().toLowerCase()}`;
  try {
    const assetId = await uploadImage(url, filename);
    gallery.push(imageWithAlt(assetId, `Dentaliva kliniği görseli ${index + 1}`));
    console.log(`  ✓ ${filename}`);
  } catch (error) {
    console.error(`  ✗ ${filename}: ${error.message}`);
  }
  await delay(200);
}

const heroAssetId = await uploadImage(HERO_IMG, "anasayfa-hero.webp");
console.log("✓ anasayfa-hero.webp");
const aboutAssetId = await uploadImage(ABOUT_IMG, "anasayfa-hakkimizda.webp");
console.log("✓ anasayfa-hakkimizda.webp");

const doc = {
  _id: "homePage",
  _type: "homePage",
  hero: {
    headline: { tr: "Dentaliva Göz Alıcı Bir Gülüşe Sahip Olmanızı Sağlıyor" },
    subline: { tr: "İstanbul'da Diş Kliniği" },
    image: imageWithAlt(heroAssetId, "Dentaliva Diş Kliniği"),
  },
  about: {
    title: { tr: "Herkesi Gülümset" },
    body: {
      tr: "Dentaliva Diş Kliniği, 2012 yılında İstanbul'un modern semtlerinden Başakşehir'de sizlere en iyi hizmeti vermek için “Herkesi Gülümset” sloganıyla faaliyete başlamıştır.\n\nKonfor ve memnuniyeti ön planda tutarak işinde profesyonel olmanın yanı sıra; disiplinli, güler yüzlü personeli ile hastalarına rahat ve huzurlu bir ortam sağlamayı, deneyimli ve uzman hekimleri ile kaliteli hizmeti ilke edinmiştir.",
    },
    image: imageWithAlt(aboutAssetId, "Dentaliva kliniği hakkında"),
  },
  stats: [{ _key: "stat1", value: "13+", label: { tr: "Yıldan Fazla Deneyim Süresi" } }],
  cta: {
    title: { tr: "Randevu Alın!" },
    text: { tr: "Türkiye'deki diş tedavileri hakkında bilgi almak için bize ulaşın." },
  },
  gallery,
};

const res = await fetch(
  `https://${PROJECT}.api.sanity.io/v1/data/mutate/${DATASET}?returnDocuments=false`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
  },
);
if (!res.ok) throw new Error(`homePage create failed: ${res.status} ${await res.text()}`);

const report = { gallery: gallery.length, hero: heroAssetId, about: aboutAssetId };
await writeFile("migration/enrich-homepage-report.json", JSON.stringify(report, null, 1));
console.log("DONE:", JSON.stringify(report));
