/**
 * POST /api/callback handler — pure logic with injected dependencies so the
 * same code runs in the Cloudflare Worker and in tests (FRM-3/FRM-4).
 * Zero persistence: data lives only in the outbound email (ADR — FRM epic).
 */
import { callbackFormSchema } from "../forms/callback-schema";

export interface CallbackWorkerDeps {
  verifyTurnstile: (token: string, ip: string | null) => Promise<boolean>;
  rateLimit: (ip: string | null) => Promise<boolean>;
  sendMail: (input: { name: string; phone: string; preferredTime: string }) => Promise<void>;
}

const json = (status: number, body: Record<string, unknown>): Response =>
  Response.json(body, { status });

/** Geçerli form yükü 1 KB'ın bile altında; daha büyüğü kötüye kullanımdır. */
const MAX_BODY_BYTES = 10_000;

export async function handleCallbackPost(
  request: Request,
  deps: CallbackWorkerDeps,
): Promise<Response> {
  const ip = request.headers.get("cf-connecting-ip");

  // Limiter en başta: siteverify outbound çağrısı dahil doğrulama maliyeti,
  // limiter'ı hiç görmeyen flood'lara açık kalmamalı.
  if (!(await deps.rateLimit(ip))) {
    return json(429, { error: "Çok fazla istek. Lütfen birazdan tekrar deneyin." });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return json(413, { error: "İstek gövdesi çok büyük." });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { error: "Geçersiz istek gövdesi." });
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
    return json(400, { error: "Doğrulama hatası.", fields });
  }
  const values = parsed.data;

  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  if (!(await deps.verifyTurnstile(token, ip))) {
    return json(400, { error: "Doğrulama başarısız. Lütfen tekrar deneyin." });
  }

  try {
    await deps.sendMail({
      name: values.name,
      phone: values.phone,
      preferredTime: values.preferredTime ?? "",
    });
  } catch {
    return json(502, { error: "E-posta gönderilemedi. Lütfen telefonla iletişime geçin." });
  }

  return json(200, { ok: true });
}
