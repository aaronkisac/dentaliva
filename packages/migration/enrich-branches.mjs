// CPT-2: live branch pages → address/phone/hours/mapUrl/geo → patch docs.
// Usage (repo root): node packages/migration/enrich-branches.mjs
import { readFile, writeFile } from "node:fs/promises";

import { parseBranchNap } from "./src/enrich-branch.ts";

const TOKEN = JSON.parse(
  await readFile(process.env.USERPROFILE + "/.config/sanity/config.json", "utf8"),
).authToken;
const PROJECT = "86x2hbzv";
const DATASET = "production";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const pages = JSON.parse(await readFile("migration/normalized-v2/branch.json", "utf8"));

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

const report = [];
for (const page of pages) {
  const slug = new URL(page.url).pathname.split("/").filter(Boolean).pop();
  const id = `branch.${slug}`;
  try {
    const html = await (await fetch(page.url)).text();
    // Branch place names are Turkish ("Avcılar") while slugs are ASCII.
    const nap = parseBranchNap(html, page.h1 || slug);
    if (!nap.phone && !nap.address) {
      report.push({ id, status: "no-nap-found" });
      continue;
    }
    await patchDoc(id, {
      ...(nap.phone ? { phone: nap.phone } : {}),
      ...(nap.address ? { address: { tr: nap.address } } : {}),
      ...(nap.hours ? { hours: { tr: nap.hours } } : {}),
      ...(nap.mapUrl ? { mapUrl: nap.mapUrl } : {}),
      ...(nap.geo ? { geo: { lat: nap.geo.lat, lng: nap.geo.lng } } : {}),
    });
    report.push({ id, status: "patched", ...nap });
    console.log(
      `✓ ${id} (phone ${nap.phone}, geo ${nap.geo ? `${nap.geo.lat}/${nap.geo.lng}` : "-"}, ${nap.address.length} char address)`,
    );
  } catch (error) {
    report.push({ id, status: "error", error: String(error) });
    console.error(`✗ ${id}: ${error.message}`);
  }
  await delay(300);
}

await writeFile("migration/enrich-branches-report.json", JSON.stringify(report, null, 1));
const failed = report.filter((r) => r.status !== "patched");
console.log(
  `DONE: ${report.length - failed.length}/${report.length} patched, ${failed.length} failed`,
);
