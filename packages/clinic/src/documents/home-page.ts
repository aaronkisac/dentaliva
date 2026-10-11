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
        {
          name: "benefits",
          title: "Fayda maddeleri (numaralı liste)",
          type: "array",
          of: [{ type: "localeString" }],
          validation: (rule) => rule.max(6),
        },
        { name: "image", type: "imageWithAlt" },
      ],
    }),
    defineField({
      name: "stats",
      title: "İstatistik rozetleri (Hakkında fotoğrafı)",
      description: "Fotoğrafın alt kenarındaki rozetler — en fazla 2 istatistik gösterilir.",
      type: "array",
      validation: (rule) => rule.max(2),
      of: [
        {
          type: "object",
          name: "statPair",
          fields: [
            {
              name: "value",
              title: "Değer (örn. 13+)",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "label",
              title: "Etiket (örn. Yıllık Deneyim)",
              type: "localeString",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "value", subtitle: "label.tr" } },
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
      name: "onceSonraCases",
      title: "Önce/Sonra vakalar",
      description:
        "Anasayfa önce/sonra karşılaştırma kartları — sürüklenebilir slider'lı. Boşken bölüm render edilmez. Örnek fotoğraflar geçicidir; hasta izinli çiftlerle değiştirilir.",
      type: "array",
      of: [
        {
          type: "object",
          name: "beforeAfterCase",
          fields: [
            { name: "before", title: "Önce fotoğrafı", type: "imageWithAlt" },
            { name: "after", title: "Sonra fotoğrafı", type: "imageWithAlt" },
            { name: "title", title: "Başlık", type: "localeString" },
            { name: "text", title: "Açıklama", type: "localeText" },
            {
              name: "treatment",
              title: "İlgili hizmet",
              type: "reference",
              to: [{ type: "treatment" }],
            },
          ],
        },
      ],
      validation: (rule) => rule.max(12),
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
