import { defineField, defineType } from "sanity";

import { validTrPhone } from "@dentaliva/sanity-schema";

/** Singleton: canonical NAP, WhatsApp, socials, default SEO. */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Ayarları",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site adı", type: "string", initialValue: "Dentaliva" }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
      validation: (rule) => rule.required().custom(validTrPhone),
    }),
    defineField({
      name: "email",
      title: "E-posta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp numarası (uluslararası biçim, örn. 905308405482)",
      type: "string",
    }),
    defineField({ name: "address", title: "Adres", type: "localeText" }),
    defineField({ name: "hours", title: "Çalışma saatleri", type: "localeText" }),
    defineField({ name: "tagline", title: "Slogan", type: "localeString" }),
    defineField({
      name: "social",
      title: "Sosyal medya",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            { name: "platform", title: "Platform", type: "string" },
            { name: "url", title: "Bağlantı", type: "url" },
          ],
        },
      ],
    }),
    defineField({ name: "defaultSeo", title: "Varsayılan SEO", type: "seo" }),
  ],
});
