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

const localeTitle: Record<"tr" | "en", string> = { tr: "Türkçe", en: "English" };

/** [required primary field, optional secondary field] for the studio locale. */
function localeFields(kind: "string" | "text") {
  const required = (name: "tr" | "en") =>
    defineField({
      name,
      title: localeTitle[name],
      type: kind,
      validation: (rule) => rule.required().custom(requireNonEmpty),
    });
  const optional = (name: "tr" | "en") =>
    defineField({ name, title: localeTitle[name], type: kind });
  return studioLocale === "tr"
    ? [required("tr"), optional("en")]
    : [required("en"), optional("tr")];
}

/** Single-line localized string: { tr, en } — the studio locale is required. */
export const localeString = defineType({
  name: "localeString",
  title: "Yerelleştirilmiş metin (tek satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: localeFields("string"),
});

/** Multi-paragraph localized text. */
export const localeText = defineType({
  name: "localeText",
  title: "Yerelleştirilmiş metin (çok satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: localeFields("text"),
});
