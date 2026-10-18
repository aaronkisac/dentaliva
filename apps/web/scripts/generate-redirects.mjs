// Generates apps/web/public/_redirects from CMS redirect docs (SEO-4).
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { createReadClient } from "@dentaliva/sanity-schema/client";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Local builds load apps/web/.env (Next does this for the app; scripts need it manually).
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0 && !line.startsWith("#")) {
      const key = line.slice(0, eq).trim();
      if (!(key in process.env)) process.env[key] = line.slice(eq + 1).trim();
    }
  }
}

// INT-8: redirect rules come from the ACTIVE site's project — never from a
// hardcoded/default project (a SITE_ID=eu build must read eu's CMS). The
// shared .env token belongs to the project named in that same .env; for any
// other site it must NOT be sent (tokens are project-scoped) — a
// site-specific SANITY_READ_TOKEN_<ID> takes over, else anonymous reads.
const siteId = process.env.SITE_ID ?? "com";
const site = (await import(pathToFileURL(join(process.cwd(), "sites", `${siteId}.ts`)).href)).site;
const envProject = process.env.SANITY_PROJECT_ID;
const token =
  site.sanity.projectId === envProject
    ? process.env.SANITY_READ_TOKEN || ""
    : process.env[`SANITY_READ_TOKEN_${siteId.toUpperCase()}`] || "";
const readClient = createReadClient({
  projectId: site.sanity.projectId,
  dataset: process.env.SANITY_DATASET ?? site.sanity.dataset,
  token,
});

const docs =
  (await readClient.fetch(`*[_type == "redirect"]{ "from": from.current, to, permanent }`)) ?? [];

const lines = docs
  .filter((doc) => doc.from && doc.to)
  .map((doc) => `${doc.from}  ${doc.to}  ${doc.permanent === false ? "302" : "301"}`);

const target = path.join("public", "_redirects");
await mkdir("public", { recursive: true });
await writeFile(target, lines.length > 0 ? lines.join("\n") + "\n" : "");
console.log(`_redirects: ${lines.length} rules`);
