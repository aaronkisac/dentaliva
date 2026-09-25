import { defineField, defineType } from "sanity";

import { requireNonEmpty } from "../validation";

/** Single-line localized string: { tr (required), en (optional) }. */
export const localeString = defineType({
  name: "localeString",
  title: "Yerelleştirilmiş metin (tek satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: [
    defineField({
      name: "tr",
      title: "Türkçe",
      type: "string",
      validation: (rule) => rule.required().custom(requireNonEmpty),
    }),
    defineField({
      name: "en",
      title: "İngilizce",
      type: "string",
    }),
  ],
});

/** Multi-paragraph localized text. */
export const localeText = defineType({
  name: "localeText",
  title: "Yerelleştirilmiş metin (çok satır)",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: [
    defineField({
      name: "tr",
      title: "Türkçe",
      type: "text",
      validation: (rule) => rule.required().custom(requireNonEmpty),
    }),
    defineField({
      name: "en",
      title: "İngilizce",
      type: "text",
    }),
  ],
});
