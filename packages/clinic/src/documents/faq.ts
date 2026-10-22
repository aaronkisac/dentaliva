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
    defineField({
      // CPT-3: anasayfa SSS bölümü yalnızca işaretli soruları gösterir;
      // tedaviye bağlı SSS'ler yalnızca tedavi sayfasında yaşar.
      name: "displayOnHome",
      title: "Anasayfada göster",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      // DSN-56: öge bazlı gizle/göster — anasayfa ve tedavi sayfası
      // sorgularından düşer (misc.ts/treatment.ts filtreleri), doküman kalır.
      name: "hidden",
      title: "Gizle",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [{ title: "Sıralama", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question.tr" } },
});
