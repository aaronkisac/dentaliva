import { defineField, defineType } from "sanity";

import { requireTr } from "../validation";

/** Image with mandatory localized alt text and hotspot-aware cropping. */
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Görsel (alt metin zorunlu)",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt metin",
      type: "localeString",
      options: { hotspot: true },
      validation: (rule) => rule.custom(requireTr),
    }),
  ],
});
