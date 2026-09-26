// PRF-3: Lighthouse performance budgets enforced in CI (fallback path per the
// issue: plain lighthouse + this assertion script — no lhci dependency).
//
// Serves the static export with `wrangler dev` — the same Workers static-
// assets runtime as production (ADR-001); a hand-rolled static server cannot
// reproduce Next 16's RSC payload URL scheme, so hand-rolled is not an option.
// Audits key routes with Lighthouse 13 and asserts all four categories score
// >= threshold (default 95). Exit code 1 with a score table on any failure.
//
// Local Chrome: chrome-launcher finds an installed Chrome/Edge; on machines
// without one, point CHROME_PATH at Playwright's chromium binary.
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { launch as launchChrome } from "chrome-launcher";
import lighthouse from "lighthouse";

const THRESHOLD = Number(process.env.LH_THRESHOLD ?? 95);
const PORT = Number(process.env.LH_PORT ?? 4173);
const ROUTES = ["", "/hizmetlerimiz/implant-tedavisi", "/iletisim"];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

/** Poll until wrangler answers, then keep the handle for teardown. */
function startWrangler() {
  // Run wrangler's JS entry via node: spawning npx.cmd on Windows needs
  // shell:true (EINVAL otherwise), which mangles argument quoting.
  const wranglerBin = join(process.cwd(), "node_modules", "wrangler", "bin", "wrangler.js");
  const child = spawn(process.execPath, [wranglerBin, "dev", "--port", String(PORT)], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", (chunk) => console.error(String(chunk)));
  const ready = new Promise((resolve, reject) => {
    const started = Date.now();
    const poll = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${PORT}/robots.txt`);
        if (res.ok) {
          resolve(child);
          return;
        }
      } catch {
        // not up yet
      }
      if (Date.now() - started > 90_000) {
        reject(new Error("wrangler dev 90 saniyede hazır olmadı"));
        return;
      }
      setTimeout(poll, 750);
    };
    void poll();
  });
  return { child, ready };
}

function stopWrangler(child) {
  return new Promise((done) => {
    child.once("exit", () => done());
    if (process.platform === "win32") {
      // kill() alone leaves the wrangler node tree alive on Windows.
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
      done();
    } else {
      child.kill("SIGTERM");
      setTimeout(() => {
        child.kill("SIGKILL");
        done();
      }, 3_000);
    }
  });
}

async function auditRoute(route) {
  // new URL joins cleanly — string concat would produce a double slash and a
  // 620 ms redirect roundtrip on throttled mobile.
  const url = new URL(route, `http://127.0.0.1:${PORT}/`).href;
  // Fresh Chrome per route: a warm instance poisons later runs (NO_FCP →
  // all-zero categories when a slow first audit starves the next one).
  // A user-supplied userDataDir stops chrome-launcher from creating its own
  // tmp dir — whose exit-time rmSync dies with EPERM behind Windows AV locks.
  const { mkdtemp, rm } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const userDataDir = await mkdtemp(join(tmpdir(), "lh-profile-"));
  const chromeHandle = await launchChrome({
    userDataDir,
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const result = await lighthouse(
      url,
      { port: chromeHandle.port, output: "json", logLevel: "error" },
      { extends: "lighthouse:default", settings: { onlyCategories: [...CATEGORIES] } },
    );
    if (!result) throw new Error(`Lighthouse çalışmadı: ${url}`);
    /** @type {Record<string, number>} */
    const scores = {};
    for (const category of CATEGORIES) {
      scores[category] = Math.round((result.lhr.categories[category]?.score ?? 0) * 100);
    }
    return { scores, lhr: result.lhr };
  } finally {
    // kill() can also throw synchronously (EPERM) behind Windows AV locks.
    try {
      await chromeHandle.kill();
    } catch {
      // ignore
    }
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
  }
}

const { child, ready } = startWrangler();
try {
  await ready;

  const rows = [];
  for (const route of ROUTES) {
    const { scores, lhr } = await auditRoute(route);
    rows.push({ route: route || "/", scores, lhr });
  }

  const failed = rows.filter((row) =>
    CATEGORIES.some((category) => (row.scores[category] ?? 0) < THRESHOLD),
  );

  console.log(`\nLighthouse bütçeleri (eşik: ${THRESHOLD})`);
  for (const { route, scores } of rows) {
    const cells = CATEGORIES.map((c) => `${c}=${scores[c]}`).join("  ");
    const mark = CATEGORIES.every((c) => (scores[c] ?? 0) >= THRESHOLD) ? "✓" : "✗";
    console.log(` ${mark} ${route.padEnd(34)} ${cells}`);
  }

  if (failed.length > 0) {
    // Persist full reports for the failing routes so the failing audits can be
    // inspected locally (gitignored).
    await mkdir(".lighthouse", { recursive: true });
    for (const { route, lhr } of failed) {
      const name = (route === "/" ? "root" : route.replaceAll("/", "_").slice(1)) + ".report.json";
      await writeFile(join(".lighthouse", name), JSON.stringify(lhr));
    }
    console.error(
      `\nBütçe aşıldı: ${failed.map((f) => f.route).join(", ")} (raporlar: .lighthouse/)`,
    );
    process.exitCode = 1;
  } else {
    console.log("\nTüm rotalar bütçe içinde.");
  }
} finally {
  await stopWrangler(child);
}
