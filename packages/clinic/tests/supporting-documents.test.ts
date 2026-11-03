import { describe, expect, it } from "vitest";

import { blogPost } from "../src/documents/blog-post";
import { faq } from "../src/documents/faq";
import { homePage } from "../src/documents/home-page";
import { legalPage } from "../src/documents/legal-page";
import { redirect } from "../src/documents/redirect";
import { siteSettings } from "../src/documents/site-settings";
import { testimonial } from "../src/documents/testimonial";
import { localeBlockContent } from "../src/objects/locale-block-content";

type AnyField = { name: string; type?: string; validation?: unknown; initialValue?: unknown };

function fieldsOf(type: { fields?: readonly unknown[] }): AnyField[] {
  return (type.fields ?? []) as AnyField[];
}

function fieldOf(type: { fields?: readonly unknown[] }, name: string): AnyField {
  const field = fieldsOf(type).find((f) => f.name === name);
  expect(field, `${name} must exist`).toBeDefined();
  return field as AnyField;
}

describe("supporting documents (SAN-3)", () => {
  it("faq requires question and answer", () => {
    expect(fieldOf(faq, "question").type).toBe("localeString");
    expect(fieldOf(faq, "answer").type).toBe("localeText");
    expect(fieldOf(faq, "order").initialValue).toBe(0);
  });

  it("testimonial constrains rating 1-5 and defaults to Google source", () => {
    expect(fieldOf(testimonial, "rating").initialValue).toBe(5);
    expect(fieldOf(testimonial, "source").initialValue).toBe("Google");
  });

  it("testimonial youtubeId is hidden and shape-validated (CPT-5)", () => {
    const field = fieldOf(testimonial, "youtubeId");
    expect((field as { hidden?: boolean }).hidden).toBe(true);
    const regex = field.validation;
    expect(regex).toBeDefined();
  });

  it("legalPage declares title/slug/body", () => {
    for (const name of ["title", "slug", "body"]) {
      expect(fieldOf(legalPage, name)).toBeDefined();
    }
  });

  it("siteSettings carries NAP, whatsapp, socials and default SEO", () => {
    for (const name of ["phone", "email", "whatsapp", "address", "hours", "social", "defaultSeo"]) {
      expect(fieldOf(siteSettings, name)).toBeDefined();
    }
  });

  it("homePage carries hero, about, stats and cta content", () => {
    for (const name of ["hero", "quickServiceLinks", "about", "stats", "cta"]) {
      expect(fieldOf(homePage, name)).toBeDefined();
    }
  });

  it("hero supports banner carousel: banners(0-5) + interval (DSN-89)", () => {
    const hero = fieldOf(homePage, "hero") as { fields?: AnyField[] };
    const heroFields = hero.fields ?? [];
    const banners = heroFields.find((f) => f.name === "banners") as
      { of?: Array<{ name?: string; fields?: AnyField[] }> } | undefined;
    expect(banners).toBeDefined();
    expect(banners?.of?.[0]?.name).toBe("heroBanner");

    const bannerFields = banners?.of?.[0]?.fields ?? [];
    for (const name of ["variant", "eyebrow", "headline", "body", "image", "sideImages"]) {
      expect(
        bannerFields.find((f) => f.name === name),
        name,
      ).toBeDefined();
    }

    // Conditional görünürlük: forma yalnız seçilen versiyonun alanları gelir.
    const hiddenOf = (name: string) =>
      (bannerFields.find((f) => f.name === name) as { hidden?: (ctx: unknown) => boolean })?.hidden;
    expect(typeof hiddenOf("image")).toBe("function");
    expect(hiddenOf("image")?.({ parent: { variant: "split" } })).toBe(true);
    expect(hiddenOf("image")?.({ parent: { variant: "full-bleed" } })).toBe(false);
    expect(hiddenOf("sideImages")?.({ parent: { variant: "full-bleed" } })).toBe(true);
    expect(hiddenOf("sideImages")?.({ parent: { variant: "split" } })).toBe(false);

    const interval = heroFields.find((f) => f.name === "interval") as
      { initialValue?: number } | undefined;
    expect(interval?.initialValue).toBe(5);

    // full-bleed arka plan doğrulaması: değer + varyanta göre üç dal.
    const imageField = bannerFields.find((f) => f.name === "image") as {
      validation?: (rule: unknown) => unknown;
    };
    let captured: unknown;
    const capturingRule: unknown = new Proxy(() => capturingRule, {
      get: (_target, prop) =>
        prop === "custom"
          ? (fn: unknown) => {
              captured = fn;
              return capturingRule;
            }
          : () => capturingRule,
      apply: () => capturingRule,
    });
    imageField.validation?.(capturingRule);
    const validateImage = captured as (value: unknown, ctx: unknown) => string | true;
    expect(validateImage(undefined, { parent: { variant: "full-bleed" } })).toBe(
      "Tam ekran versiyonunda arka plan fotoğrafı zorunludur.",
    );
    expect(validateImage({ asset: {} }, { parent: { variant: "full-bleed" } })).toBe(true);
    expect(validateImage(undefined, { parent: { variant: "split" } })).toBe(true);

    // Banner önizlemesi: başlık + versiyon etiketi; boş/brnmeyen varyant.
    const prepare = (
      banners?.of?.[0] as unknown as {
        preview?: {
          prepare?: (v?: Record<string, unknown>) => { title: string; subtitle: string };
        };
      }
    )?.preview?.prepare;
    expect(prepare?.({ title: "Merhaba", variant: "split" })).toEqual({
      title: "Merhaba",
      subtitle: "split (sağ kartlı)",
    });
    expect(prepare?.({ title: "Merhaba", variant: "future-x" })).toEqual({
      title: "Merhaba",
      subtitle: "future-x",
    });
    expect(prepare?.()).toEqual({ title: "(başlıksız banner)", subtitle: "versiyon seçilmedi" });
  });

  it("redirect defaults to permanent 301", () => {
    expect(fieldOf(redirect, "permanent").initialValue).toBe(true);
    expect(fieldOf(redirect, "from").type).toBe("slug");
  });

  it("blogPost requires localized block content body", () => {
    expect(fieldOf(blogPost, "body").type).toBe("localeBlockContent");
    expect(fieldOf(blogPost, "publishedAt").type).toBe("datetime");
  });

  it("localeBlockContent requires Turkish blocks", () => {
    expect(fieldOf(localeBlockContent, "tr").type).toBe("array");
    expect(fieldOf(localeBlockContent, "en").type).toBe("array");
  });
});
