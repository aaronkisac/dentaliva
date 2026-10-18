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
