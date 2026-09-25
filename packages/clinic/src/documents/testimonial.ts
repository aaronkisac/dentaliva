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
  ],
});
