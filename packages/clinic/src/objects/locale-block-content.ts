import { defineArrayMember, defineField, defineType } from "sanity";

/** Localized portable text: { tr: blocks (required), en: blocks }. */
export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Yerelleştirilmiş zengin metin",
  type: "object",
  fieldsets: [{ name: "translations", title: "Çeviriler", options: { collapsible: true } }],
  fields: [
    defineField({
      name: "tr",
      title: "Türkçe",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Başlık", value: "h2" },
            { title: "Alt başlık", value: "h3" },
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "İngilizce",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
});
