import { describe, expect, it } from "vitest";

import { blogPost } from "../src/documents/blog-post";
import { branch } from "../src/documents/branch";
import { doctor } from "../src/documents/doctor";
import { legalPage } from "../src/documents/legal-page";
import { treatment } from "../src/documents/treatment";
import { PUBLISHABLE_SLUG_PATTERN, publishableSlugValidation } from "../src/slug";

type SlugField = { fields?: readonly unknown[] };

function slugValidationOf(type: SlugField): (rule: unknown) => unknown {
  const field = (type.fields ?? []).find((f) => (f as { name?: string }).name === "slug") as {
    validation?: (rule: unknown) => unknown;
  };
  expect(field, "slug field must exist").toBeDefined();
  return field.validation as (rule: unknown) => unknown;
}

/** Sanity Rule zincirini çalan Proxy — custom fn'i yakalar (repo deseni). */
function capturedCustom(validation: (rule: unknown) => unknown) {
  let custom: unknown;
  const rule: unknown = new Proxy(() => rule, {
    get: (_target, prop) =>
      prop === "custom"
        ? (fn: unknown) => {
            custom = fn;
            return rule;
          }
        : () => rule,
    apply: () => rule,
  });
  validation(rule);
  return custom as (value?: { current?: string }) => string | true;
}

describe("publishable slug validation (DSN-100)", () => {
  it.each([
    ["treatment", treatment],
    ["doctor", doctor],
    ["branch", branch],
    ["blogPost", blogPost],
    ["legalPage", legalPage],
  ])("%s slug alanı publishableSlugValidation kullanır", (_name, type) => {
    const validate = capturedCustom(slugValidationOf(type));
    expect(typeof validate).toBe("function");
    // site'in bugün taşıdığı slug biçimleri geçerli
    expect(validate({ current: "avcilar" })).toBe(true);
    expect(validate({ current: "dis-beyazlatma" })).toBe(true);
    expect(validate({ current: "all-on-four" })).toBe(true);
    // bozuk slug'lar: nokta, büyük harf, boşluk, Türkçe harf
    expect(validate({ current: "google.com" })).toContain("küçük harf");
    expect(validate({ current: "Hizmet" })).toContain("küçük harf");
    expect(validate({ current: "guzel alan" })).toContain("küçük harf");
    expect(validate({ current: "diş-beyazlatma" })).toContain("küçük harf");
    // boş değer required() tarafından ayrıca yakalanır — custom true döner
    expect(validate(undefined)).toBe(true);
    expect(validate({ current: "" })).toBe(true);
  });

  it("publishableSlugValidation doğrudan çağrıda da zincirleme çalışır", () => {
    const validate = capturedCustom(
      publishableSlugValidation as unknown as (rule: unknown) => unknown,
    );
    expect(validate({ current: "hizmet-sayfasi" })).toBe(true);
    expect(validate({ current: "ornek.hatali" })).toContain("küçük harf");
  });

  it("desen boş string'i reddeder, tireli slug'ı kabul eder", () => {
    expect(PUBLISHABLE_SLUG_PATTERN.test("")).toBe(false);
    expect(PUBLISHABLE_SLUG_PATTERN.test("ornek-2")).toBe(true);
  });
});
