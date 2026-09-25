import { defineField, defineType } from "sanity";

import { validTrPhone } from "@dentaliva/sanity-schema";

/** A dentist (hekim) profile page. */
export const doctor = defineType({
  name: "doctor",
  title: "Hekim",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ad Soyad",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "title", title: "Unvan", type: "localeString" }),
    defineField({ name: "photo", title: "Fotoğraf", type: "imageWithAlt" }),
    defineField({ name: "bio", title: "Özgeçmiş", type: "localeText" }),
    defineField({
      name: "phone",
      title: "Doğrudan telefon (opsiyonel)",
      type: "string",
      validation: (rule) => rule.custom(validTrPhone),
    }),
    defineField({
      name: "treatments",
      title: "Uzmanlık tedavileri",
      type: "array",
      of: [{ type: "reference", to: [{ type: "treatment" }] }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
