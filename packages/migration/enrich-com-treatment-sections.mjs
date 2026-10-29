// DSN-83 dalga 2: kalan com tedavilerinin gövdelerini orijinal sayfalarının
// H2/H3 yapısına eşler (pilot: enrich-com-perio-sections.mjs — periodontoloji
// ve ona özel metin onarımları orada kalır).
//
// Her tedavi için: legacy www.dentaliva.com/{slug}/ sayfası canlıdan
// ayrıştırılır (ilk H2'den footer'a; SSS/Randevu bölümleri ve boş bölümler
// atılır), link-anchor ek boşlukları onarılır, bölümler treatment.sections
// olarak PATCH'lenir. Bölüm fotoğrafları: sayfanın KENDİ içerik görselleri
// (DOM sırasına göre), eksikler tüm sayfalarda görülen ortak dis-genel
// havuzundan slug-bazlı döndürmeyle tamamlanır (aynı sayfada tekrar yok).
//
// enrich-* kuralları: PATCH, CLI oturum token'ı, dry-run varsayılan, --apply.
// sections'u zaten dolu tedaviler atlanır (--force ile yeniden yazılır);
// heroImage DOKUNULMAZ (24/24'ünde var).

import { readFileSync } from "node:fs";

const PROJECT = "86x2hbzv"; // com
const DATASET = "production";
const BASE = "https://www.dentaliva.com";
const IMAGES = `${BASE}/wp-content/uploads`;
const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) ?? "").split("=")[1];
const UA = { "User-Agent": "Mozilla/5.0 (migration; dentaliva-rebuild)" };

const TOKEN = JSON.parse(
  readFileSync(`${process.env.USERPROFILE}/.config/sanity/config.json`, "utf8"),
).authToken;
const token = typeof TOKEN === "string" ? TOKEN : TOKEN?.value;
if (!token) throw new Error("no Sanity CLI session token");

// İçerik olmayan bant başlıkları (SSS zaten treatment.faqs alanında canlı).
const DROP_HEADINGS = new Set([
  "Sıkça Sorulan Sorular",
  "Randevu Alın!",
  "Randevu Alın",
  "Bizi Arayın",
]);

