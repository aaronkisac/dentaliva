import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

// CI builds run without a local .env (the token arrives via the
// SANITY_READ_TOKEN secret); this suite only guards local wiring.
const hasLocalEnv = existsSync(".env");

function readEnvFile(): Record<string, string> {
  const lines = readFileSync(".env", "utf8").split("\n");
  const entries: Array<[string, string]> = [];
  for (const line of lines) {
    const eq = line.indexOf("=");
    if (eq === -1 || line.startsWith("#")) continue;
    entries.push([line.slice(0, eq).trim(), line.slice(eq + 1).trim()]);
  }
  return Object.fromEntries(entries);
}

describe("sanity env wiring (local)", () => {
  it.skipIf(!hasLocalEnv)("loads the live project id from .env", () => {
    const env = readEnvFile();
    expect(env.SANITY_PROJECT_ID).toBe("86x2hbzv");
    expect(env.SANITY_DATASET).toBe("production");
    expect(env.SANITY_READ_TOKEN?.startsWith("sk")).toBe(true);
  });

  it("keeps .env out of git via .gitignore", () => {
    const gitignore = existsSync("../../.gitignore")
      ? readFileSync("../../.gitignore", "utf8")
      : "";
    expect(gitignore).toContain(".env");
  });
});
