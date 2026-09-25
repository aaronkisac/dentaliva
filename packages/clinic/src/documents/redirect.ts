import { defineField, defineType } from "sanity";

import { validRedirectTarget } from "@dentaliva/sanity-schema";

/**
 * CMS-managed 301s (dropped blog URLs etc.). `from` uses the slug type's
 * built-in cross-document uniqueness; `to` is validated as relative/https.
 */
export const redirect = defineType({
  name: "redirect",
  title: "Yönlendirme (301)",
  type: "document",
  fields: [
    defineField({
      name: "from",
      title: "Eski yol",
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "to",
      title: "Yeni yol veya adres",
      type: "string",
      validation: (rule) => rule.required().custom(validRedirectTarget),
    }),
    defineField({
      name: "permanent",
      title: "Kalıcı (301)",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
