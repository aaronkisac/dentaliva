import { defineField, defineType } from "sanity";

/** Singleton: home page section content (section order comes from site config). */
export const homePage = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        { name: "headline", title: "Başlık", type: "localeString" },
        { name: "subline", title: "Alt başlık", type: "localeText" },
        { name: "image", type: "imageWithAlt" },
      ],
    }),
    defineField({
      name: "quickServiceLinks",
      title: "Hızlı hizmet bağlantıları",
      type: "array",
      of: [{ type: "reference", to: [{ type: "treatment" }] }],
    }),
    defineField({
      name: "about",
      title: "Hakkında bölümü",
      type: "object",
      fields: [
        { name: "title", type: "localeString" },
        { name: "body", type: "localeText" },
        { name: "image", type: "imageWithAlt" },
      ],
    }),
    defineField({
      name: "stats",
      title: "İstatistikler",
      type: "array",
      of: [
        {
          type: "object",
          name: "statPair",
          fields: [
            { name: "value", title: "Değer", type: "string" },
            { name: "label", type: "localeString" },
          ],
        },
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA bandı",
      type: "object",
      fields: [
        { name: "title", type: "localeString" },
        { name: "text", type: "localeText" },
      ],
    }),
  ],
});
