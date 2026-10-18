import { defineField, defineType } from "sanity";

import { requireNonEmpty } from "../validation";

export type StudioLocale = "tr" | "en" | "nl";

/**
 * The locale this project REQUIRES, chosen at studio build time (ADR-002:
 * one studio codebase, deployed per domain). com defaults to tr; eu builds
 * with en, nl with nl (NL-1). The {tr, en, nl} shape is fixed so the web
 * app, GROQ and migrations stay locale-uniform — only the labels, field
 * order and requiredness follow the studio locale.
 */
export const studioLocale: StudioLocale =
  process.env.SANITY_STUDIO_DEFAULT_LOCALE === "en"
    ? "en"
    : process.env.SANITY_STUDIO_DEFAULT_LOCALE === "nl"
      ? "nl"
      : "tr";

const localeTitle: Record<StudioLocale, string> = {
  tr: "Türkçe",
  en: "English",
  nl: "Nederlands",
};

const ALL_LOCALES: StudioLocale[] = ["tr", "en", "nl"];

/** Required studio-locale field first; the other two locales optional. */
function localeFields(kind: "string" | "text") {
  const required = (name: StudioLocale) =>
    defineField({
      name,
      title: localeTitle[name],
      type: kind,
      validation: (rule) => rule.required().custom(requireNonEmpty),
    });
  const optional = (name: StudioLocale) =>
    defineField({ name, title: localeTitle[name], type: kind });
  // Stable sort: the studio locale leads, the rest keep tr→en→nl order.
  return [...ALL_LOCALES]
    .sort((a) => (a === studioLocale ? -1 : 1))
    .map((locale) => (locale === studioLocale ? required(locale) : optional(locale)));
}

/** Single-line localized string: { tr, en, nl } — the studio locale is required. */
export const localeString = defineType({
  name: "localeString",
  title: "Yerelleştirilmiş metin (tek satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: localeFields("string"),
});

/** Multi-paragraph localized text: { tr, en, nl } — the studio locale is required. */
export const localeText = defineType({
  name: "localeText",
  title: "Yerelleştirilmiş metin (çok satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: localeFields("text"),
});
