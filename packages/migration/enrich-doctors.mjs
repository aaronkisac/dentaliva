// CPT-2: live doctor pages → title + CV bio + missing photo → patch docs.
// Usage (repo root): node packages/migration/enrich-doctors.mjs
import { readFile, writeFile } from "node:fs/promises";

import { parseDoctorCv } from "./src/enrich-doctor.ts";

const TOKEN = JSON.parse(
  await readFile(process.env.USERPROFILE + "/.config/sanity/config.json", "utf8"),
).authToken;
const PROJECT = process.env.MIGRATION_PROJECT_ID ?? "86x2hbzv";
const DATASET = process.env.MIGRATION_DATASET ?? "production";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const pages = JSON.parse(await readFile("migration/normalized-v2/doctor.json", "utf8"));

async function patchDoc(id, patch) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/data/mutate/${DATASET}?returnDocuments=false`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations: [{ patch: { id, set: patch } }] }),
    },
  );
  if (!res.ok) throw new Error(`patch failed ${res.status}: ${await res.text()}`);
}

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
  return (await res.json()).document?._id;
}

const report = [];
for (const page of pages) {
  const slug = new URL(page.url).pathname.split("/").filter(Boolean).pop();
  const id = `doctor.${slug}`;
  try {
    const html = await (await fetch(page.url)).text();
    const cv = parseDoctorCv(html);
    if (!cv.title && !cv.bioText) {
      report.push({ id, status: "no-cv-found" });
      continue;
    }
    const set = {
      ...(cv.title ? { title: { tr: cv.title } } : {}),
      ...(cv.bioText ? { bio: { tr: cv.bioText } } : {}),
    };
    await patchDoc(id, set);
    const entry = { id, status: "patched", title: cv.title, bioLength: cv.bioText.length };

    // Photo: only for docs the MIG-4 pass missed (og:image is the doctor's photo).
    const $ = (await import("cheerio")).load(html);
    const ogImage = $('meta[property="og:image"]').attr("content") ?? "";
    if (ogImage.includes("dentaliva.com/wp-content")) {
      const filename = `doctor-${slug}.${ogImage.split(".").pop().split("?")[0]}`;
      const assetId = await uploadImage(ogImage, filename);
      await patchDoc(id, {
        photo: {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: assetId },
          alt: { tr: page.h1 || slug },
        },
      });
      entry.photo = assetId;
      await delay(250);
    }
    report.push(entry);
    console.log(`✓ ${id} (${cv.bioText.length} char bio${entry.photo ? " + photo" : ""})`);
  } catch (error) {
    report.push({ id, status: "error", error: String(error) });
    console.error(`✗ ${id}: ${error.message}`);
  }
  await delay(300);
}

await writeFile("migration/enrich-doctors-report.json", JSON.stringify(report, null, 1));
const failed = report.filter((r) => r.status !== "patched");
console.log(
  `DONE: ${report.length - failed.length}/${report.length} patched, ${failed.length} failed`,
);
