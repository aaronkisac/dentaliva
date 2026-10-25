import { defineField, defineType } from "sanity";

/** Singleton: home page section content (section order comes from site config). */
export const homePage = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        { name: "headline", title: "Başlık", type: "localeString" },
        { name: "subline", title: "Alt başlık", type: "localeText" },
        { name: "image", type: "imageWithAlt" },
      ],
    }),
    defineField({
      name: "quickServiceLinks",
      title: "Hızlı hizmet bağlantıları",
      type: "array",
      of: [{ type: "reference", to: [{ type: "treatment" }] }],
    }),
    defineField({
      // DSN-61: strateji dokümanı #02 — hero altı kompakt güven bandı.
      name: "trustStrip",
      title: "Güven şeridi",
      description:
        "Hero altındaki kompakt güven bandı — Google puanı ve doğrulanabilir göstergeler (vaka sayısı, video sayısı). Tamamen boşken bölüm render edilmez.",
      type: "object",
      fields: [
        { name: "rating", title: "Puan (örn. 5,0)", type: "localeString" },
        {
          name: "ratingLabel",
          title: "Puan etiketi (örn. Google Değerlendirmeleri)",
          type: "localeString",
        },
        {
          name: "items",
          title: "Güven göstergeleri",
          type: "array",
          validation: (rule) => rule.max(3),
          of: [
            {
              type: "object",
              name: "trustItem",
              fields: [
                {
                  name: "value",
                  title: "Değer (örn. 300+)",
                  type: "string",
                  validation: (rule) => rule.required(),
                },
                {
                  name: "label",
                  title: "Etiket (örn. Gerçek Vaka)",
                  type: "localeString",
                  validation: (rule) => rule.required(),
                },
              ],
              preview: { select: { title: "value", subtitle: "label.tr" } },
            },
          ],
        },
      ],
    }),
    defineField({
      // DSN-62: strateji dokümanı #03 — ihtiyaç bazlı self-segmentation kartları.
      name: "treatmentPaths",
      title: "Tedavi yolları",
      description:
        "İhtiyaca göre kendini konumlandıran kartlar (örn. eksik dişi yerine koy / tam çene restorasyonu). Kartın tamamı ilgili tedaviye giden link; teknik terim ikinci satırdadır. Boşken bölüm render edilmez.",
      type: "array",
      validation: (rule) => rule.max(4),
      of: [
        {
          type: "object",
          name: "treatmentPath",
          fields: [
            {
              name: "headline",
              title: "Kart başlığı (ihtiyaç cümlesi)",
              type: "localeString",
              validation: (rule) => rule.required(),
            },
            {
              name: "subline",
              title: "Alt satır (teknik terim)",
              type: "localeText",
            },
            { name: "image", title: "Görsel (gerçek vaka/klinik)", type: "imageWithAlt" },
            {
              name: "treatment",
              title: "İlgili tedavi (kartın gittiği sayfa)",
              type: "reference",
              to: [{ type: "treatment" }],
            },
          ],
          preview: { select: { title: "headline.tr", subtitle: "subline.tr" } },
        },
      ],
    }),
    defineField({
      name: "about",
      title: "Hakkında bölümü",
      type: "object",
      fields: [
        { name: "title", type: "localeString" },
        { name: "body", type: "localeText" },
        {
          name: "benefits",
          title: "Fayda maddeleri (numaralı liste)",
          type: "array",
          of: [{ type: "localeString" }],
          validation: (rule) => rule.max(6),
        },
        { name: "image", type: "imageWithAlt" },
      ],
    }),
    defineField({
      name: "stats",
      title: "İstatistik rozetleri (Hakkında fotoğrafı)",
      description: "Fotoğrafın alt kenarındaki rozetler — en fazla 2 istatistik gösterilir.",
      type: "array",
      validation: (rule) => rule.max(2),
      of: [
        {
          type: "object",
          name: "statPair",
          fields: [
            {
              name: "value",
              title: "Değer (örn. 13+)",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "label",
              title: "Etiket (örn. Yıllık Deneyim)",
              type: "localeString",
              validation: (rule) => rule.required(),
            },
          ],
          preview: { select: { title: "value", subtitle: "label.tr" } },
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Fotoğraf galerisi",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "onceSonraGallery",
      title: "Önce/Sonra galerisi",
      description:
        "Hasta izinli tedavi öncesi/sonrası görselleri — dolunca galeri sayfasında sekme filtresi açılır.",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: "onceSonraCases",
      title: "Önce/Sonra vakalar",
      description:
        "Anasayfa önce/sonra karşılaştırma kartları — sürüklenebilir slider'lı. Boşken bölüm render edilmez. Örnek fotoğraflar geçicidir; hasta izinli çiftlerle değiştirilir.",
      type: "array",
      of: [
        {
          type: "object",
          name: "beforeAfterCase",
          fields: [
            { name: "before", title: "Önce fotoğrafı", type: "imageWithAlt" },
            { name: "after", title: "Sonra fotoğrafı", type: "imageWithAlt" },
            { name: "title", title: "Başlık", type: "localeString" },
            { name: "text", title: "Açıklama", type: "localeText" },
            {
              name: "treatment",
              title: "İlgili hizmet",
              type: "reference",
              to: [{ type: "treatment" }],
            },
            {
              // DSN-56: öge bazlı gizle/göster — vaka siteden düşer, CRM'de kalır.
              name: "hidden",
              title: "Gizle",
              type: "boolean",
              initialValue: false,
            },
          ],
        },
      ],
      validation: (rule) => rule.max(12),
    }),
    defineField({
      name: "teamSection",
      title: "Ekip bölümü",
      type: "object",
      fields: [
        { name: "eyebrow", type: "localeString" },
        { name: "heading", type: "localeString" },
        { name: "text", type: "localeText" },
      ],
    }),
    defineField({
      name: "cta",
      title: "CTA bandı",
      type: "object",
      fields: [
        { name: "title", type: "localeString" },
        { name: "text", type: "localeText" },
      ],
    }),
    defineField({
      // DSN-56: içerik bazlı gizle/göster — bölüm verisi CRM'de kalır, yalnız
      // anasayfa render'ından düşer (compose.tsx HomeSections filtresi).
      name: "hiddenSections",
      title: "Gizlenen bölümler",
      description:
        "Seçilen bölümler anasayfada gösterilmez (içerikleri silinmez). Tümünü geri açmak için listeyi boşaltın.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Hero", value: "hero" },
          { title: "Hizmet şeridi", value: "ticker" },
          { title: "Güven şeridi", value: "trustStrip" },
          { title: "Hizmetler carousel'i", value: "quickServices" },
          { title: "Hakkında", value: "about" },
          { title: "Tedavi yolları", value: "treatmentPaths" },
          { title: "Video yorumlar", value: "videoTestimonials" },
          { title: "Hasta yorumları", value: "reviews" },
          { title: "Fotoğraf galerisi", value: "gallery" },
          { title: "Önce/Sonra vakalar", value: "onceSonra" },
          { title: "Ekip", value: "doctors" },
          { title: "SSS", value: "faq" },
          { title: "CTA bandı", value: "cta" },
        ],
      },
    }),
  ],
  preview: { select: { title: "hero.headline.tr" } },
});
