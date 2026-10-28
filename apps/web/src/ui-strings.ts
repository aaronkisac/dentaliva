/**
 * CLIENT-surface chrome strings (DSN-44 exception, INT-3): error boundaries
 * fetch nothing and carousel/lightbox aria labels live inside client bundles.
 * The client learns the active site at build time via NEXT_PUBLIC_SITE_ID.
 * Server-only copy (metadata titles, empty states, seed placeholder) lives in
 * page-strings.ts so it never ships in first-load JS; editable copy stays in
 * the siteCopy singleton.
 *
 * Turkish is the source of truth; `en` must satisfy the same shape.
 */
import type { PaletteId } from "@dentaliva/tokens";

const tr = {
  // error boundaries (client — cannot fetch the CMS)
  errorTitle: "Bir sorun oluştu",
  errorBody: "Sayfa yüklenirken beklenmeyen bir hata oluştu.",
  errorRetry: "Tekrar dene",

  // hero CTAs (client hero)
  bookCta: "Randevu Al",
  exploreServicesCta: "Tedavilerimizi Keşfedin",
  // DSN-63: doküman #01 — birincil dönüşüm ilk değerlendirme formuna gider.
  startReviewCta: "Ücretsiz Ön Değerlendirme Başlatın",
  whatsappCta: "WhatsApp'tan Yazın",
  // DSN-65: karar modüllerinin ana CTA linki (sunucu bileşeni de okur).
  moduleCta: "Seçenekleri keşfedin",

  // social proof (client testimonials)
  googleBadge: "Google Değerlendirmeleri · 5,0",
  patientVideoAlt: "Hasta videosu",

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
  galleryMore: (n: number) => `+${n} — galeriyi aç`,

  // callback form (client — INT-4)
  nameLabel: "Ad Soyad *",
  phoneLabel: "Telefon / WhatsApp *",
  phonePlaceholder: "0532 000 00 00",
  preferredTimeLabel: "Tercih edilen arama saati (opsiyonel)",
  // DSN-63: doküman Form 1'in opsiyonel alanları.
  emailLabel: "E-posta (opsiyonel)",
  treatmentInterestLabel: "Tedavi ilgisi (opsiyonel)",
  treatmentInterestOptions: {
    "": "Seçiniz",
    implants: "İmplant / eksik diş",
    "full-arch": "Tüm çene (All-on-4/6)",
    smile: "Gülüş tasarımı",
    veneers: "Lamine kaplama",
    crowns: "Zirkonyum kaplama",
    unsure: "Emin değilim",
  } as Record<string, string>,
  contactMethodLabel: "Sizi nasıl aramamızı istersiniz? (opsiyonel)",
  contactMethodOptions: {
    "": "Seçiniz",
    whatsapp: "WhatsApp",
    phone: "Telefon",
    email: "E-posta",
  } as Record<string, string>,
  consentLabel:
    "KVKK aydınlatma metnini okudum; kişisel verilerimin geri arama amacıyla işlenmesine onay veriyorum. *",
  privacyNotice: "Gizlilik Bildirimi",
  submitting: "Gönderiliyor…",
  submitCta: "Geri arama talep et",
  successMessage: "Talebiniz alındı. En kısa sürede size dönüş yapacağız.",
  submitErrorFallback: "Gönderim başarısız oldu. Lütfen tekrar deneyin.",
  connectionError: "Bağlantı hatası. Lütfen tekrar deneyin.",

  // palette switcher (client — DSN-57)
  themeOpenAria: "Renk paleti seçiciyi aç",
  themeLabel: "Renk paleti",
  themeClose: "Renk paleti seçiciyi kapat",
  paletteNames: {
    espresso: "Espresso",
    gece: "Gece Mavisi",
    deniz: "Deniz Yeşili",
    bordeaux: "Bordeaux",
    zeytin: "Zeytin",
    lila: "Lila",
    okyanus: "Okyanus",
    gul: "Gül",
    tarcin: "Tarçın",
    orman: "Orman",
  } satisfies Record<PaletteId, string>,
};

const en: typeof tr = {
  errorTitle: "Something went wrong",
  errorBody: "An unexpected error occurred while loading the page.",
  errorRetry: "Try again",

  bookCta: "Book an Appointment",
  exploreServicesCta: "Explore our treatments",
  startReviewCta: "Start My Free Initial Review",
  whatsappCta: "Chat on WhatsApp",
  moduleCta: "Explore the options",

  googleBadge: "Google Reviews · 5.0",
  patientVideoAlt: "Patient video",

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
  galleryMore: (n) => `+${n} — open gallery`,

  nameLabel: "Full Name *",
  phoneLabel: "Phone / WhatsApp *",
  phonePlaceholder: "+90 532 000 00 00",
  preferredTimeLabel: "Preferred call time (optional)",
  emailLabel: "Email (optional)",
  treatmentInterestLabel: "Treatment interest (optional)",
  treatmentInterestOptions: {
    "": "Select",
    implants: "Implants / missing teeth",
    "full-arch": "Full arch (All-on-4/6)",
    smile: "Smile design",
    veneers: "Veneers",
    crowns: "Zirconia crowns",
    unsure: "Not sure yet",
  },
  contactMethodLabel: "How should we contact you? (optional)",
  contactMethodOptions: {
    "": "Select",
    whatsapp: "WhatsApp",
    phone: "Phone",
    email: "Email",
  },
  consentLabel:
    "I have read the Privacy Policy and consent to my personal data being processed for the purpose of a callback. *",
  privacyNotice: "Privacy Notice",
  submitting: "Sending…",
  submitCta: "Request a callback",
  successMessage: "We've received your request. We'll get back to you as soon as possible.",
  submitErrorFallback: "Submission failed. Please try again.",
  connectionError: "Connection error. Please try again.",

  themeOpenAria: "Open the colour palette picker",
  themeLabel: "Colour palette",
  themeClose: "Dismiss the colour palette picker",
  paletteNames: {
    espresso: "Espresso",
    gece: "Midnight Blue",
    deniz: "Sea Green",
    bordeaux: "Bordeaux",
    zeytin: "Olive",
    lila: "Lilac",
    okyanus: "Ocean",
    gul: "Rose",
    tarcin: "Cinnamon",
    orman: "Forest",
  } satisfies Record<PaletteId, string>,
};

