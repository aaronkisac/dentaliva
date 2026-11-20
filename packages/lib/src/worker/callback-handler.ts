/**
 * POST /api/callback handler — pure logic with injected dependencies so the
 * same code runs in the Cloudflare Worker and in tests (FRM-3/FRM-4).
 * Zero persistence: data lives only in the outbound email (ADR — FRM epic).
 */
import { createCallbackSchema } from "../forms/callback-schema";

export interface CallbackWorkerDeps {
  verifyTurnstile: (token: string, ip: string | null) => Promise<boolean>;
  rateLimit: (ip: string | null) => Promise<boolean>;
  /** DSN-63: yeni Form 1 alanları opsiyonel — eski/tek alanlı istemciler de geçer. */
  sendMail: (input: {
    name: string;
    phone: string;
    preferredTime: string;
    email?: string;
    treatmentInterest?: string;
    contactMethod?: string;
  }) => Promise<void>;
  /** UI language for user-facing error strings (wrangler var LOCALE, INT-4). */
  locale?: "tr" | "en" | "nl";
}

/** User-facing handler errors per locale; field messages come from the schema. */
const HANDLER_MESSAGES = {
  tr: {
    rateLimited: "Çok fazla istek. Lütfen birazdan tekrar deneyin.",
    bodyTooLarge: "İstek gövdesi çok büyük.",
    invalidBody: "Geçersiz istek gövdesi.",
    validationFailed: "Doğrulama hatası.",
    verifyFailed: "Doğrulama başarısız. Lütfen tekrar deneyin.",
    mailFailed: "E-posta gönderilemedi. Lütfen telefonla iletişime geçin.",
    unexpected: "Beklenmeyen bir hata oluştu. Lütfen telefonla iletişime geçin.",
  },
  en: {
    rateLimited: "Too many requests. Please try again shortly.",
    bodyTooLarge: "Request body too large.",
    invalidBody: "Invalid request body.",
    validationFailed: "Validation failed.",
    verifyFailed: "Verification failed. Please try again.",
    mailFailed: "Email could not be sent. Please contact us by phone.",
    unexpected: "An unexpected error occurred. Please contact us by phone.",
  },
  nl: {
    rateLimited: "Te veel verzoeken. Probeer het zo weer.",
    bodyTooLarge: "Aanvraagtekst te groot.",
    invalidBody: "Ongeldige aanvraagtekst.",
    validationFailed: "Validatie mislukt.",
    verifyFailed: "Verificatie mislukt. Probeer het opnieuw.",
    mailFailed: "E-mail kon niet worden verzonden. Neem telefonisch contact met ons op.",
    unexpected: "Onverwachte fout. Neem telefonisch contact met ons op.",
  },
} as const;

const json = (status: number, body: Record<string, unknown>): Response =>
  Response.json(body, { status });

/** Geçerli form yükü 1 KB'ın bile altında; daha büyüğü kötüye kullanımdır. */
const MAX_BODY_BYTES = 10_000;

/**
 * DSN-104: gövdeyi parça parça okur, cap aşımında erken iptal eder.
 * Content-Length header'ı chunked transfer'da yok — yalnız header'a bakmak
 * cap'i bypass edip gövdeyi izolatta tamamen tamponlatıyordu (SEC-1 takip).
 */
async function readBodyWithCap(request: Request, maxBytes: number): Promise<Uint8Array | null> {
  if (!request.body) return new Uint8Array(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    // lib paketinin TS lib'inde reader generic'i any çözünüyor — tek
    // noktada daraltılır (eslint no-unsafe-*).
    const { done, value } = (await reader.read()) as {
      done: boolean;
      value?: Uint8Array;
    };
    if (done || !value) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function handleCallbackPost(
  request: Request,
  deps: CallbackWorkerDeps,
): Promise<Response> {
  const m = HANDLER_MESSAGES[deps.locale ?? "tr"];
  const callbackFormSchema = createCallbackSchema(deps.locale ?? "tr");
  const ip = request.headers.get("cf-connecting-ip");

  // Limiter en başta: siteverify outbound çağrısı dahil doğrulama maliyeti,
  // limiter'ı hiç görmeyen flood'lara açık kalmamalı. Binding hataları
  // (DSN-104) genel hata sayfası yerine 500 JSON döndürür.
  let allowed: boolean;
  try {
    allowed = await deps.rateLimit(ip);
  } catch {
    return json(500, { error: m.unexpected });
  }
  if (!allowed) {
    return json(429, { error: m.rateLimited });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return json(413, { error: m.bodyTooLarge });
  }

  // DSN-104: cap'li okuma — chunked istek de dahil 10KB üstü erken abort.
  const raw = await readBodyWithCap(request, MAX_BODY_BYTES);
  if (raw === null) {
    return json(413, { error: m.bodyTooLarge });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(new TextDecoder().decode(raw)) as Record<string, unknown>;
  } catch {
    return json(400, { error: m.invalidBody });
  }

  // Honeypot doluysa sessizce onaylanmış gibi yanıt ver (botları ayıkla).
  if (typeof body.website === "string" && body.website !== "") {
    return json(200, { ok: true });
  }

  const parsed = callbackFormSchema.safeParse(body);
  if (!parsed.success) {
    // Zod v4 alan başına kısa devre yapar; aynı path'e ikinci issue pratikte
    // oluşmaz, oluşsa da mesajlar alan bazlı sabittir — sonuncusu yazılır.
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fields[issue.path.join(".")] = issue.message;
    }
    return json(400, { error: m.validationFailed, fields });
  }
  const values = parsed.data;

  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  // DSN-104: siteverify kesintisi/timeout'u atış yapar — sendMail ile aynı
  // hata yolu disiplini; kullanıcı formun anladığı verifyFailed JSON'ını alır.
  let verified: boolean;
  try {
    verified = await deps.verifyTurnstile(token, ip);
  } catch {
    return json(400, { error: m.verifyFailed });
  }
  if (!verified) {
    return json(400, { error: m.verifyFailed });
  }

  try {
    await deps.sendMail({
      name: values.name,
      phone: values.phone,
      preferredTime: values.preferredTime ?? "",
      email: values.email ?? "",
      treatmentInterest: values.treatmentInterest ?? "",
      contactMethod: values.contactMethod ?? "",
    });
  } catch {
    return json(502, { error: m.mailFailed });
  }

  return json(200, { ok: true });
}
