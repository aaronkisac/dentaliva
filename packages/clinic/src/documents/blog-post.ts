import { defineField, defineType } from "sanity";

/** Blog post. Body is locale-aware portable text. */
export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Yazısı",
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
      options: { source: "title.tr" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "excerpt", title: "Özet", type: "localeText" }),
    defineField({
      name: "body",
      title: "İçerik",
      type: "localeBlockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "heroImage", title: "Kapak görseli", type: "imageWithAlt" }),
    defineField({
      name: "publishedAt",
      title: "Yayın tarihi",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: "author", title: "Yazar", type: "reference", to: [{ type: "doctor" }] }),
    defineField({ name: "tags", title: "Etiketler", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "title.tr", subtitle: "publishedAt", media: "heroImage" } },
});
