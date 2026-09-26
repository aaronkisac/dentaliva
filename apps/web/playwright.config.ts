import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.spec.ts",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:8788" },
  // DEP-2: header assertions (and the callback journey) need the production
  // static-assets server. Same reliable entrypoint the Lighthouse budget uses.
  webServer: {
    command: "node node_modules/wrangler/bin/wrangler.js dev --port 8788",
    url: "http://127.0.0.1:8788/robots.txt",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
