// DEP-2: generate out/_headers after the export (npm postbuild).
//
// Static security headers as reviewed code. The Content-Security-Policy is
// emitted per route because it carries per-build SHA-256 hashes of the inline
// scripts Next embeds into that page — 'unsafe-inline' is deliberately NOT
// granted for scripts, and a single site-wide CSP (all 200+ payload hashes)
// blows past header-size limits. Third-party surfaces (reviewed in DEP-2):
//   - Turnstile widget: challenges.cloudflare.com (script/frame/connect/worker)
//   - video testimonials: www.youtube-nocookie.com (frame)
//   - Sanity CDN images: cdn.sanity.io (img)
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const OUT = join(process.cwd(), "out");

/** Exported HTML file → site route ("" for the home page). */
function routeOf(file) {
  const rel = file
    .slice(OUT.length + 1)
    .replace(/\\/g, "/")
    .slice(0, -".html".length);
  return rel === "index" ? "/" : `/${rel}`;
}

function cspFor(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes, "https://challenges.cloudflare.com"].join(" ")}`,
    // next/font injects inline @font-face; Turnstile injects inline styles.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
    "font-src 'self'",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com https://www.youtube-nocookie.com",
    "media-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

async function hashesOf(file) {
  const html = await readFile(file, "utf8");
  const hashes = new Set();
  for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const content = match[1];
    if (content.trim() === "") continue;
    hashes.add(`'sha256-${createHash("sha256").update(content).digest("base64")}'`);
  }
  return hashes;
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

if (!existsSync(OUT)) {
  console.error("out/ bulunamadı — önce next build çalışmalı (postbuild sırası).");
  process.exit(1);
}

const COMMON = `  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  Cross-Origin-Opener-Policy: same-origin
`;

const sections = [`/*\n${COMMON}`];
const routes = [];
for await (const file of walk(OUT)) {
  const hashes = await hashesOf(file);
  const route = routeOf(file);
  routes.push(route);
  sections.push(`${route}\n  Content-Security-Policy: ${cspFor(hashes)}\n`);
}

await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, "_headers"), sections.join("\n"));
console.log(
  `_headers yazıldı: ${routes.length} rota için CSP (${COMMON.split("\n").length - 2} ortak başlık).`,
);
