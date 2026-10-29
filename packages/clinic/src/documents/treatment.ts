import { defineField, defineType } from "sanity";
import { studioLocale } from "@dentaliva/sanity-schema";

/** A dental treatment (hizmet) — one routable page per treatment. */
export const treatment = defineType({
  name: "treatment",
  title: "Tedavi",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tedavi adı",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: `name.${studioLocale}` },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Özet",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heroImage", title: "Kapak görseli", type: "imageWithAlt" }),
    defineField({ name: "body", title: "Açıklama", type: "localeText" }),
    defineField({
      name: "sections",
      title: "İçerik bölümleri",
      description:
        "Yapılandırılmış tedavi gövdesi (DSN-83): başlıklı bölümler, alt maddeler ve bölüm fotoğrafı. Doluysa 'Açıklama' düz metni sayfada kullanılmaz.",
      type: "array",
      of: [
        {
          type: "object",
          name: "treatmentSection",
          fields: [
            { name: "heading", type: "localeString", title: "Bölüm başlığı" },
            { name: "lead", type: "localeText", title: "Giriş metni" },
            {
              name: "items",
              title: "Alt maddeler",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "treatmentSectionItem",
                  fields: [
                    { name: "title", type: "localeString", title: "Madde başlığı" },
                    { name: "text", type: "localeText", title: "Madde metni" },
                  ],
                  preview: { select: { title: `title.${studioLocale}` } },
                },
              ],
            },
            { name: "image", type: "imageWithAlt", title: "Bölüm fotoğrafı" },
          ],
          preview: {
            select: { title: `heading.${studioLocale}`, media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "benefits",
      title: "Faydalar",
      type: "array",
      of: [{ type: "localeString" }],
    }),
    defineField({
      name: "steps",
      title: "Tedavi adımları",
      type: "array",
      of: [
        {
          type: "object",
          name: "treatmentStep",
          fields: [
            { name: "title", type: "localeString" },
            { name: "description", type: "localeText" },
          ],
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "SSS",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
    }),
    defineField({
      name: "doctors",
      title: "İlgili hekimler",
      type: "array",
      of: [{ type: "reference", to: [{ type: "doctor" }] }],
    }),
    defineField({ name: "priceNote", title: "Fiyat notu", type: "localeString" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: `name.${studioLocale}`, subtitle: "slug.current", media: "heroImage" },
  },
});
