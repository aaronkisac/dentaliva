import { defineField, defineType } from "sanity";

/** Per-page SEO block — editable by the SEO manager without code. */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta başlık",
      type: "string",
      validation: (rule) =>
        rule.max(60).warning("60 karakteri aşan başlıklar arama sonuçlarında kısaltılır"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta açıklama",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160).warning("160 karakteri aşan açıklamalar kısaltılır"),
    }),
    defineField({
      name: "ogImage",
      title: "Paylaşım görseli (Open Graph)",
      type: "image",
      description: "1200×630 önerilir",
    }),
    defineField({
      name: "noIndex",
      title: "Arama motorlarına kapat",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "canonicalOverride",
      title: "Canonical URL (opsiyonel)",
      type: "url",
      description: "Yalnızca canonical'ı başka bir adrese çekmek gerektiğinde",
    }),
  ],
});
