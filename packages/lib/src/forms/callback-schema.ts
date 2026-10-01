import { z } from "zod";

/** TR phone: +90/0 optional trunk, 10 digits (mobile 5xx, landline 2xx/3xx). */
export const TR_PHONE_PATTERN = /^(?:\+90|0)?(?:5\d{2}|2\d{2}|3\d{2})\s?\d{3}\s?\d{2}\s?\d{2}$/;

/** Header/body injection guard: kontrol karakterleri e-postaya asla ulaşmaz. */
// eslint-disable-next-line no-control-regex -- kuralın varlık sebebi tam da bu: karakterleri bilerek hedefleyip siliyoruz
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

export const callbackFormSchema = z.object({
  name: z
    .string()
    .transform((value) => value.replace(CONTROL_CHARS, " "))
    .pipe(z.string().trim().min(2, "Lütfen adınızı ve soyadınızı girin.").max(100, "Ad çok uzun.")),
  phone: z
    .string()
    .trim()
    .min(1, "Telefon numarası zorunludur.")
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .refine((value) => TR_PHONE_PATTERN.test(value), {
      message: "Geçerli bir telefon numarası girin (örn. 0532 000 00 00).",
    }),
  preferredTime: z
    .string()
    .transform((value) => value.replace(CONTROL_CHARS, " "))
    .pipe(z.string().trim().max(120, "Tercih edilen saat çok uzun."))
    .optional()
    .or(z.literal("")),
  kvkkConsent: z.boolean().refine((value) => value === true, {
    message: "KVKK aydınlatma metnini onaylamanız gerekiyor.",
  }),
  turnstileToken: z.string().max(2048).optional(),
  /** Honeypot: bots fill this; humans never see it. */
  website: z.string().max(0).optional(),
});

export type CallbackFormValues = z.output<typeof callbackFormSchema>;
export type CallbackFormInput = z.input<typeof callbackFormSchema>;
export type CallbackFormOutput = z.output<typeof callbackFormSchema>;
