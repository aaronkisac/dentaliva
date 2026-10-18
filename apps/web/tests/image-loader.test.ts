import { afterEach, describe, expect, it } from "vitest";

import sanityLoader from "../src/image-loader";

const ENV_KEYS = ["SANITY_PROJECT_ID", "SANITY_DATASET"] as const;

afterEach(() => {
  for (const key of ENV_KEYS) delete process.env[key];
});

describe("sanity image loader (ADR-006)", () => {
  it("builds a CDN URL with width and quality", () => {
    const url = sanityLoader({ src: "image-abc123-1900x1200-jpg", width: 640, quality: 80 });
    expect(url).toContain("cdn.sanity.io");
    expect(url).toContain("640");
    expect(url).toContain("80");
  });

  it("falls back to q=75 and the registry project", () => {
    const url = sanityLoader({ src: "image-abc123-800x600-jpg", width: 320 });
    expect(url).toContain("cdn.sanity.io");
    expect(url).toContain("86x2hbzv");
    expect(url).toContain("q=75");
  });

  it("keeps the project registry-bound; the dataset follows the build (INT-8)", () => {
    // A stale .env value must never cross-wire a SITE_ID=eu build onto the
    // com project's CDN (INT-1); the dataset switch is per-build by design
    // (eu staging targets its own project's staging dataset).
    process.env.SANITY_PROJECT_ID = "proj-test";
    process.env.SANITY_DATASET = "staging";
    const url = sanityLoader({ src: "image-abc123-800x600-jpg", width: 320 });
    expect(url).toContain("86x2hbzv");
    expect(url).toContain("staging");
    expect(url).not.toContain("proj-test");
  });
});
