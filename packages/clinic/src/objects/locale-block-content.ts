import { defineArrayMember, defineField, defineType } from "sanity";

import { studioLocale } from "@dentaliva/sanity-schema";

/**
 * Localized portable text: { tr: blocks, en: blocks } — no nl slot (the nl
 * site carries no portable content).
 *
 * DSN-96: stüdyo dili dışındaki slot formdan gizlenir (Aaron: boş dil
 * kutuları çok yer kaplıyor). Zorunluluk GÖRÜNÜR slotu izler — com'da tr
 * zorunlu; eu/nl'de en görünür + opsiyonel (boşsa site tr fallback'ine
 * düşer), tr gizli + opsiyonel (görünmez zorunlu alan yayınlama tuzağına
 * yol açmasın). hidden yalnız görünümdür; veri Content Lake'te kalır.
 */
const visibleSlot = studioLocale === "tr" ? "tr" : "en";

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Yerelleştirilmiş zengin metin",
  type: "object",
  fields: [
    defineField({
      name: "tr",
      title: "Türkçe",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Başlık", value: "h2" },
            { title: "Alt başlık", value: "h3" },
          ],
        }),
      ],
      hidden: visibleSlot !== "tr",
      validation: (rule) => (visibleSlot === "tr" ? rule.required() : rule),
    }),
    defineField({
      name: "en",
      title: "İngilizce",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      hidden: visibleSlot !== "en",
    }),
  ],
});
