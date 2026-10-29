// DSN-83: periodontoloji tedavi gövdesini orijinal site yapısına eşler.
//
// Orijinal www.dentaliva.com/periodontoloji içeriği com dataset'inde düz
// metin duvarı olarak duruyordu (H2/H3'ler ezilmiş, Periodontitis başlığı
// hero'da yetim kalmış, ilk paragraf bozuk). Bu script sayfayı canlıdan
// ayrıştırıp treatment.sections yapılandırılmış bölümlerine taşır ve legacy
// klinik fotoğraflarından heroImage + 4 bölüm fotoğrafı bağlar.
//
// enrich-* ailesi kuralları: PATCH (asla createOrReplace değil), CLI oturum
// token'ı, dry-run varsayılan, `--apply` ile yaz. İdempotent: sections zaten
// doluysa skip.

import { readFileSync } from "node:fs";

const PROJECT = "86x2hbzv"; // com
const DATASET = "production";
const PAGE = "https://www.dentaliva.com/periodontoloji/";
const IMAGES = "https://www.dentaliva.com/wp-content/uploads/2025/07";
const APPLY = process.argv.includes("--apply");
const UA = { "User-Agent": "Mozilla/5.0 (migration; dentaliva-rebuild)" };

const TOKEN = JSON.parse(
  readFileSync(`${process.env.USERPROFILE}/.config/sanity/config.json`, "utf8"),
).authToken;
const token = typeof TOKEN === "string" ? TOKEN : TOKEN?.value;
if (!token) throw new Error("no Sanity CLI session token");

// Bölüm sırasına göre fotoğraf ataması (orijinal sayfadaki klinik fotoğrafları).
// 5. bölüm (Genel Sağlık) v2'de tam kanat arka plan (showcase) — orijinal
// sayfanın hero fotoğrafı dis-genel-012 kullanılır; heroImage alanındaki
// görsel ayrıca liste kartı + og:image'i taşır.
const SECTION_IMAGES = [
  { file: "dis-genel-004.webp", alt: "Dentaliva kliniğinde diş eti muayenesi" },
  { file: "dis-genel-001.webp", alt: "Dentaliva kliniği tedavi odası" },
  { file: "dis-genel-009.webp", alt: "Dentaliva kliniğinde ağız içi görüntüleme" },
  { file: "dis-genel-013.webp", alt: "Modern dental tedavi ünitesi" },
  { file: "dis-genel-012.webp", alt: "Dentaliva kliniğinde periodontal tedavi" },
];
const HERO = { file: "dis-genel-012.webp", alt: "Dentaliva kliniğinde periodontoloji tedavisi" };

