import { defineField, defineType } from "sanity";

/**
 * Singleton: tüm arayüz metinleri — sıfır-hardcoded-copy kuralının (AGENTS.md)
 * tam zorlaması. Kod içinde kalan her başlık/etiket buraya taşınır; müşteri
 * Studio'dan düzenler, webhook yeniden derlemesinde yayına girer.
 */
export const siteCopy = defineType({
  name: "siteCopy",
  title: "Site Metinleri",
  type: "document",
  fields: [
    defineField({
      name: "footer",
      title: "Footer başlıkları",
      type: "object",
      fields: [
        { name: "contactHeading", title: "İletişim sütunu", type: "localeText" },
        { name: "quickLinksHeading", title: "Hızlı erişim sütunu", type: "localeText" },
        { name: "followHeading", title: "Takip sütunu", type: "localeText" },
      ],
    }),
    defineField({
      name: "sectionHeadings",
      title: "Sayfa içi bölüm başlıkları",
      type: "object",
      fields: [
        { name: "relatedDoctors", title: "İlgili hekimler", type: "localeText" },
        { name: "doctorsLead", title: "Hekimlerimiz sayfası açıklaması", type: "localeText" },
        { name: "reviews", title: "Hasta yorumları (ana sayfa)", type: "localeText" },
        { name: "videoReviews", title: "Hasta videoları (ana sayfa)", type: "localeText" },
        { name: "faq", title: "Sıkça sorulan sorular", type: "localeText" },
        { name: "keyBenefits", title: "Öne çıkan faydalar", type: "localeText" },
        { name: "treatmentProcess", title: "Tedavi süreci", type: "localeText" },
        { name: "treatmentProcessEyebrow", title: "Tedavi süreci üst etiketi", type: "localeText" },
        { name: "doctorProfileLink", title: "Hekim profil bağlantısı", type: "localeText" },
        { name: "routeLink", title: "Yol tarifi bağlantısı", type: "localeText" },
        { name: "branchContact", title: "Şube iletişim başlığı", type: "localeText" },
        { name: "callbackForm", title: "Geri arama formu başlığı", type: "localeText" },
        { name: "galleryPage", title: "Galeri sayfası başlığı", type: "localeText" },
        { name: "galleryHome", title: "Ana sayfa galeri başlığı", type: "localeText" },
        { name: "galleryEmpty", title: "Galeri boş durumu", type: "localeText" },
        { name: "galleryEyebrow", title: "Galeri üst etiketi", type: "localeText" },
        { name: "galleryLead", title: "Galeri açıklaması", type: "localeText" },
        {
          name: "allGalleryCta",
          title: "Tüm fotoğraflar bağlantısı (ana sayfa)",
          type: "localeText",
        },
        {
          name: "branchesLead",
          title: "Şubelerimiz sayfası açıklaması",
          type: "localeText",
        },
        {
          name: "servicesEyebrow",
          title: "Hizmetlerimiz üst etiketi (ana sayfa)",
          type: "localeText",
        },
        { name: "servicesHeading", title: "Hizmetlerimiz başlığı (ana sayfa)", type: "localeText" },
        { name: "allServicesCta", title: "Tüm hizmetler butonu (ana sayfa)", type: "localeText" },
        {
          name: "treatmentPathsEyebrow",
          title: "Tedavi yolları üst etiketi (ana sayfa)",
          type: "localeText",
        },
        {
          name: "treatmentPathsHeading",
          title: "Tedavi yolları başlığı (ana sayfa)",
          type: "localeText",
        },
        {
          name: "reviewFormEyebrow",
          title: "Ön değerlendirme formu üst etiketi (ana sayfa)",
          type: "localeText",
        },
        {
          name: "reviewFormHeading",
          title: "Ön değerlendirme formu başlığı (ana sayfa)",
          type: "localeText",
        },
        {
          name: "howItWorksEyebrow",
          title: "Nasıl işler üst etiketi (ana sayfa)",
          type: "localeText",
        },
        {
          name: "howItWorksHeading",
          title: "Nasıl işler başlığı (ana sayfa)",
          type: "localeText",
        },
        {
          name: "finalCtaEyebrow",
          title: "Final CTA üst etiketi (ana sayfa)",
          type: "localeText",
        },
        {
          name: "travelEyebrow",
          title: "Seyahat üst etiketi (ana sayfa)",
          type: "localeText",
        },
        { name: "travelHeading", title: "Seyahat başlığı (ana sayfa)", type: "localeText" },
        {
          name: "aftercareEyebrow",
          title: "Aftercare üst etiketi (ana sayfa)",
          type: "localeText",
        },
        {
          name: "aftercareHeading",
          title: "Aftercare başlığı (ana sayfa)",
          type: "localeText",
        },
        {
          name: "aftercareNormalTitle",
          title: "Aftercare normal kart başlığı",
          type: "localeText",
        },
        {
          name: "aftercareUrgentTitle",
          title: "Aftercare iletişim kart başlığı",
          type: "localeText",
        },
        {
          name: "clinicsEyebrow",
          title: "Üç klinik üst etiketi (ana sayfa)",
          type: "localeText",
        },
        { name: "clinicsHeading", title: "Üç klinik başlığı (ana sayfa)", type: "localeText" },
        { name: "clinicsIntro", title: "Üç klinik giriş metni (ana sayfa)", type: "localeText" },
        {
          name: "resultsVaryNote",
          title: "Önce/sonra sonuç notu (ana sayfa)",
          type: "localeText",
        },
        {
          name: "onceSonraEyebrow",
          title: "Önce/Sonra üst etiketi (ana sayfa)",
          type: "localeText",
        },
        { name: "onceSonraHeading", title: "Önce/Sonra başlığı (ana sayfa)", type: "localeText" },
        {
          name: "blogFeatured",
          title: "Blog vitrin üst etiketi (/blog)",
          type: "localeText",
        },
      ],
    }),
    defineField({
      name: "heroTrust",
      title: "Hero güven satırı",
      type: "object",
      fields: [
        { name: "since", title: "Kuruluş", type: "localeText" },
        { name: "experience", title: "Deneyim", type: "localeText" },
        { name: "googleRating", title: "Google değerlendirmesi", type: "localeText" },
      ],
    }),
    defineField({
      name: "faq",
      title: "SSS bölümü (ana sayfa)",
      type: "object",
      fields: [
        { name: "eyebrow", title: "Üst etiket", type: "localeText" },
        { name: "support", title: "Destek metni", type: "localeText" },
        { name: "ctaLabel", title: "CTA buton metni", type: "localeText" },
        {
          name: "ctaHref",
          title: "CTA hedefi (dahili yol veya tam URL)",
          type: "string",
          description: "Örn. /iletisim",
        },
      ],
    }),
    defineField({
      name: "ui",
      title: "Arayüz metinleri",
      type: "object",
      fields: [
        { name: "lightboxClose", title: "Lightbox kapat", type: "localeText" },
        { name: "notFoundTitle", title: "404 başlık", type: "localeText" },
        { name: "notFoundBody", title: "404 açıklama", type: "localeText" },
        { name: "notFoundBackLink", title: "404 ana sayfa bağlantısı", type: "localeText" },
        { name: "onceSonraBefore", title: "Önce/Sonra 'Önce' rozeti", type: "localeText" },
        { name: "onceSonraAfter", title: "Önce/Sonra 'Sonra' rozeti", type: "localeText" },
        {
          name: "menuAllLink",
          title: "Menü 'tümünü gör' bağlantısı",
          type: "localeText",
          description: "Tedaviler açılır menüsünün altındaki liste sayfası bağlantısı.",
        },
        {
          name: "appointmentCta",
          title: "Randevu butonu (dönüşüm bandı)",
          type: "localeText",
          description: "İç sayfa sonlarındaki bandın randevu butonu metni.",
        },
        {
          name: "treatmentMidCta",
          title: "Tedavi gövdesi orta molası",
          type: "localeText",
          description: "Uzun tedavi metinlerinin ortasındaki randevu kartının metni (ReadingCta).",
        },
        {
          name: "branchDetailLink",
          title: "Şube detay bağlantısı",
          type: "localeText",
          description: "Şube listeleme satırlarındaki detay bağlantısı metni.",
        },
        {
          name: "blogReadCta",
          title: "Blog okuma bağlantısı",
          type: "localeText",
          description: "Blog vitrin ve kartlarındaki okuma bağlantısı metni.",
        },
      ],
    }),
    defineField({
      name: "navMenu",
      title: "Tedaviler menüsü (header açılır menü)",
      description:
        "Header'daki Tedaviler menüsünün grupları — sırayla sütunlara düşer. Başlıksız grup, başlıklı sütunların altına hizalanır. Menü boşsa Tedaviler bağlantısı düz kalır (açılmaz).",
      type: "array",
      of: [
        {
          type: "object",
          name: "navMenuGroup",
          fields: [
            {
              name: "heading",
              title: "Grup başlığı",
              type: "localeString",
              description: "Boş bırakılabilir — başlıksız sütun olarak çizilir.",
            },
            {
              name: "headingPage",
              title: "Başlık sayfası (başlığı linke çevirir)",
              type: "reference",
              to: [{ type: "treatment" }],
            },
            {
              name: "treatments",
              title: "Tedaviler",
              type: "array",
              of: [{ type: "reference", to: [{ type: "treatment" }] }],
            },
          ],
          validation: (rule) =>
            rule.custom((group: { heading?: unknown; treatments?: unknown[] } | undefined) =>
              !group || (!group.heading && !(group.treatments ?? []).length)
                ? "Grup en az bir başlık ya da tedavi içermeli."
                : true,
            ),
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Metinleri" }) },
});
