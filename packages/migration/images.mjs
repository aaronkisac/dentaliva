// MIG-4: per-page featured images → Sanity assets → patch treatment/doctor docs.
// Usage (packages/migration): node images.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";

import { classifyUrl } from "./src/classify.ts";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const sanityCfg = JSON.parse(
  await readFile(process.env.USERPROFILE + "/.config/sanity/config.json", "utf8"),
);
const TOKEN = sanityCfg.authToken ?? sanityCfg.token;
if (!TOKEN) throw new Error("No Sanity token in CLI config");

async function fetchText(url) {
  const res = await fetch(url);
  return res.text();
}

// 1. Load normalized treatment/doctor pages.
const normDir = "../../migration/normalized";
const treatments = JSON.parse(await readFile(`${normDir}/treatment.json`, "utf8"));
const doctors = JSON.parse(await readFile(`${normDir}/doctor.json`, "utf8"));
const pages = [...treatments, ...doctors];
console.log(`pages: ${pages.length}`);

// 2. Collect upload URLs per page; score against the page slug.
const UPLOAD_PATTERN =
  /https:\/\/www\.dentaliva\.com\/wp-content\/uploads\/[^\s"'>]+\.(?:png|jpe?g|webp)/gi;

function collectImageUrls(html) {
  return [
    ...new Set(
      (html.match(UPLOAD_PATTERN) ?? []).filter((url) => !/logo|icon|placeholder/i.test(url)),
    ),
  ];
}

// Prefer upload URLs whose filename mentions the page slug; larger variants win.
function scoreImage(url, slugWords) {
  const lower = url.toLowerCase();
  let score = 0;
  for (const word of slugWords) {
    if (word.length >= 4 && lower.includes(word)) score += 2;
  }
  const sizeMatch = lower.match(/-(\d{2,4})x\d{1,4}/);
  if (sizeMatch) score += Math.min(Number(sizeMatch[1]), 30) / 30;
  return score;
}

const plan = [];
for (const page of pages) {
  const slug = new URL(page.url).pathname.split("/").filter(Boolean).pop();
  const type = classifyUrl(new URL(page.url).pathname);
  const slugWords = slug.split("-").filter((word) => word.length >= 4);
  let imageUrl = null;
  try {
    const html = await fetchText(page.url);
    const urls = collectImageUrls(html);
    let best = null;
    let bestScore = -1;
    for (const url of urls) {
      const score = scoreImage(url, slugWords);
      if (score > bestScore) {
        best = url;
        bestScore = score;
      }
    }
    imageUrl = best;
  } catch (error) {
    plan.push({ slug, type, name: page.h1, imageUrl: null, error: String(error) });
    continue;
  }
  plan.push({ slug, type, name: page.h1, imageUrl });
  await delay(350);
}
const withImages = plan.filter((item) => item.imageUrl);
console.log(`with images: ${withImages.length}/${plan.length}`);
await mkdir("../../migration/assets", { recursive: true });
await writeFile("../../migration/image-plan.json", JSON.stringify(plan, null, 1));

// 3. Download + upload each unique image.
const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp" };
const uploadImage = async (url, filename) => {
  const bin = Buffer.from(await (await fetch(url)).arrayBuffer());
  const ext = filename.split(".").pop().toLowerCase();
  const res = await fetch(
    `https://86x2hbzv.api.sanity.io/v1/assets/images/production?filename=${filename}`,
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
  return doc.document ?? doc;
};

const assetBySlug = {};
for (const item of withImages) {
  const ext = item.imageUrl.split(".").pop().split("?")[0];
  const filename = `${item.type}-${item.slug}.${ext}`;
  try {
    const doc = await uploadImage(item.imageUrl, filename);
    assetBySlug[item.slug] = {
      assetId: doc.document?.asset?._ref ?? doc._id,
      url: item.imageUrl,
      name: item.name,
    };
    console.log(`uploaded ${item.slug} → ${JSON.stringify(doc).slice(0, 80)}`);
  } catch (error) {
    console.error(`UPLOAD FAIL ${item.slug}: ${error.message}`);
  }
  await delay(250);
}
await writeFile("../../migration/image-asset-map.json", JSON.stringify(assetBySlug, null, 1));
console.log(`DONE: ${Object.keys(assetBySlug).length} assets uploaded`);
