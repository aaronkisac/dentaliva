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

/**
 * DSN-96: her domain Studio'su TEK dillidir (ADR-002) — stüdyo dili dışındaki
 * locale kutuları formdan gizlenir (Aaron: boş EN/NL kutuları ekranda çok
 * yer kaplıyor). hidden yalnız GÖRÜNÜM filtresidir: veri Content Lake'te
 * kalır; çeviri iş akışı gerektiğinde koşulu kaldırmak tek satırdır.
 */
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
    .map((locale) => {
      const field = locale === studioLocale ? required(locale) : optional(locale);
      return locale === studioLocale ? field : { ...field, hidden: true };
    });
}

/** Single-line localized string: { tr, en, nl } — only the studio locale is visible. */
export const localeString = defineType({
  name: "localeString",
  title: "Yerelleştirilmiş metin (tek satır)",
  type: "object",
  fields: localeFields("string"),
});

/** Multi-paragraph localized text: { tr, en, nl } — only the studio locale is visible. */
export const localeText = defineType({
  name: "localeText",
  title: "Yerelleştirilmiş metin (çok satır)",
  type: "object",
  fields: localeFields("text"),
});
