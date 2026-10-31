import { defineField, defineType } from "sanity";
import { studioLocale } from "@dentaliva/sanity-schema";

/**
 * DSN-86 — Tedavi içerik standardı (Aaron: "crmden girerken bize bir
 * standarta göre sorsun"): periodontoloji pilotunun onaylanan yapısı artık
 * Studio'nun diline işlendi. Alan grupları editörü sırayla yürütür (Temel →
 * İçerik → SSS & Hekimler → SEO); sections alanının açıklaması ve
 * doğrulamaları standartı zorlar; bölüm önizlemesi hangi kompozisyonu
 * alacağını yazarak gösterir.
 *
 * Sayfa tarafındaki kompozisyon eşlemesi (apps/web/components/
 * treatment-sections.tsx, variantOf):
 *   4 madde → kadran · 3+/5+ → mozaik · 2 → lacivert bant ·
 *   1 → kapanış bandı · maddesiz uzun metin → okuma kolonu ·
 *   maddesiz kısa metin → ortalanmış mola
 */
export const treatment = defineType({
  name: "treatment",
  title: "Tedavi",
  type: "document",
  groups: [
    { name: "temel", title: "Temel", default: true },
    { name: "icerik", title: "İçerik" },
    { name: "baglantilar", title: "SSS & Hekimler" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Tedavi adı",
      type: "localeString",
      group: "temel",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: `name.${studioLocale}` },
      group: "temel",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Özet",
      description:
        "Hero'daki giriş paragrafı (2-4 cümle). Sayfayı tek cümleyle tanımlar; anahtar kelimeyi doğal biçimde taşıması yeterli.",
      type: "localeText",
      group: "temel",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Kapak görseli",
      description:
        "Tedavi liste kartında ve sayfa hero'sunun sağ tarafındaki flama arka planda kullanılır. 1080×1080 (1:1) klinik karesi önerilir.",
      type: "imageWithAlt",
      group: "temel",
    }),
    defineField({
      name: "sections",
      title: "İçerik bölümleri",
      description:
        "STANDART (4-6 bölüm, bu sırayla): 1) Nedir / Neye Bakar? — 2-3 madde 2) Belirtileri / Kimlere Uygulanır? — 2-4 madde 3) Nasıl Yapılır? — 2-4 madde 4) Fiyatlar — madde yok, 1 paragraf 5) Genel Sağlık / Sonrası — 1-2 madde. Bölüme 1080×1080 klinik karesi ekleyin. Kompozisyon otomatik: 2 madde → lacivert vurgu bandı · 3+ → mozaik · 4 → kadran · 1 madde → kapanış bandı · maddesiz metin → okuma kolonu/mola.",
      type: "array",
      group: "icerik",
      validation: (rule) => rule.max(8).error("Standart 4-6 bölümdür — daha uzun sayfa taranmaz."),
      of: [
        {
          type: "object",
          name: "treatmentSection",
          fields: [
            {
              name: "heading",
              title: "Bölüm başlığı",
              description: "Soru biçiminde önerilir (ör. 'Nasıl Yapılır?').",
              type: "localeString",
              validation: (rule) =>
                rule.required().error("Bölüm başlığı zorunlu — başlıksız bölüm sayfada görünmez."),
            },
            {
              name: "lead",
              title: "Giriş metni",
              description:
                "2-4 cümlelik bölüm girişi. 800+ karakterse okuma kolonu olarak basılır.",
              type: "localeText",
            },
            {
              name: "items",
              title: "Alt maddeler",
              description:
                "Standart 2-4 madde: her biri başlık + 1 kısa paragraf. 2 madde → lacivert bant · 3+ → mozaik · 4 → kadran.",
              type: "array",
              validation: (rule) =>
                rule
                  .max(8)
                  .error("Standart bölüm başına 2-4 maddedir — fazla maddeler hücreleri boşaltır."),
              of: [
                {
                  type: "object",
                  name: "treatmentSectionItem",
                  fields: [
                    {
                      name: "title",
                      title: "Madde başlığı",
                      description:
                        "Kısa ve spesifik (ör. 'Diş Taşı Temizliği ve Kök Yüzeyi Düzleştirme').",
                      type: "localeString",
                    },
                    {
                      name: "text",
                      title: "Madde metni",
                      description: "1 kısa paragraf (3-6 cümle).",
                      type: "localeText",
                    },
                  ],
                  preview: { select: { title: `title.${studioLocale}` } },
                },
              ],
            },
            {
              name: "image",
              type: "imageWithAlt",
              title: "Bölüm fotoğrafı",
              description:
                "1080×1080 (1:1) klinik karesi. Mozaikte sağ üst hücreye, kadran/mola düzenlerinde alt bantta basılır.",
            },
            {
              name: "style",
              title: "Görünüm",
              description:
                "Boş bırak = otomatik (içerik şekline göre seçilir; ardışık lacivert bantlar ve fotosuz lacivert bantlar engellenir). Sabit seçerseniz kural dışına gider.",
              type: "string",
              options: {
                list: [
                  { title: "Otomatik (önerilen)", value: "auto" },
                  { title: "Mozaik (3+ madde, foto sağ üstte)", value: "mosaic" },
                  { title: "Kadran (4 madde, foto bandı + 2×2)", value: "quad" },
                  { title: "Lacivert vurgu bandı (2 madde + foto)", value: "duo" },
                  { title: "Kapanış bandı (1 madde, tam kanat foto)", value: "showcase" },
                  { title: "Okuma kolonu (maddesiz uzun metin)", value: "reading" },
                  { title: "Ortalanmış mola (maddesiz kısa metin)", value: "break" },
                ],
              },
              initialValue: "auto",
            },
          ],
          preview: {
            select: {
              title: `heading.${studioLocale}`,
              media: "image",
              items: "items",
              style: "style",
            },
            prepare: (value: Record<string, unknown> = {}) => {
              const title = value.title as string | undefined;
              const media = value.media;
              const items = value.items as unknown[] | undefined;
              const style = value.style as string | undefined;
              const count = items?.length ?? 0;
              const shape =
                count === 4
                  ? "kadran"
                  : count >= 3
                    ? "mozaik"
                    : count === 2
                      ? "lacivert bant"
                      : count === 1
                        ? "kapanış bandı"
                        : "okuma kolonu";
              const fixed = style && style !== "auto" ? `sabit: ${style} · ` : "";
              return {
                title: title || "(başlıksız bölüm — sayfada görünmez)",
                subtitle: `${fixed}${count} madde · ${shape}${media ? "" : " · foto yok"}`,
                media: media as never, // PreviewValue.media ReactNode (react tipi bu pakette yok)
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Açıklama (eski düz metin)",
      description:
        "ESKİ alan — 'İçerik bölümleri' doluysa sayfada GÖRÜNMEZ. Yeni içerik girişini oradan yapın; burası yalnızca eski kayıtlar için duruyor.",
      type: "localeText",
      group: "icerik",
    }),
    defineField({
      name: "benefits",
      title: "Faydalar",
      description: "Veri gelirse bölüm başlığının altında kart dizisi olarak basılır (opsiyonel).",
      type: "array",
      group: "icerik",
      of: [{ type: "localeString" }],
    }),
    defineField({
      name: "steps",
      title: "Tedavi adımları",
      description: "Veri gelirse numaralı adım kartları olarak basılır (opsiyonel).",
      type: "array",
      group: "icerik",
      of: [
        {
          type: "object",
          name: "treatmentStep",
          fields: [
            { name: "title", type: "localeString" },
            { name: "description", type: "localeText" },
          ],
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "SSS",
      description: "Sayfa sonundaki akordeon + Google yapılandırılmış verisi. Standart: 5-7 soru.",
      type: "array",
      group: "baglantilar",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
    }),
    defineField({
      name: "doctors",
      title: "İlgili hekimler",
      description: "Veri gelirse SSS'nin üstünde hekim kartları basılır (opsiyonel).",
      type: "array",
      group: "baglantilar",
      of: [{ type: "reference", to: [{ type: "doctor" }] }],
    }),
    defineField({
      name: "priceNote",
      title: "Fiyat notu",
      type: "localeString",
      group: "icerik",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: {
      title: `name.${studioLocale}`,
      subtitle: "slug.current",
      media: "heroImage",
      sections: "sections",
    },
    prepare: (value: Record<string, unknown> = {}) => {
      const title = value.title as string | undefined;
      const subtitle = value.subtitle as string | undefined;
      const media = value.media;
      const sections = value.sections as unknown[] | undefined;
      const count = sections?.length ?? 0;
      return {
        title: title || "(isimsiz tedavi)",
        subtitle: [subtitle, count > 0 ? `${count} bölüm` : "içerik bölümleri yok"]
          .filter(Boolean)
          .join(" · "),
        media: media as never, // PreviewValue.media ReactNode (react tipi bu pakette yok)
      };
    },
  },
});