const nl: typeof tr = {
  errorTitle: "Er is iets misgegaan",
  errorBody: "Er is een onverwachte fout opgetreden bij het laden van de pagina.",
  errorRetry: "Probeer opnieuw",

  bookCta: "Afspraak maken",
  exploreServicesCta: "Ontdek onze behandelingen",
  startReviewCta: "Start mijn gratis eerste beoordeling",
  whatsappCta: "Stuur een bericht via WhatsApp",
  moduleCta: "Bekijk de opties",

  googleBadge: "Google Reviews · 5,0",
  patientVideoAlt: "Patiëntvideo",

  doctorsRegionAria: "Onze tandartsen",
  doctorsLive: (name, i, n) => `Uitgelicht: ${name} (${i}/${n})`,
  prevDoctors: "Vorige tandartsen",
  nextDoctors: "Volgende tandartsen",
  doctorSlideAria: (n) => `Tandarts ${n}`,
  prevServices: "Vorige behandelingen",
  nextServices: "Volgende behandelingen",
  serviceSlideAria: (n) => `Behandeling ${n}`,

  lightboxImageAria: (n) => `Afbeelding ${n} — vergroot`,
  lightboxFilterAria: "Galerijfilter",
  prevImages: "Vorige afbeeldingen",
  nextImages: "Volgende afbeeldingen",
  galleryImageAria: (n) => `Afbeelding ${n}`,
  galleryImageAlt: "Galerijafbeelding",
  galleryMore: (n) => `+${n} — galerij openen`,

  nameLabel: "Volledige naam *",
  phoneLabel: "Telefoon / WhatsApp *",
  phonePlaceholder: "+31 6 12345678",
  preferredTimeLabel: "Gewenste belmoment (optioneel)",
  emailLabel: "E-mail (optioneel)",
  treatmentInterestLabel: "Behandelinteresse (optioneel)",
  treatmentInterestOptions: {
    "": "Kies",
    implants: "Implantaten / ontbrekende tanden",
    "full-arch": "Volledige kaak (All-on-4/6)",
    smile: "Glimlachontwerp",
    veneers: "Veneers",
    crowns: "Zirkoniumkronen",
    unsure: "Weet ik nog niet",
  },
  contactMethodLabel: "Hoe mogen we u bereiken? (optioneel)",
  contactMethodOptions: {
    "": "Kies",
    whatsapp: "WhatsApp",
    phone: "Telefoon",
    email: "E-mail",
  },
  consentLabel:
    "Ik heb het privacybeleid gelezen en geef toestemming voor het verwerken van mijn gegevens voor een terugbelverzoek. *",
  privacyNotice: "Privacyverklaring",
  submitting: "Versturen…",
  submitCta: "Terugbelverzoek aanvragen",
  successMessage: "Uw aanvraag is ontvangen. Wij nemen zo snel mogelijk contact met u op.",
  submitErrorFallback: "Verzenden mislukt. Probeer het opnieuw.",
  connectionError: "Verbindingsfout. Probeer het opnieuw.",

  themeOpenAria: "Kleurpaletkiezer openen",
  themeLabel: "Kleurpalet",
  themeClose: "Kleurpaletkiezer sluiten",
  paletteNames: {
    espresso: "Espresso",
    gece: "Middernachtblauw",
    deniz: "Zeegroen",
    bordeaux: "Bordeaux",
    zeytin: "Olijf",
    lila: "Lila",
    okyanus: "Oceaan",
    gul: "Roze",
    tarcin: "Kaneel",
    orman: "Bos",
  } satisfies Record<PaletteId, string>,
};

const strings = { tr, en, nl } as const;

function activeLocale(): keyof typeof strings {
  // Build-time constant: Next inlines NEXT_PUBLIC_SITE_ID as a literal, so
  // terser folds this chain and dead-code-eliminates the INACTIVE locale's
  // table from the client bundle. Kept in sync with the site registry by
  // tests/ui-strings.test.ts.
  const site = process.env.NEXT_PUBLIC_SITE_ID;
  return site === "eu" ? "en" : site === "nl" ? "nl" : "tr";
}

export function uiString<K extends keyof typeof tr>(key: K): (typeof tr)[K] {
  return strings[activeLocale()][key];
}
