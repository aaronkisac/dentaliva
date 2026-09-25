import { defineField, defineType } from "sanity";

/** Question/answer pair; referenced from treatments and the home page. */
export const faq = defineType({
  name: "faq",
  title: "SSS",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Soru",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Cevap",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sıralama",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [{ title: "Sıralama", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question.tr" } },
});
