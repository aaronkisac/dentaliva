#!/usr/bin/env node
/**
 * DSN-96 takip — eu blog başlıkları: title.tr dolu, title.en BOŞ (migrasyon
 * eu içeriğini tr slotuna yazmış) → eu stüdyosunda başlık (EN, görünür+zorunlu)
 * "Bu alan zorunludur" basıyordu. Bu script title.tr → title.en kopyalar
 * (site çıktısı değişmez — t() zaten tr fallback'i basıyordu).
 *
 * enrich-* ailesi deseni: PATCH-never-replace, dry-run default (--apply ile
 * yazar), idempotent (en doluysa atlanır).
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
      const alt = typeof raw === "string" ? raw : null;
      if (typeof tok === "string" && tok.length > 10) return tok;
      if (typeof alt === "string" && alt.length > 10) return alt;
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
  `*[_type == "blogPost" && defined(title.tr)]{ _id, "title": title }`,
);

const plans = [];
for (const post of posts) {
  const trFilled = typeof post.title?.tr === "string" && post.title.tr.trim() !== "";
  const enEmpty = emptyOf(post.title?.en);
  if (trFilled && enEmpty) {
    plans.push({ id: post._id, from: post.title.tr });
  }
}
function emptyOf(v) {
  return typeof v !== "string" || v.trim() === "";
}

console.log(
  `\n=== eu blog title.tr → title.en kopyalama — ${PROJECT_ID}/${DATASET} (${APPLY ? "APPLY" : "DRY-RUN"}) ===\n`,
);
for (const p of plans) {
  console.log(`${APPLY ? "→" : "·"} ${p.id}`);
  console.log(`    ${p.from}`);
}
console.log(`\n${plans.length} yazı kopyalanacak, ${posts.length - plans.length} no-op.\n`);

if (!APPLY) {
  console.log("Dry-run — yazmak için: node packages/migration/enrich-eu-blog-titles.mjs --apply");
  process.exit(0);
}

if (plans.length === 0) {
  console.log("Yazılacak değişiklik yok.");
  process.exit(0);
}

for (const p of plans) {
  // title.en, localeString'in İÇ string slotudur — nesne değil düz metin yazılır.
  await client.patch(p.id).set({ "title.en": p.from }).commit();
}
console.log(`OK — ${plans.length} yazının title.en alanı yazıldı.`);
