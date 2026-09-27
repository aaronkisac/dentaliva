import { defineField, defineType } from "sanity";

/** Patient testimonial — re-entered from Google reviews (no third-party embed). */
export const testimonial = defineType({
  name: "testimonial",
  title: "Hasta Yorumu",
  type: "document",
  fields: [
    defineField({
      name: "author",
      title: "Yorum sahibi",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Yorum",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Puan",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5),
      initialValue: 5,
    }),
    defineField({
      name: "source",
      title: "Kaynak",
      type: "string",
      options: { list: ["Google", "YouTube", "Web"] },
      initialValue: "Google",
    }),
    defineField({
      name: "treatment",
      title: "İlgili tedavi",
      type: "reference",
      to: [{ type: "treatment" }],
    }),
    defineField({
      // CPT-5: video testimonials — presence of youtubeId routes the doc to
      // the home video section; text-only docs stay in the reviews section.
      name: "youtubeId",
      title: "YouTube video ID",
      type: "string",
      hidden: true,
      validation: (rule) => rule.regex(/^[A-Za-z0-9_-]{6,20}$/, { name: "YouTube ID" }),
    }),
  ],
  preview: { select: { title: "author", subtitle: "source" } },
});
