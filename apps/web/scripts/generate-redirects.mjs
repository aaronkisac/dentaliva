// Generates apps/web/public/_redirects from CMS redirect docs (SEO-4).
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { createReadClient } from "@dentaliva/sanity-schema/client";

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

const readClient = createReadClient({});

const docs =
  (await readClient.fetch(`*[_type == "redirect"]{ "from": from.current, to, permanent }`)) ?? [];

const lines = docs
  .filter((doc) => doc.from && doc.to)
  .map((doc) => `${doc.from}  ${doc.to}  ${doc.permanent === false ? "302" : "301"}`);

const target = path.join("public", "_redirects");
await mkdir("public", { recursive: true });
await writeFile(target, lines.length > 0 ? lines.join("\n") + "\n" : "");
console.log(`_redirects: ${lines.length} rules`);
