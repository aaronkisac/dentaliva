import { defineField, defineType } from "sanity";

import { requireNonEmpty } from "../validation";

/**
 * The locale this project REQUIRES, chosen at studio build time (ADR-002:
 * one studio codebase, deployed per domain). The com studio defaults to tr;
 * the eu studio sets SANITY_STUDIO_DEFAULT_LOCALE=en. The {tr, en} shape is
 * fixed so the web app, GROQ and migrations stay locale-uniform — only the
 * labels, field order and requiredness follow the studio locale.
 */
export const studioLocale: "tr" | "en" =
  process.env.SANITY_STUDIO_DEFAULT_LOCALE === "en" ? "en" : "tr";

const otherLocale: "tr" | "en" = studioLocale === "en" ? "tr" : "en";

const localeTitle: Record<"tr" | "en", string> = { tr: "Türkçe", en: "English" };

function localeField(name: "tr" | "en", type: "string" | "text") {
  return defineField({
    name,
    title: localeTitle[name],
    type,
    ...(name === studioLocale
      ? {
          validation: (rule: {
            required: () => { custom: (fn: typeof requireNonEmpty) => unknown };
          }) => rule.required().custom(requireNonEmpty),
        }
      : {}),
  });
}

/** Single-line localized string: { tr, en } — the studio locale is required. */
export const localeString = defineType({
  name: "localeString",
  title: "Yerelleştirilmiş metin (tek satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: [localeField(studioLocale, "string"), localeField(otherLocale, "string")],
});

/** Multi-paragraph localized text. */
export const localeText = defineType({
  name: "localeText",
  title: "Yerelleştirilmiş metin (çok satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: [localeField(studioLocale, "text"), localeField(otherLocale, "text")],
});
