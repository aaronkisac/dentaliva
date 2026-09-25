import { afterEach, describe, expect, it } from "vitest";

import { createReadClient, defaultEnv, pickLocalized } from "../src/client";

const envKeys = ["SANITY_PROJECT_ID", "SANITY_DATASET", "SANITY_API_VERSION"] as const;

afterEach(() => {
  for (const key of envKeys) delete process.env[key];
});

describe("createReadClient", () => {
  it("falls back to the committed defaults (real project)", () => {
    expect(defaultEnv().projectId).toBe("86x2hbzv");
    expect(defaultEnv().dataset).toBe("production");
    const client = createReadClient();
    expect(client.config().projectId).toBe("86x2hbzv");
    expect(client.config().dataset).toBe("production");
  });

  it("honors env overrides without a token (anonymous public reads)", () => {
    delete process.env.SANITY_READ_TOKEN; // simulate anonymous context
    process.env.SANITY_PROJECT_ID = "abc123";
    process.env.SANITY_DATASET = "staging";
    const client = createReadClient();
    expect(client.config().projectId).toBe("abc123");
    expect(client.config().dataset).toBe("staging");
    expect(client.config().token).toBeUndefined();
  });

  it("prefers explicit args over env", () => {
    process.env.SANITY_DATASET = "staging";
    const client = createReadClient({ dataset: "production" });
    expect(client.config().dataset).toBe("production");
  });
});

describe("pickLocalized", () => {
  it("returns tr by default and falls back en→tr", () => {
    expect(pickLocalized({ tr: "Gülüş tasarımı", en: "Smile design" })).toBe("Gülüş tasarımı");
    expect(pickLocalized({ tr: "Gülüş tasarımı", en: null }, "en")).toBe("Gülüş tasarımı");
  });

  it("returns empty string for missing values", () => {
    expect(pickLocalized(null)).toBe("");
    expect(pickLocalized({ tr: undefined, en: "x" }, "en")).toBe("x");
  });
});
