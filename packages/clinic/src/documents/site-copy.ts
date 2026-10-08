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
        { name: "faq", title: "Sıkça sorulan sorular", type: "localeText" },
        { name: "keyBenefits", title: "Öne çıkan faydalar", type: "localeText" },
        { name: "treatmentProcess", title: "Tedavi süreci", type: "localeText" },
        { name: "treatmentProcessEyebrow", title: "Tedavi süreci üst etiketi", type: "localeText" },
        { name: "doctorProfileLink", title: "Hekim profil bağlantısı", type: "localeText" },
        { name: "routeLink", title: "Yol tarifi bağlantısı", type: "localeText" },
        { name: "callbackForm", title: "Geri arama formu başlığı", type: "localeText" },
        { name: "galleryPage", title: "Galeri sayfası başlığı", type: "localeText" },
        { name: "galleryEmpty", title: "Galeri boş durumu", type: "localeText" },
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
      name: "ui",
      title: "Arayüz metinleri",
      type: "object",
      fields: [
        { name: "lightboxClose", title: "Lightbox kapat", type: "localeText" },
        { name: "notFoundTitle", title: "404 başlık", type: "localeText" },
        { name: "notFoundBody", title: "404 açıklama", type: "localeText" },
        { name: "notFoundBackLink", title: "404 ana sayfa bağlantısı", type: "localeText" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Metinleri" }) },
});
