import { describe, expect, it, vi } from "vitest";

import { imageWithAlt } from "../src/objects/image-with-alt";
import { localeString, localeText } from "../src/objects/locale-text";
import { seo } from "../src/objects/seo";

function findField(type: { fields?: Array<{ name: string }> }, name: string) {
  const field = type.fields?.find((f) => f.name === name);
  expect(field, `field ${name} must exist`).toBeDefined();
  return field;
}

describe("locale objects", () => {
  it.each([
    ["localeString", localeString],
    ["localeText", localeText],
  ])("%s declares tr required-ish and en optional", (name, type) => {
    expect(type.name).toBe(name);
    expect(findField(type, "tr")).toBeDefined();
    expect(findField(type, "en")).toBeDefined();
  });
});

describe("imageWithAlt", () => {
  it("requires localized alt and enables hotspot", () => {
    expect(findField(imageWithAlt, "alt")).toBeDefined();
    expect(imageWithAlt.options).toMatchObject({ hotspot: true });
  });
});

describe("seo", () => {
  it("exposes the SEO manager fields", () => {
    for (const name of [
      "metaTitle",
      "metaDescription",
      "ogImage",
      "noIndex",
      "canonicalOverride",
    ]) {
      expect(findField(seo, name)).toBeDefined();
    }
  });
});

/**
 * Fake Sanity Rule: chainable for everything, captures rule.custom validators
 * so the wiring (not just the pure validators) is executed and asserted.
 */

function fakeRule() {
  const captured: { custom?: (value: unknown) => unknown } = {};
  const rule: unknown = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "custom") {
          return (fn: (value: unknown) => unknown) => {
            captured.custom = fn;
            return rule;
          };
        }
        return () => rule;
      },
    },
  );
  return { rule, captured };
}

type AnyField = { name: string; validation?: unknown };

function fieldsOf(type: { fields?: readonly unknown[] }): AnyField[] {
  return (type.fields ?? []) as AnyField[];
}

describe("validation wiring on schema objects", () => {
  it("localeString tr rejects empty and accepts content through its Rule", () => {
    const field = fieldsOf(localeString).find((f) => f.name === "tr");
    const { rule, captured } = fakeRule();
    (field?.validation as (rule: unknown) => unknown)(rule);
    expect(captured.custom?.(" ")).toBe("Bu alan zorunludur");
    expect(captured.custom?.("Gülüş tasarımı")).toBe(true);
  });

  it("localeText tr wires the same guard", () => {
    const field = fieldsOf(localeText).find((f) => f.name === "tr");
    const { rule, captured } = fakeRule();
    (field?.validation as (rule: unknown) => unknown)(rule);
    expect(captured.custom?.("")).toBe("Bu alan zorunludur");
  });

  it("imageWithAlt alt validates the localized object", () => {
    const field = fieldsOf(imageWithAlt).find((f) => f.name === "alt");
    const { rule, captured } = fakeRule();
    (field?.validation as (rule: unknown) => unknown)(rule);
    expect(captured.custom?.(undefined)).toBe("Türkçe içerik zorunludur");
    expect(captured.custom?.({ tr: "Hasta gülümsüyor" })).toBe(true);
  });

  it("every seo field with validation executes its chain", () => {
    for (const field of fieldsOf(seo)) {
      if (!field.validation) continue;
      const { rule } = fakeRule();
      expect(() => (field.validation as (rule: unknown) => unknown)(rule)).not.toThrow();
    }
  });
});

describe("studioLocale parameterization (INT-7)", () => {
  // The required/optional branch union erases `validation` on the inferred
  // type; cast to the runtime shape that the Rule walker already pins down.
  type Loose = { name: string; title?: string; validation?: unknown };
  const fieldsOf = (t: { fields: unknown[] }) => t.fields as Loose[];

  it("defaults to the tr studio: tr required and first, en/nl optional", () => {
    const fields = fieldsOf(localeString);
    expect(fields.map((f) => f.name)).toEqual(["tr", "en", "nl"]);
    expect(fields[0]?.validation).toBeDefined();
    expect(fields.slice(1).every((f) => f.validation === undefined)).toBe(true);
  });

  it("builds the en studio when SANITY_STUDIO_DEFAULT_LOCALE=en", async () => {
    vi.stubEnv("SANITY_STUDIO_DEFAULT_LOCALE", "en");
    vi.resetModules();
    const {
      localeString: enString,
      localeText: enText,
      studioLocale,
    } = await import("../src/objects/locale-text");
    expect(studioLocale).toBe("en");
    const strFields = fieldsOf(enString);
    expect(strFields.map((f) => f.name)).toEqual(["en", "tr", "nl"]);
    expect(strFields[0]?.title).toBe("English");
    expect(strFields[0]?.validation).toBeDefined();
    expect(strFields.slice(1).every((f) => f.validation === undefined)).toBe(true);
    expect(fieldsOf(enText).map((f) => f.name)).toEqual(["en", "tr", "nl"]);
    vi.unstubAllEnvs();
    vi.resetModules();
  });
});

describe("nl studio (NL-1)", () => {
  it("builds the nl studio when SANITY_STUDIO_DEFAULT_LOCALE=nl", async () => {
    vi.stubEnv("SANITY_STUDIO_DEFAULT_LOCALE", "nl");
    vi.resetModules();
    const { localeString: nlString, studioLocale } = await import("../src/objects/locale-text");
    expect(studioLocale).toBe("nl");
    const fields = fieldsOf(nlString);
    expect(fields.map((f) => f.name)).toEqual(["nl", "tr", "en"]);
    expect(fields[0]?.title).toBe("Nederlands");
    expect(fields[0]?.validation).toBeDefined();
    vi.unstubAllEnvs();
    vi.resetModules();
  });
});
