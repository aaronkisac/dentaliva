import { site } from "./config";

/**
 * Per-locale chrome strings that cannot come from the CMS (DSN-44 exception,
 * now locale-aware): error boundaries fetch nothing, aria labels and metadata
 * titles are per-language not per-domain, and the client bundle learns the
 * active site at build time via NEXT_PUBLIC_SITE_ID. Editable copy stays in
 * the siteCopy singleton; this table is for fixed interface language.
 *
 * Turkish is the source of truth; `en` must satisfy the same shape.
 */
const tr = {
  // layout chrome
  metaDescription:
    "Dentaliva Diş Kliniği — İstanbul'da implant, ortodonti ve estetik diş hekimliği",
  jsonLdCity: "İstanbul",
  skipLabel: "İçeriğe atla",
  skipAnchor: "icerik",
  bookCta: "Randevu Al",
  toggleMenu: "Menüyü aç/kapat",
  closeMenu: "Menüyü kapat",
  breadcrumbHome: "Ana Sayfa",

  // home metadata
  homeTitle: "Dentaliva Diş Kliniği | İstanbul",
  homeDescription:
    "İstanbul Avcılar, Başakşehir ve Altunizade şubeleriyle implant, ortodonti ve estetik diş hekimliği",

  // section/listing titles (metadata + PageHero + breadcrumbs)
  aboutTitle: "Hakkımızda",
  aboutDescription: "Dentaliva hakkında",
  servicesTitle: "Hizmetlerimiz",
  doctorsTitle: "Hekimlerimiz",
  branchesTitle: "Şubelerimiz",
  contactTitle: "İletişim",
  galleryTitle: "Fotoğraf Galerisi",
  galleryDescription: "Dentaliva fotoğraf galerisi",
  legalTitle: "KVKK Aydınlatma Metni",
  legalDescription: "Kişisel verilerin korunması aydınlatma metni",
  blogDescription: "Dentaliva blog — diş sağlığı yazıları",

  // empty / resilience states
  blogEmpty: "Yazılar hazırlanıyor.",
  doctorsEmpty: "Hekim kadromuz hazırlanıyor.",
  seedPlaceholder:
    "Bu içerik henüz hazırlanıyor. Sanity projenize dokümanlar eklediğinizde bu sayfa otomatik olarak doldurulur (webhook yeniden derlemesi ile yayına girer).",

  // error boundaries (client — cannot fetch the CMS)
  errorTitle: "Bir sorun oluştu",
  errorBody: "Sayfa yüklenirken beklenmeyen bir hata oluştu.",
  errorRetry: "Tekrar dene",

  // hero
  exploreServicesCta: "Hizmetlerimizi Keşfedin",

  // social proof
  googleBadge: "Google Değerlendirmeleri · 5,0",
  patientVideoAlt: "Hasta videosu",

  // gallery screen-reader strings
  gallerySrSummary: (n: number) => `Galeri: ${n} görsel, büyütmek için görsel seçin.`,
  galleryFirstAltSr: (alt: string) => `İlk görsel açıklaması: ${alt}`,

  // carousel aria labels
  doctorsRegionAria: "Uzman hekimler",
  doctorsLive: (name: string, i: number, n: number) => `Öne çıkan: ${name} (${i}/${n})`,
  prevDoctors: "Önceki hekimler",
  nextDoctors: "Sonraki hekimler",
  doctorSlideAria: (n: number) => `${n}. hekim`,
  prevServices: "Önceki hizmetler",
  nextServices: "Sonraki hizmetler",
  serviceSlideAria: (n: number) => `${n}. hizmet`,

  // lightbox aria labels
  lightboxImageAria: (n: number) => `Görsel ${n} — büyüt`,
  lightboxFilterAria: "Galeri filtresi",
  prevImages: "Önceki görseller",
  nextImages: "Sonraki görseller",
  galleryImageAria: (n: number) => `${n}. görsel`,
  galleryImageAlt: "Galeri görseli",
};

const en: typeof tr = {
  metaDescription:
    "Dentaliva Dental Clinic — implants, orthodontics and aesthetic dentistry in Istanbul",
  jsonLdCity: "Istanbul",
  skipLabel: "Skip to content",
  skipAnchor: "content",
  bookCta: "Book an Appointment",
  toggleMenu: "Open/close menu",
  closeMenu: "Close menu",
  breadcrumbHome: "Home",

  homeTitle: "Dentaliva Dental Clinic | Istanbul",
  homeDescription:
    "Implants, orthodontics and aesthetic dentistry at our Avcılar, Başakşehir and Altunizade clinics in Istanbul",

  aboutTitle: "About Us",
  aboutDescription: "About Dentaliva",
  servicesTitle: "Services",
  doctorsTitle: "Our Doctors",
  branchesTitle: "Branches",
  contactTitle: "Contact",
  galleryTitle: "Photo Gallery",
  galleryDescription: "Dentaliva photo gallery",
  legalTitle: "Privacy Policy",
  legalDescription: "How we process and protect your personal data",
  blogDescription: "Dentaliva blog — oral health articles",

  blogEmpty: "Articles are on their way.",
  doctorsEmpty: "Our doctor profiles are on their way.",
  seedPlaceholder:
    "This content is not ready yet. Once documents are added to the Sanity project, this page fills in automatically (via the rebuild webhook).",

  errorTitle: "Something went wrong",
  errorBody: "An unexpected error occurred while loading the page.",
  errorRetry: "Try again",

  exploreServicesCta: "Explore our services",

  googleBadge: "Google Reviews · 5.0",
  patientVideoAlt: "Patient video",

  gallerySrSummary: (n) => `Gallery: ${n} images, select one to enlarge.`,
  galleryFirstAltSr: (alt) => `First image description: ${alt}`,

  doctorsRegionAria: "Our doctors",
  doctorsLive: (name, i, n) => `Featured: ${name} (${i}/${n})`,
  prevDoctors: "Previous doctors",
  nextDoctors: "Next doctors",
  doctorSlideAria: (n) => `Doctor ${n}`,
  prevServices: "Previous services",
  nextServices: "Next services",
  serviceSlideAria: (n) => `Service ${n}`,

  lightboxImageAria: (n) => `Image ${n} — enlarge`,
  lightboxFilterAria: "Gallery filter",
  prevImages: "Previous images",
  nextImages: "Next images",
  galleryImageAria: (n) => `Image ${n}`,
  galleryImageAlt: "Gallery image",
};

const strings = { tr, en } as const;

function uiStrings() {
  return site.defaultLocale === "en" ? strings.en : strings.tr;
}

export function uiString<K extends keyof typeof tr>(key: K): (typeof tr)[K] {
  return uiStrings()[key];
}
