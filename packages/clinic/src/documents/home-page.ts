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
      name: "gallery",
      title: "Fotoğraf galerisi",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "onceSonraGallery",
      title: "Önce/Sonra galerisi",
      description:
        "Hasta izinli tedavi öncesi/sonrası görselleri — dolunca galeri sayfasında sekme filtresi açılır.",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "teamSection",
      title: "Ekip bölümü",
      type: "object",
      fields: [
        { name: "eyebrow", type: "localeString" },
        { name: "heading", type: "localeString" },
        { name: "text", type: "localeText" },
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
  preview: { select: { title: "hero.headline.tr" } },
});
