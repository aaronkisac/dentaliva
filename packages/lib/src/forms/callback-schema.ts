import { z } from "zod";

/** TR phone: +90/0 optional trunk, 10 digits (mobile 5xx, landline 2xx/3xx). */
export const TR_PHONE_PATTERN = /^(?:\+90|0)?(?:5\d{2}|2\d{2}|3\d{2})\s?\d{3}\s?\d{2}\s?\d{2}$/;

/**
 * International pattern for the eu site's patients (INT-4): optional +,
 * 7–15 digits after separator stripping (ITU-T E.164 caps at 15). Deliberately
 * accepts Turkish numbers too — visitors to the EN site may still hold +90
 * numbers, and the clinic must not lose them to a stricter pattern.
 */
export const INTL_PHONE_PATTERN = /^\+?\d{7,15}$/;

export interface CallbackFormMessages {
  nameRequired: string;
  nameTooLong: string;
  phoneRequired: string;
  phoneInvalid: string;
  preferredTimeTooLong: string;
  consentRequired: string;
  emailInvalid: string;
  emailTooLong: string;
  interestTooLong: string;
  contactMethodTooLong: string;
}

export const CALLBACK_FORM_MESSAGES: Record<"tr" | "en" | "nl", CallbackFormMessages> = {
  tr: {
    nameRequired: "Lütfen adınızı ve soyadınızı girin.",
    nameTooLong: "Ad çok uzun.",
    phoneRequired: "Telefon numarası zorunludur.",
    phoneInvalid: "Geçerli bir telefon numarası girin (örn. 0532 000 00 00).",
    preferredTimeTooLong: "Tercih edilen saat çok uzun.",
    consentRequired: "KVKK aydınlatma metnini onaylamanız gerekiyor.",
    emailInvalid: "Geçerli bir e-posta adresi girin.",
    emailTooLong: "E-posta çok uzun.",
    interestTooLong: "Tedavi ilgisi alanı çok uzun.",
    contactMethodTooLong: "İletişim tercihi alanı çok uzun.",
  },
  en: {
    nameRequired: "Please enter your full name.",
    nameTooLong: "Name is too long.",
    phoneRequired: "A phone number is required.",
    phoneInvalid: "Enter a valid phone number (e.g. +49 151 234 5678).",
    preferredTimeTooLong: "Preferred call time is too long.",
    consentRequired: "You must accept the Privacy Policy to continue.",
    emailInvalid: "Enter a valid email address.",
    emailTooLong: "Email is too long.",
    interestTooLong: "Treatment interest field is too long.",
    contactMethodTooLong: "Contact method field is too long.",
  },
  nl: {
    nameRequired: "Vul uw volledige naam in.",
    nameTooLong: "Naam is te lang.",
    phoneRequired: "Telefoonnummer is verplicht.",
    phoneInvalid: "Voer een geldig telefoonnummer in (bijv. +31 6 12345678).",
    preferredTimeTooLong: "Gewenst belmoment is te lang.",
    consentRequired: "U moet de privacyverklaring accepteren om door te gaan.",
    emailInvalid: "Voer een geldig e-mailadres in.",
    emailTooLong: "E-mail is te lang.",
    interestTooLong: "Behandelinteresseveld is te lang.",
    contactMethodTooLong: "Contactvoorkeurveld is te lang.",
  },
};

/** Header/body injection guard: kontrol karakterleri e-postaya asla ulaşmaz. */
// eslint-disable-next-line no-control-regex -- kuralın varlık sebebi tam da bu: karakterleri bilerek hedefleyip siliyoruz
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

export function createCallbackSchema(locale: "tr" | "en" | "nl" = "tr") {
  const m = CALLBACK_FORM_MESSAGES[locale];
  const phonePattern = locale === "en" ? INTL_PHONE_PATTERN : TR_PHONE_PATTERN;
  return z.object({
    name: z
      .string()
      .transform((value) => value.replace(CONTROL_CHARS, " "))
      .pipe(z.string().trim().min(2, m.nameRequired).max(100, m.nameTooLong)),
    phone: z
      .string()
      .trim()
      .min(1, m.phoneRequired)
      .transform((value) => value.replace(/[\s()-]/g, ""))
      .refine((value) => phonePattern.test(value), {
        message: m.phoneInvalid,
      }),
    preferredTime: z
      .string()
      .transform((value) => value.replace(CONTROL_CHARS, " "))
      .pipe(z.string().trim().max(120, m.preferredTimeTooLong))
      .optional()
      .or(z.literal("")),
    /**
     * DSN-63 (strateji dokümanı Form 1): opsiyonel e-posta + öz-nicelendirme
     * alanları. Select değerleri UI'dan kısa kodlar olarak gelir; doğrulama
     * uzunluk/kontrol karakteri temizliğiyle sınırlı — sağlık verisi YOK
     * (Form 2 ayrı iştir, burada bilinçli istenmez).
     */
    email: z
      .string()
      .transform((value) => value.replace(CONTROL_CHARS, " "))
      .pipe(
        z
          .string()
          .trim()
          .max(200, m.emailTooLong)
          .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
            message: m.emailInvalid,
          }),
      )
      .optional()
      .or(z.literal("")),
    treatmentInterest: z
      .string()
      .transform((value) => value.replace(CONTROL_CHARS, " "))
      .pipe(z.string().trim().max(60, m.interestTooLong))
      .optional()
      .or(z.literal("")),
    contactMethod: z
      .string()
      .transform((value) => value.replace(CONTROL_CHARS, " "))
      .pipe(z.string().trim().max(40, m.contactMethodTooLong))
      .optional()
      .or(z.literal("")),
    kvkkConsent: z.boolean().refine((value) => value === true, {
      message: m.consentRequired,
    }),
    turnstileToken: z.string().max(2048).optional(),
    /** Honeypot: bots fill this; humans never see it. */
    website: z.string().max(0).optional(),
  });
}

/** The dentaliva.com (tr) form schema — the historical default. */
export const callbackFormSchema = createCallbackSchema("tr");

export type CallbackFormValues = z.output<typeof callbackFormSchema>;
export type CallbackFormInput = z.input<typeof callbackFormSchema>;
export type CallbackFormOutput = z.output<typeof callbackFormSchema>;
