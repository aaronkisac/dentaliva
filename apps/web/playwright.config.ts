import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.spec.ts",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:8788" },
  // DEP-2: header assertions (and the callback journey) need the production
  // static-assets server. Same reliable entrypoint the Lighthouse budget uses.
  // --var forces MOCK_EXTERNAL=1 in dev: the checked-in config now carries the
  // production value ("0"), E2E must never mail for real.
  webServer: {
    command: "node node_modules/wrangler/bin/wrangler.js dev --port 8788 --var MOCK_EXTERNAL:1",
    url: "http://127.0.0.1:8788/robots.txt",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
