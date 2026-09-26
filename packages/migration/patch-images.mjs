// Patches heroImage (treatment) / photo (doctor) with the uploaded assets.
import { readFile } from "node:fs/promises";

const TOKEN = JSON.parse(
  await readFile(process.env.USERPROFILE + "/.config/sanity/config.json", "utf8"),
).authToken;
const map = JSON.parse(await readFile("../../migration/image-asset-map.json", "utf8"));
const plan = JSON.parse(await readFile("../../migration/image-plan.json", "utf8"));
const typeBySlug = Object.fromEntries(plan.map((p) => [p.slug, p.type]));

const mutations = [];
for (const [slug, info] of Object.entries(map)) {
  const type = typeBySlug[slug] ?? "treatment";
  const id = `${type}.${slug}`;
  const field = type === "doctor" ? "photo" : "heroImage";
  mutations.push({
    patch: {
      id,
      set: {
        [field]: {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: info.assetId },
          alt: { tr: info.name },
        },
      },
    },
  });
}

for (let i = 0; i < mutations.length; i += 25) {
  const batch = mutations.slice(i, i + 25);
  const res = await fetch(
    "https://86x2hbzv.api.sanity.io/v1/data/mutate/production?returnDocuments=false",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ mutations: batch }),
    },
  );
  if (!res.ok) {
    console.error(`batch ${i} failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  console.log(`patched ${Math.min(i + 25, mutations.length)}/${mutations.length}`);
}
