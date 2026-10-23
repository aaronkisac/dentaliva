// SUBE-1 (issue #310): com production dataset'inin şube dokümanlarını
// orijinal www.dentaliva.com şube sayfalarındaki bilgilerle düzeltir.
//
// Migration şube NAP'ini taşıdı ama telefonları üç şubede de merkez
// numarasına eşitledi, Başakşehir'in kendi çalışma saatini site geneline
// zorladı, şube görsellerini hiç taşımadı ve Avcılar/Altunizade mapUrl'lerini
// çıplak koordinat araması olarak bıraktı. Orijinal sayfalarla birebir
// karşılaştırma (2026-10-23):
//
//   Avcılar     tel 0 530 840 5482 · saat bloğu orijinal sayfada yok (site
//               geneli "Tüm Günler | 9:00 - 23:00" korunuyor, trim) · görsel
//               wp-content/uploads/2025/10/avcilar.jpg · harita sorgusu isim
//               bazlı ("Avcılar Dentaliva Ağız ve Diş Sağlığı Polikliniği")
//   Başakşehir  tel 0 507 624 9120 · saatler Pzt–Cmt 09:00–19:00, Pazar kapalı
//               · görsel basaksehir.jpg · mapUrl yerinde (place linki)
//   Altunizade  tel 0 530 125 5482 (tabelayla teyitli) · adres "No:90B"
//               (dataset "No:90 B") · görsel altunizade.jpg · harita isim bazlı
//
// Telefonlar site formatına (+90 xxx xxx xx xx, siteSettings.phone ile aynı)
// çevrildi — validTrPhone boşluklu değeri kabul eder. Avcılar tabelasında
// 0530 840 5482 görünmese de orijinal SAYFA verisi esas alındı (aynı numara
// projenin WhatsApp kanalı).
//
// Diğer enrich-* scriptleriyle aynı kurallar: PATCH (never createOrReplace),
// CLI oturum token'ı, varsayılan dry-run, `--apply` ile yazar.
//
//   node packages/migration/fix-com-branches.mjs            # plan only
//   node packages/migration/fix-com-branches.mjs --apply    # write

import { readFileSync, writeFileSync } from "node:fs";

const PROJECT = "86x2hbzv"; // com
const DATASET = "production";
const LEGACY = "https://www.dentaliva.com/wp-content/uploads/2025/10";
const APPLY = process.argv.includes("--apply");
const DELAY = 400;
const UA = { "User-Agent": "Mozilla/5.0 (migration; dentaliva-rebuild)" };

const TOKEN = JSON.parse(
  readFileSync(`${process.env.USERPROFILE}/.config/sanity/config.json`, "utf8"),
).authToken;
if (!TOKEN) throw new Error("no Sanity CLI session token");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (m) =>
  console.error(`[fix-com-branches] ${new Date().toISOString().slice(11, 19)} ${m}`);

async function groq(query) {
  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v2024-10-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  );
  const json = await res.json();
  if (json.error) throw new Error(`GROQ ${json.error.type}: ${json.error.description}`);
  return json.result;
}

async function uploadImage(url) {
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`image ${url} → ${res.status}`);
  const body = Buffer.from(await res.arrayBuffer());
  const filename = url.split("/").pop();
  const up = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/assets/images/${DATASET}?filename=${filename}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "image/jpeg" },
      body,
    },
  );
  if (!up.ok) throw new Error(`upload ${filename} → ${up.status}`);
  const json = await up.json();
  const ref = json.document._id;
  log(`asset: ${filename} → ${ref}`);
  return ref;
}

const mapsSearch = (name) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Dentaliva ${name} Ağız ve Diş Sağlığı Polikliniği`,
  )}`;

