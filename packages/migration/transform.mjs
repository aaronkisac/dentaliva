// Runner: normalized/*.json → Sanity NDJSON + NAP diff report (MIG-2).
// Usage (repo root): node packages/migration/transform.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";

import {
  branchToSanity,
  buildNapReport,
  doctorToSanity,
  treatmentToSanity,
  validateDocs,
} from "./src/transform.ts";

// CPT-1: optional argv overrides for v2 re-extraction runs.
// INT-10: third arg selects the localeText slot the source copy fills.
const normalizedDir = process.argv[2] ?? "migration/normalized";
const outDir = process.argv[3] ?? "migration/ndjson";
const locale = process.argv[4] === "en" ? "en" : "tr";

async function load(type) {
  try {
    return JSON.parse(await readFile(`${normalizedDir}/${type}.json`, "utf8"));
  } catch {
    return [];
  }
}

const [core, treatments, doctors, branches] = await Promise.all([
  load("core"),
  load("treatment"),
  load("doctor"),
  load("branch"),
]);

const docs = [
  ...treatments.map((page) => treatmentToSanity(page, locale)),
  ...doctors.map(doctorToSanity),
  ...branches.map(branchToSanity),
];

const errors = validateDocs(docs, locale);
if (errors.length > 0) {
  console.error("VALIDATION FAILED:\n" + errors.join("\n"));
  process.exit(1);
}

const napReport = buildNapReport(
  core.filter((p) => p.url.includes("iletisim") || p.url.includes("hakkimizda")),
);

await mkdir(outDir, { recursive: true });
await writeFile(`${outDir}/core.ndjson`, docs.map((d) => JSON.stringify(d)).join("\n"));
await writeFile(`${outDir}/nap-diff.json`, JSON.stringify(napReport, null, 2));

console.log(
  `docs: ${docs.length} (treatments ${treatments.length}, doctors ${doctors.length}, branches ${branches.length})`,
);
console.log("NAP:", JSON.stringify(napReport, null, 2));
