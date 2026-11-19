import { defineField, defineType } from "sanity";

import { studioLocale } from "./locale-text";

/**
 * Image with mandatory localized alt text and hotspot-aware cropping.
 *
 * DSN-96 takip: alt'ın STÜDYO-GÖRÜNÜR slotu zorunludur — eski requireTr gizli
 * tr slotunu isteyip eu/nl stüdyolarında düzeltilemez hata basıyordu (Alan
 * TR kutusu gizliydi, hata rozette kalıyordu). Stüdyo dili dışındaki
 * slotlar formdan gizlidir (locale-text hidden filtresi) ve zorunlu
 * DEĞİLDİR; veri Content Lake'te korunur.
 */
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
      validation: (rule) =>
        rule.custom((value) => {
          const localized = (value ?? null) as Record<string, string | undefined> | null;
          const text = localized?.[studioLocale];
          return (typeof text === "string" && text.trim() !== "") || "Alt metin zorunludur";
        }),
    }),
  ],
});
