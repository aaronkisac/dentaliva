/**
 * SERVER-only page strings (INT-3): metadata titles/descriptions, empty
 * states and resilience copy. Rendered at build time in server components —
 * deliberately separate from ui-strings.ts so these never enter client
 * bundles (first-load JS budget). Same shape contract as ui-strings.
 *
 * Turkish is the source of truth; `en` must satisfy the same shape.
 */
const tr = {
  // layout chrome (server layout)
  metaDescription:
    "Dentaliva Diş Kliniği — İstanbul'da implant, ortodonti ve estetik diş hekimliği",
  jsonLdCity: "İstanbul",
  skipLabel: "İçeriğe atla",
  skipAnchor: "icerik",
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

  // gallery screen-reader strings (server-rendered gallery page)
  gallerySrSummary: (n: number) => `Galeri: ${n} görsel, büyütmek için görsel seçin.`,
  galleryFirstAltSr: (alt: string) => `İlk görsel açıklaması: ${alt}`,
};

const en: typeof tr = {
  metaDescription:
    "Dentaliva Dental Clinic — implants, orthodontics and aesthetic dentistry in Istanbul",
  jsonLdCity: "Istanbul",
  skipLabel: "Skip to content",
  skipAnchor: "content",
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

  gallerySrSummary: (n) => `Gallery: ${n} images, select one to enlarge.`,
  galleryFirstAltSr: (alt) => `First image description: ${alt}`,
};

const strings = { tr, en } as const;

export function pageString<K extends keyof typeof tr>(key: K): (typeof tr)[K] {
  // Same NEXT_PUBLIC_SITE_ID fold as ui-strings (build-time constant).
  return strings[process.env.NEXT_PUBLIC_SITE_ID === "eu" ? "en" : "tr"][key];
}
