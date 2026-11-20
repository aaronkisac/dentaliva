/**
 * DSN-105: anasayfa bölüm id'leri TEK KAYNAK — web tarafındaki composition
 * filtresi (config-types) ve Studio'daki hiddenSections seçenek listesi
 * (clinic home-page şeması) buradan türetilir. İki elle-senkron listeden
 * biri kaydığı zaman bölüm sessizce hiç gizlenemiyordu; şimdi desync
 * tip seviyesinde imkânsız.
 */

/** Composition motorunun tanıdığı bölüm id'leri (sıra v1 konvansiyonu). */
export const HOME_SECTION_IDS = [
  "hero",
  "ticker",
  "trustStrip",
  "quickServices",
  "about",
  "treatmentPaths",
  "videoTestimonials",
  "reviewForm",
  "howItWorks",
  "decisionModules",
  "travelStay",
  "aftercare",
  "reviews",
  "clinics",
  "gallery",
  "onceSonra",
  "doctors",
  "faq",
  "cta",
] as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

/** Studio'daki hiddenSections seçenek başlıkları (com/tr stüdyo dili). */
export const HOME_SECTION_TITLES: Record<HomeSectionId, string> = {
  hero: "Hero",
  ticker: "Hizmet şeridi",
  trustStrip: "Güven şeridi",
  quickServices: "Hizmetler carousel'i",
  about: "Hakkında",
  treatmentPaths: "Tedavi yolları",
  videoTestimonials: "Video yorumlar",
  reviews: "Hasta yorumları",
  clinics: "Üç klinik",
  gallery: "Fotoğraf galerisi",
  onceSonra: "Önce/Sonra vakalar",
  doctors: "Ekip",
  reviewForm: "Ön değerlendirme formu",
  howItWorks: "Nasıl işler",
  decisionModules: "Karar modülleri",
  travelStay: "Seyahat ve konaklama",
  aftercare: "Tedavi sonrası bakım",
  faq: "SSS",
  cta: "CTA bandı",
};

/** Studio hiddenSections options.list — şema options'ı buradan türetilir. */
export const HOME_SECTION_OPTIONS: Array<{ title: string; value: HomeSectionId }> =
  HOME_SECTION_IDS.map((id) => ({ title: HOME_SECTION_TITLES[id], value: id }));
