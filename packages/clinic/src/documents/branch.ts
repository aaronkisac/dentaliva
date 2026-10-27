import { defineField, defineType } from "sanity";

import { validTrPhone } from "@dentaliva/sanity-schema";

/** A clinic branch (şube) with NAP details for local SEO. */
export const branch = defineType({
  name: "branch",
  title: "Şube",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Şube adı",
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
    defineField({
      name: "address",
      title: "Adres",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
      validation: (rule) => rule.required().custom(validTrPhone),
    }),
    defineField({ name: "hours", title: "Çalışma saatleri", type: "localeText" }),
    defineField({ name: "mapUrl", title: "Google Maps bağlantısı", type: "url" }),
    defineField({
      name: "geo",
      title: "Konum",
      type: "object",
      fields: [
        { name: "lat", title: "Enlem", type: "number" },
        { name: "lng", title: "Boylam", type: "number" },
      ],
    }),
    defineField({ name: "image", title: "Görsel", type: "imageWithAlt" }),
    defineField({
      name: "gallery",
      title: "Şube foto galerisi",
      description:
        "Şube listeleme satırındaki mini galeri (ilk 3 fotoğraf görünür; boşsa yukarıdaki Görsel kullanılır).",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (rule) => rule.max(8),
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: { select: { title: "name", subtitle: "address.tr", media: "image" } },
});
