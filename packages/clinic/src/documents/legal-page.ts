import { defineField, defineType } from "sanity";

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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Metin",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