/** Orijinal WordPress sayfasından H2/H3/P akışını bölümlere ayrıştırır. */
function parseSections(html) {
  const contentStart = html.indexOf("Periodontoloji Bölümü Neye Bakar");
  if (contentStart === -1) throw new Error("content anchor not found in legacy page");
  const contentEnd = html.indexOf("<footer", contentStart);
  const area = html.slice(
    Math.max(0, contentStart - 6000),
    contentEnd > 0 ? contentEnd : undefined,
  );
  const re =
    /<(h2|h3|p)\b[^>]*>([\s\S]*?)<\/\1>|<img[^>]*data-src="(https:\/\/www\.dentaliva\.com\/wp-content\/uploads\/[^"]*-1024x1024\.webp)"[^>]*>/g;
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
  // Link-anchor ek boşluk artifact'ları: uyumlu sonekler kopmuş
  // ("maliyeti ni" → "maliyetini"). Yalnız bilinen sonek kümesi birleştirilir.
  const joinSuffixes = (s) =>
    s
      .replace(/(\S) (i|ı|ni|nı|na|nin|nın|si|sı)(?=[ ,.])/g, "$1$2")
      .replace(/\s+/g, " ")
      .trim();

  const sections = [];
  let current = null;
  let currentItem = null;
  let m;
  while ((m = re.exec(area)) !== null) {
    if (m[3]) continue; // görseller bölümlere atanmış sırada (SECTION_IMAGES)
    const text = clean(m[2] ?? "");
    if (text.length < 4) continue;
    if (m[1] === "h2") {
      current = { heading: text, lead: [], items: [] };
      sections.push(current);
      currentItem = null;
    } else if (m[1] === "h3") {
      currentItem = { title: text, text: [] };
      current.items.push(currentItem);
    } else if (currentItem) {
      currentItem.text.push(text);
    } else if (current) {
      current.lead.push(text);
    }
  }

  // Onarım 1: orijinaldeki "Pediodontoloji" yazım hatası.
  sections[0].lead = sections[0].lead.map((p) => p.replace("Pediodontoloji", "Periodontoloji"));

  // Onarım 2: orijinalde Periodontitis başlığı hero'da yetim kalmış, metni
  // Gingivitis'e yapışık geliyor ("ır yani..." diye başlıyor). İkiye ayrılır:
  // Gingivitis (hafif) → Periodontitis (ileri) → Hiperplazi sıralaması.
  const gingivitis = sections[0].items[0];
  const full = gingivitis.text.join(" ");
  const cut = full.indexOf("ır yani adlarından");
  if (cut === -1) throw new Error("Periodontitis split anchor not found");
  gingivitis.text = [full.slice(0, cut).trim()];
  const perioBody = full.slice(cut + "ır yani adlarından da anlaşılabileceği üzere".length);
  sections[0].items = [
    gingivitis,
    {
      title: "Periodontitis (İleri Diş Eti Hastalığı)",
      text: [
        "Periodontitis, yani adından da anlaşılabileceği üzere, diş eti iltihabının ilerlemiş bir halidir." +
          perioBody,
      ],
    },
    sections[0].items[1],
  ];

  // SSS bölümü CMS'te ayrıca var (treatment.faqs) — akışa alınmaz.
  return sections
    .filter((s) => s.heading !== "Sıkça Sorulan Sorular")
    .map((s) => ({
      heading: joinSuffixes(s.heading),
      lead: joinSuffixes(s.lead.join(" ")),
      items: s.items.map((it) => ({
        title: joinSuffixes(it.title),
        text: joinSuffixes(it.text.join(" ")),
      })),
    }));
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
async function uploadImage(file) {
  if (assetCache.has(file)) return assetCache.get(file);
  const res = await fetch(`${IMAGES}/${file}`, { headers: UA });
  if (!res.ok) throw new Error(`image ${file} → ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  const up = await api(`/v1/assets/images/${DATASET}?filename=${file}`, {
    method: "POST",
    headers: { "Content-Type": "image/webp" },
    body,
  });
  const ref = up.document._id;
  assetCache.set(file, ref);
  console.error(`asset: ${file} → ${ref}`);
  return ref;
}

async function main() {
  const treatment = (
    await api(
      `/v2024-10-01/data/query/${DATASET}?query=${encodeURIComponent(
        '*[_type=="treatment" && slug.current=="periodontoloji"][0]{_id, "hasSections": defined(sections), "hasHero": defined(heroImage)}',
      )}`,
    )
  ).result;
  if (!treatment) throw new Error("treatment.periodontoloji not found");

  const page = await fetch(PAGE, { headers: UA });
  if (!page.ok) throw new Error(`legacy page → ${page.status}`);
  const sections = parseSections(await page.text());
  if (sections.length !== 5) throw new Error(`expected 5 sections, parsed ${sections.length}`);

  console.log(`=== ${APPLY ? "APPLY" : "DRY-RUN"} ===`);
  // sections her koşuda yeniden yazılır (deterministik seed — Studio'daki elle
  // düzenlemeler yeniden koşuda ezilir); heroImage yalnız boşken doldurulur.
  console.log(
    `sections to set : ${sections.length}${treatment.hasSections ? " (re-set over existing)" : ""}`,
  );
  console.log(`heroImage       : ${treatment.hasHero ? "already set (skip)" : HERO.file}`);
  for (const [i, s] of sections.entries()) {
    const img = SECTION_IMAGES[i] ? `  [img ${SECTION_IMAGES[i].file}]` : "";
    console.log(`  ## ${s.heading} (lead ${s.lead.length}, items ${s.items.length})${img}`);
  }

  if (!APPLY) {
    console.log("dry-run: nothing written (rerun with --apply)");
    return;
  }

  const heroRef = treatment.hasHero ? null : await uploadImage(HERO.file);
  const key = () => Math.random().toString(36).slice(2, 10);
  const patched = await Promise.all(
    sections.map(async (s, i) => ({
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
      ...(SECTION_IMAGES[i]
        ? {
            image: {
              _type: "imageWithAlt",
              asset: { _type: "reference", _ref: await uploadImage(SECTION_IMAGES[i].file) },
              alt: { _type: "localeString", tr: SECTION_IMAGES[i].alt },
            },
          }
        : {}),
    })),
  );

  const set = { sections: patched };
  if (heroRef) {
    set.heroImage = {
      _type: "imageWithAlt",
      asset: { _type: "reference", _ref: heroRef },
      alt: { _type: "localeString", tr: HERO.alt },
    };
  }
  await api(`/v1/data/mutate/${DATASET}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mutations: [{ patch: { id: treatment._id, set } }] }),
  });
  console.log(`patched: treatment.periodontoloji (sections${heroRef ? " + heroImage" : ""})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
