// Copy sweep (CPT-8 paketi): ekip bölümünün başlık/copy bloğunu homePage'e yazar.
// Komponentler artık yalnızca CMS'ten okur — bu script, mevcut onaylı copy'yi
// CMS'e taşır ki canlı görünüm değişmesin. Bir kez çalıştırılır, arşiv adayı.
//
// Kullanım: node scripts/seed-team-section.mjs [--dataset staging,production]
// Token: SANITY_AUTH_TOKEN env'i ya da Sanity CLI oturum dosyası.
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@sanity/client";

const PROJECT = "86x2hbzv";
const DATASETS = (
  process.argv.includes("--dataset")
    ? process.argv[process.argv.indexOf("--dataset") + 1]
    : (process.env.SANITY_DATASETS ?? "staging,production")
).split(",");

function resolveToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;
  // Sanity CLI oturumu — projenin kendi makinesindeki oturum dosyası.
  const raw = readFileSync(join(homedir(), ".config", "sanity", "config.json"), "utf8");
  const match = raw.match(/"(?:authToken|token)"\s*:\s*"([^"]+)"/);
  if (!match) throw new Error("Token bulunamadı — SANITY_AUTH_TOKEN verin.");
  return match[1];
}

// Onaylı mevcut copy (doctors.tsx'te hardcoded duruyordu).
const teamSection = {
  eyebrow: { tr: "Ekibimiz", en: "" },
  heading: { tr: "Uzmanlarımızla Tanışın", en: "" },
  text: {
    tr: "Deneyimli ve uzman hekimlerimiz, konforlu ve kaliteli hizmeti ilke edinmiştir.",
    en: "",
  },
};

const token = resolveToken();
for (const dataset of DATASETS) {
  const client = createClient({ projectId: PROJECT, dataset, token, apiVersion: "2024-10-01" });
  const home = await client.fetch('*[_type == "homePage"][0]{ _id }');
  if (!home?._id) {
    console.log(`[${dataset}] homePage yok, atlandı`);
    continue;
  }
  await client.patch(home._id).set({ teamSection }).commit();
  console.log(`[${dataset}] homePage.teamSection yazıldı (${home._id})`);
}