// Orijinal şube sayfalarından okunan hedef değerler.
const TARGETS = {
  avcilar: {
    _id: "branch.avcilar",
    set: {
      phone: "+90 530 840 54 82",
      hours: { _type: "localeText", tr: "Tüm Günler | 9:00 - 23:00" },
      mapUrl: mapsSearch("Avcılar"),
    },
    image: { file: "avcilar.jpg", alt: "Dentaliva Avcılar şubesi binası ve tabelası" },
  },
  basaksehir: {
    _id: "branch.basaksehir",
    set: {
      phone: "+90 507 624 91 20",
      hours: {
        _type: "localeText",
        tr: "Pazartesi – Cumartesi: 09:00 – 19:00 · Pazar: Kapalı",
      },
      // mapUrl dokunulmadı: dataset'te zaten orijinalin işletme place linki var.
    },
    image: { file: "basaksehir.jpg", alt: "Dentaliva Başakşehir şubesi binası ve tabelası" },
  },
  altunizade: {
    _id: "branch.altunizade",
    set: {
      phone: "+90 530 125 54 82",
      hours: { _type: "localeText", tr: "Tüm Günler | 9:00 - 23:00" },
      address: {
        _type: "localeText",
        tr: "Altunizade, Nuhkuyusu Cd No:90B, 34662 Üsküdar/İstanbul",
      },
      mapUrl: mapsSearch("Altunizade"),
    },
    image: { file: "altunizade.jpg", alt: "Dentaliva Altunizade şubesi binası ve tabelası" },
  },
};

async function main() {
  const current = await groq(
    '*[_type=="branch"]{_id, name, phone, "hours": hours.tr, "address": address.tr, mapUrl, "imageRef": image.asset._ref} | order(name asc)',
  );
  const plan = [];

  for (const target of Object.values(TARGETS)) {
    const doc = current.find((b) => b._id === target._id);
    if (!doc) throw new Error(`branch doc not found: ${target._id}`);
    const changed = {};
    for (const [field, value] of Object.entries(target.set)) {
      const now = doc[field];
      const next = typeof value === "string" ? value : value.tr;
      if (now !== next) changed[field] = value;
    }
    if (!doc.imageRef)
      changed.image = {
        _type: "imageWithAlt",
        asset: { _type: "reference", _ref: "PENDING" },
        alt: { _type: "localeString", tr: target.image.alt },
      };
    plan.push({ _id: target._id, name: doc.name, changed, imageFile: target.image.file });
  }

  console.log(`\n=== PLAN (${APPLY ? "APPLY" : "DRY-RUN"}) ===`);
  for (const p of plan) {
    console.log(`\n${p.name} (${p._id})`);
    for (const [field, value] of Object.entries(p.changed)) {
      const next =
        typeof value === "string" ? value : field === "image" ? `< ${p.imageFile} >` : value.tr;
      console.log(`  ${field.padEnd(8)} → ${next}`);
    }
  }

  if (!APPLY) {
    writeFileSync("packages/migration/fix-com-branches-plan.json", JSON.stringify(plan, null, 2));
    console.log("\ndry-run: plan yazıldı (Sanity'e hiçbir şey yazılmadı)");
    return;
  }

  for (const p of plan) {
    if (p.changed.image) {
      p.changed.image.asset._ref = await uploadImage(`${LEGACY}/${p.imageFile}`);
      await sleep(DELAY);
    }
  }

  const mutations = plan
    .filter((p) => Object.keys(p.changed).length > 0)
    .map(({ _id, changed }) => ({ patch: { id: _id, set: changed } }));
  if (mutations.length === 0) {
    console.log("yazılacak değişiklik yok");
    return;
  }

  const res = await fetch(
    `https://${PROJECT}.api.sanity.io/v1/data/mutate/${DATASET}?returnDocuments=false`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations }),
    },
  );
  if (!res.ok) throw new Error(`mutate → ${res.status} ${await res.text()}`);
  log(`applied ${mutations.length} mutations`);

  // Uygulama sonrası doğrulama
  const after = await groq(
    '*[_type=="branch"]{_id, phone, "hours": hours.tr, "address": address.tr, mapUrl, "imageRef": image.asset._ref, "alt": image.alt.tr} | order(name asc)',
  );
  writeFileSync(
    "packages/migration/fix-com-branches-report.json",
    JSON.stringify({ applied: mutations.length, after }, null, 2),
  );
  for (const b of after) {
    console.log(`\nVERIFY ${b._id}`);
    console.log(`  phone : ${b.phone}`);
    console.log(`  hours : ${b.hours}`);
    console.log(`  addr  : ${b.address}`);
    console.log(`  map   : ${b.mapUrl}`);
    console.log(`  image : ${b.imageRef} (${b.alt})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
