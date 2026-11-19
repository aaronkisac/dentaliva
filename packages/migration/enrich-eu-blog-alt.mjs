#!/usr/bin/env node
/**
 * DSN-96 takip — eu blog hero görseli alt metinleri MALFORME: migrasyon
 * alt.en slotuna iç içe localeString yazmış ({en: {tr: "metin"}}) — doğru
 * şekil {en: "metin"}. Yeni stüdyo validator'ı görünen (en) slotu ister;
 * slot nesne olduğu için eu stüdyosunda "Alt metin zorunludur" kalırdı.
 * Bu script alt.en'i DÜZ METNE çeker (site alt metni de düzelir).
 *
 * enrich-* ailesi deseni: PATCH-never-replace, dry-run default (--apply ile
 * yazar), idempotent (düzgün şekilli alt'lar atlanır).
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(new URL("../../apps/web/package.json", import.meta.url));
const { createClient } = require("@sanity/client");

const APPLY = process.argv.includes("--apply");
const PROJECT_ID = process.env.MIGRATION_PROJECT_ID ?? "84n9qnfg";
const DATASET = process.env.MIGRATION_DATASET ?? "production";

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
  console.error("Sanity CLI oturum token'ı bulunamadı.");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-10-01",
  token: readToken(),
  useCdn: false,
});

const posts = await client.fetch(
  `*[_type == "blogPost" && defined(heroImage.alt.en)]{ _id, "altEn": heroImage.alt.en }`,
);

const plans = [];
for (const post of posts) {
  const malformed =
    post.altEn && typeof post.altEn === "object" && typeof post.altEn.tr === "string";
  if (malformed) {
    plans.push({ id: post._id, text: post.altEn.tr });
  }
}

console.log(
  `\n=== eu blog hero alt.en düzeltme — ${PROJECT_ID}/${DATASET} (${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`,
);
for (const p of plans) {
  console.log(`${APPLY ? "→" : "·"} ${p.id}: "${p.text}"`);
}
console.log(`\n${plans.length} alt düzeltilecek, ${posts.length - plans.length} no-op.\n`);

if (!APPLY) {
  console.log("Dry-run — yazmak için: node packages/migration/enrich-eu-blog-alt.mjs --apply");
  process.exit(0);
}

if (plans.length === 0) {
  console.log("Yazılacak değişiklik yok.");
  process.exit(0);
}

for (const p of plans) {
  await client.patch(p.id).set({ "heroImage.alt.en": p.text }).commit();
}
console.log(`OK — ${plans.length} blog alt metni düz metne çekildi.`);
