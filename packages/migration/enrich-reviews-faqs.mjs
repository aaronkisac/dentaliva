// CPT-3: live home + treatment pages → video testimonials, Google reviews
// and FAQs → create docs + link treatments. Idempotent (createIfNotExists).
// Usage (repo root): node packages/migration/enrich-reviews-faqs.mjs
import { readFile, writeFile } from "node:fs/promises";

import * as cheerio from "cheerio";

const TOKEN = JSON.parse(
  await readFile(process.env.USERPROFILE + "/.config/sanity/config.json", "utf8"),
).authToken;
const PROJECT = process.env.MIGRATION_PROJECT_ID ?? "86x2hbzv";
const DATASET = process.env.MIGRATION_DATASET ?? "production";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const VIDEO_CAPTIONS = [
  "Bana Gülümsememi Geri Verdiniz",
  "Aileyi Gülümsetmeyi Seviyoruz",
  "30 Yıl Boyunca Böyle Gülmemiştim",
  "Kendime Olan Güvenimi Geri Kazandım",
  "Yeni Dişler Yeni Gülüşler",
  "Bir Hollywood Gülümseme Klasiği",
];

async function mutate(mutations) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/data/mutate/${DATASET}?returnDocuments=false`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations }),
    },
  );
  if (!res.ok) throw new Error(`mutate failed ${res.status}: ${await res.text()}`);
}

function slugify(text) {
  const map = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
  return text
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşûâî]/g, (char) => map[char] ?? char)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function parseVideos($) {
  const videos = [];
  $("[data-lzl-v-src]").each((_i, el) => {
    const src = $(el).attr("data-lzl-v-src") ?? "";
    const id = src.match(/embed\/([\w-]{11})/)?.[1];
    if (!id) return;
    // Türkçe caption: kapsayıcı ağacında bilinen başlıklardan biri
    let caption = "";
    const box = $(el).closest("div").parent().text() + " " + $(el).closest("section").text();
    for (const captionCandidate of VIDEO_CAPTIONS) {
      if (box.includes(captionCandidate)) {
        caption = captionCandidate;
        break;
      }
    }
    const fallbackTitle = ($(el).attr("title") || "").replace(/\s+/g, " ").trim();
    videos.push({ id, caption, fallbackTitle });
  });
  return videos;
}

function parseReviews($) {
  const reviews = [];
  const seen = new Set();
  $(".ti-review-item").each((_i, el) => {
    const author = $(el).find(".ti-name").text().replace(/\s+/g, " ").trim();
    const text = $(el).find(".ti-review-text-container").text().replace(/\s+/g, " ").trim();
    const rating = $(el).find(".ti-stars .ti-star").length;
    if (!author || !text) return;
    const key = author + "|" + text.slice(0, 40);
    if (seen.has(key)) return;
    seen.add(key);
    reviews.push({ author, text: text.slice(0, 500), rating: rating || 5 });
  });
  return reviews;
}

function parseFaqs($) {
  const faqs = [];
  $(".elementor-accordion").each((_i, acc) => {
    $(acc)
      .find(".elementor-tab-title")
      .each((_j, title) => {
        const q = $(title).text().replace(/\s+/g, " ").trim();
        const panelId = $(title).attr("aria-controls");
        const a = panelId
          ? $("#" + panelId)
              .text()
              .replace(/\s+/g, " ")
              .trim()
          : "";
        if (q && a && a.length > 20) faqs.push({ q, a });
      });
  });
  // DOM'da desktop+mobile kopyası var — soruya göre tekilleştir
  const uniq = new Map();
  for (const f of faqs) if (!uniq.has(f.q)) uniq.set(f.q, f.a);
  return [...uniq.entries()].map(([q, a]) => ({ q, a }));
}

// 1. Anasayfa: videolar + yorumlar + genel SSS
const homeHtml = await (await fetch("https://www.dentaliva.com/")).text();
const $home = cheerio.load(homeHtml);
const decoded = homeHtml.replace(/\\u([0-9a-fA-F]{4})/g, (_m, code) =>
  String.fromCharCode(parseInt(code, 16)),
);
const videos = parseVideos($home, decoded);
const reviews = parseReviews($home);
const homeFaqs = parseFaqs($home);
console.log(
  `anasayfa: ${videos.length} video, ${reviews.length} yorum, ${homeFaqs.length} genel SSS`,
);

// 2. Tedavi sayfaları: SSS çiftleri
const treatments = JSON.parse(await readFile("migration/normalized-v2/treatment.json", "utf8"));
const treatmentFaqs = [];
for (const page of treatments) {
  const slug = new URL(page.url).pathname.split("/").filter(Boolean).pop();
  const html = await (await fetch(page.url)).text();
  const $ = cheerio.load(html);
  const faqs = parseFaqs($);
  if (faqs.length > 0) treatmentFaqs.push({ slug, faqs });
  console.log(`  ${slug}: ${faqs.length} SSS`);
  await delay(250);
}
const totalTreatmentFaqs = treatmentFaqs.reduce((sum, t) => sum + t.faqs.length, 0);
console.log(`tedavi SSS toplam (doküman öncesi): ${totalTreatmentFaqs}`);

// 3. Mutasyonlar
const mutations = [];

// 3a. Genel SSS (anasayfada görünür)
homeFaqs.forEach((faq, index) => {
  mutations.push({
    createIfNotExists: {
      _id: `faq.genel-${slugify(faq.q)}`,
      _type: "faq",
      question: { tr: faq.q },
      answer: { tr: faq.a },
      order: index + 1,
      displayOnHome: true,
    },
  });
});

// 3b. Tedavi SSS (anasayfa dışı; tedaviye bağlanır) — aynı soru birden çok
// tedavide geçiyorsa tek faq dokümanı paylaşılır.
const faqIdByQuestion = new Map();
const refsByTreatment = new Map();
for (const { slug, faqs } of treatmentFaqs) {
  const refs = [];
  for (const { q, a } of faqs) {
    const faqId = `faq.${slugify(q)}`;
    if (!faqIdByQuestion.has(faqId)) {
      faqIdByQuestion.set(faqId, q);
      mutations.push({
        createIfNotExists: {
          _id: faqId,
          _type: "faq",
          question: { tr: q },
          answer: { tr: a },
          order: 0,
          displayOnHome: false,
        },
      });
    }
    refs.push({ _type: "reference", _ref: faqId, _key: `faq-${refs.length}` });
  }
  if (refs.length > 0) refsByTreatment.set(slug, refs);
}
// Tedavi başına TEK patch: tüm SSS referansları aynı anda bağlanır.
for (const [slug, refs] of refsByTreatment) {
  mutations.push({
    patch: { id: `treatment.${slug}`, set: { faqs: refs } },
  });
}

// 3c. Yorumlar + video testimonials
videos.forEach((video) => {
  const caption = video.caption || video.fallbackTitle || "Hasta Görüşü";
  mutations.push({
    createIfNotExists: {
      _id: `testimonial.video-${video.id}`,
      _type: "testimonial",
      author: caption,
      quote: { tr: caption },
      rating: 5,
      source: "YouTube",
      youtubeId: video.id,
    },
  });
});
reviews.forEach((review) => {
  mutations.push({
    createIfNotExists: {
      _id: `testimonial.google-${slugify(review.author)}`,
      _type: "testimonial",
      author: review.author,
      quote: { tr: review.text },
      rating: review.rating,
      source: "Google",
    },
  });
});

// Toplu çalıştır (25'lik gruplar)
for (let i = 0; i < mutations.length; i += 25) {
  await mutate(mutations.slice(i, i + 25));
  console.log(`  mutasyon ${Math.min(i + 25, mutations.length)}/${mutations.length}`);
  await delay(200);
}

const report = {
  videos: videos.length,
  reviews: reviews.length,
  homeFaqs: homeFaqs.length,
  treatmentsWithFaqs: treatmentFaqs.length,
  treatmentFaqLinks: refsByTreatment.size,
  mutations: mutations.length,
};
await writeFile(
  "migration/enrich-reviews-faqs-report.json",
  JSON.stringify({ ...report, treatmentFaqs, reviews }, null, 1),
);
console.log("DONE:", JSON.stringify({ ...report, treatmentFaqLinks: report.treatmentFaqLinks }));