const clean = (raw) =>
  raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "\u2019")
    .replace(/&#8220;|&ldquo;/g, "\u201C")
    .replace(/&#8221;|&rdquo;/g, "\u201D")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

// Link-anchor ek boşluk artifact'ları ("maliyeti ni" → "maliyetini").
const joinSuffixes = (s) =>
  s
    .replace(/(\S) (i|ı|ni|nı|na|nin|nın|si|sı)(?=[ ,.])/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim();

/** Legacy sayfasından H2/H3/P akışını bölümlere ayrıştırır. */
function parseSections(html) {
  const contentStart = html.search(/<h2[^>]*>/);
  if (contentStart === -1) return [];
  const contentEnd = html.indexOf("<footer", contentStart);
  const area = html.slice(contentStart, contentEnd > 0 ? contentEnd : undefined);
  const re =
    /<(h2|h3|p)\b[^>]*>([\s\S]*?)<\/\1>|<img[^>]*data-src="(https:\/\/www\.dentaliva\.com\/wp-content\/uploads\/[^"]*-1024x1024\.webp)"[^>]*>/g;

  const raw = [];
  let current = null;
  let currentItem = null;
  let m;
  while ((m = re.exec(area)) !== null) {
    if (m[3]) {
      // Sayfanın kendi içerik görseli — bulunduğu bölüme bağlanır (uploads
      // altındaki tam alt-yol saklanır; tarih dizini değişebilir).
      const sub = m[3].split("/wp-content/uploads/")[1];
      if (current && !current.image) current.image = sub;
      continue;
    }
    const text = clean(m[2] ?? "");
    if (text.length < 4) continue;
    if (m[1] === "h2") {
      current = { heading: text, lead: [], items: [], image: null };
      raw.push(current);
      currentItem = null;
    } else if (m[1] === "h3") {
      if (!current) continue;
      currentItem = { title: text, text: [] };
      current.items.push(currentItem);
    } else if (currentItem) {
      currentItem.text.push(text);
    } else if (current) {
      current.lead.push(text);
    }
  }

  const cleaned = raw
    .filter((s) => !DROP_HEADINGS.has(s.heading))
    .filter((s) => s.lead.length > 0 || s.items.length > 0)
    .map((s) => ({
      heading: joinSuffixes(s.heading),
      lead: joinSuffixes(s.lead.join(" ")),
      items: s.items.map((it) => ({
        title: joinSuffixes(it.title),
        text: joinSuffixes(it.text.join(" ")),
      })),
      image: s.image,
    }));

  // Bazı legacy sayfalarda aynı H2 iki kez basılmış (inlay-ve-onlay,
  // ortodonti) — sayfada çift başlık kalmasın: zengin olan (madde sayısı,
  // sonra metin uzunluğu) tutulur, sade kopya atılır.
  const byHeading = new Map();
  for (const s of cleaned) {
    const score = s.items.length * 1000 + s.lead.length;
    const prev = byHeading.get(s.heading);
    if (!prev || score > prev.score) byHeading.set(s.heading, { section: s, score });
  }
  const kept = [...byHeading.values()].map((entry) => entry.section);
  return cleaned.length === kept.length ? cleaned : kept; // Map ekleme sırası korunur (ilk görünüm)
}

async function api(path, init = {}) {
  const res = await fetch(`https://${PROJECT}.api.sanity.io${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) },
  });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`${path} → ${res.status} ${JSON.stringify(json.error ?? "")}`);
  }
  return json;
}

const assetCache = new Map();
async function uploadImage(sub) {
  if (assetCache.has(sub)) return assetCache.get(sub);
  const filename = sub.split("/").pop();
  const res = await fetch(`${IMAGES}/${sub}`, { headers: UA });
  if (!res.ok) throw new Error(`image ${sub} → ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  const up = await api(`/v1/assets/images/${DATASET}?filename=${filename}`, {
    method: "POST",
    headers: { "Content-Type": "image/webp" },
    body,
  });
  const ref = up.document._id;
  assetCache.set(sub, ref);
  console.error(`asset: ${sub} → ${ref}`);
  return ref;
}

/** Tüm sayfalarda görünen ortak görsel havuzu (uploads alt-yolları). */
const SHARED_POOL = [
  "2025/07/dis-genel-001.webp",
  "2025/07/dis-genel-004.webp",
  "2025/07/dis-genel-009.webp",
  "2025/07/dis-genel-012.webp",
  "2025/07/dis-genel-013.webp",
];

const hash = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
};

/** Slug-bazlı döndürmeyle havuzdan sıradaki görseli bulur (sayfada kullanılmamış). */
function poolPick(slug, used, start) {
  for (let i = 0; i < SHARED_POOL.length; i++) {
    const file = SHARED_POOL[(hash(slug) + start + i) % SHARED_POOL.length];
    if (!used.has(file)) return file;
  }
  return null;
}

async function main() {
  const treatments = (
    await api(
      `/v2024-10-01/data/query/${DATASET}?query=${encodeURIComponent(
        '*[_type=="treatment"]{_id, "slug": slug.current, "name": coalesce(name.tr, slug.current), "hasSections": defined(sections)} | order(slug.current asc)',
      )}`,
    )
  ).result;

  const plan = [];
  for (const tr of treatments) {
    if (tr.slug === "periodontoloji") continue; // pilot — kendi script'iyle atıldı
    if (ONLY && tr.slug !== ONLY) continue;
    if (tr.hasSections && !FORCE) {
      plan.push({ slug: tr.slug, skip: "sections already set" });
      continue;
    }
    const res = await fetch(`${BASE}/${tr.slug}/`, { headers: UA });
    if (!res.ok) {
      plan.push({ slug: tr.slug, skip: `legacy page ${res.status}` });
      continue;
    }
    const sections = parseSections(await res.text());
    if (sections.length === 0) {
      plan.push({ slug: tr.slug, skip: "no content sections parsed" });
      continue;
    }
    // Fotoğraf ataması: sayfanın kendi görselleri önce, sonra havuz doldurur.
    const used = new Set();
    for (const s of sections) if (s.image) used.add(s.image);
    let fills = 0;
    for (const s of sections) {
      if (!s.image) {
        const pick = poolPick(tr.slug, used, fills++);
        if (pick) {
          s.image = pick;
          used.add(pick);
        }
      }
    }
    plan.push({ _id: tr._id, slug: tr.slug, name: tr.name, sections });
  }

  console.log(`=== ${APPLY ? "APPLY" : "DRY-RUN"} ===`);
  for (const entry of plan) {
    if (entry.skip) {
      console.log(`SKIP ${entry.slug}: ${entry.skip}`);
      continue;
    }
    console.log(`\n## ${entry.slug} — ${entry.name} (${entry.sections.length} bölüm)`);
    for (const s of entry.sections) {
      console.log(
        `   ${s.heading.slice(0, 60)}  (lead ${s.lead.length}, items ${s.items.length})${s.image ? `  [${s.image}]` : "  [fotosuz]"}`,
      );
    }
  }

  if (!APPLY) {
    console.log("\ndry-run: nothing written (rerun with --apply)");
    return;
  }

  const key = () => Math.random().toString(36).slice(2, 10);
  let patched = 0;
  for (const entry of plan) {
    if (entry.skip || !entry.sections) continue;
    const sections = await Promise.all(
      entry.sections.map(async (s) => ({
        _key: key(),
        _type: "treatmentSection",
        heading: { _type: "localeString", tr: s.heading },
        lead: { _type: "localeText", tr: s.lead },
        ...(s.items.length > 0
          ? {
              items: s.items.map((it) => ({
                _key: key(),
                _type: "treatmentSectionItem",
                title: { _type: "localeString", tr: it.title },
                text: { _type: "localeText", tr: it.text },
              })),
            }
          : {}),
        ...(s.image
          ? {
              image: {
                _type: "imageWithAlt",
                asset: { _type: "reference", _ref: await uploadImage(s.image) },
                alt: { _type: "localeString", tr: `Dentaliva kliniğinde ${entry.name} tedavisi` },
              },
            }
          : {}),
      })),
    );
    await api(`/v1/data/mutate/${DATASET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mutations: [{ patch: { id: entry._id, set: { sections } } }],
      }),
    });
    patched++;
    console.log(`patched: ${entry.slug} (${entry.sections.length} bölüm)`);
  }
  console.log(`\nDone — ${patched} treatments patched.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
