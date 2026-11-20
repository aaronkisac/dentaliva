import { defineField, defineType } from "sanity";

import { publishableSlugValidation } from "../slug";

/** Legal pages (KVKK, gizlilik, çerez politikası). */
export const legalPage = defineType({
  name: "legalPage",
  title: "Yasal Sayfa",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      validation: publishableSlugValidation,
    }),
    defineField({
      name: "body",
      title: "Metin",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "title.tr", subtitle: "slug.current" } },
});
