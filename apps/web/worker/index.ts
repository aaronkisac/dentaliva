/**
 * POST /api/callback Worker: rate limit → Zod doğrulama → Turnstile → Resend.
 * Kalıcı veri tutulmaz; tek çıkış e-postadır (FRM-3).
 */
import { createFixedWindowLimiter } from "@dentaliva/lib/worker/rate-limit";
import { handleCallbackPost } from "@dentaliva/lib/worker/callback-handler";
import type { CallbackWorkerDeps } from "@dentaliva/lib/worker/callback-handler";

interface CallbackWorkerEnv {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
  MAIL_FROM?: string;
  /** E2E/local: dış çağrıları atlat (mock mod). */
  MOCK_EXTERNAL?: string;
  /** Form dili — wrangler var (com: tr, eu: en; INT-4). */
  LOCALE?: string;
  /** Per-site fallback when the NOTIFY_EMAIL secret is absent (INT-8). */
  NOTIFY_FALLBACK?: string;
  RATE_LIMITER?: { limit(key: { key: string }): Promise<{ success: boolean }> };
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const REQUEST_TIMEOUT_MS = 5_000;

async function verifyTurnstile(
  env: CallbackWorkerEnv,
  token: string,
  ip: string | null,
): Promise<boolean> {
  if (env.MOCK_EXTERNAL === "1") return true; // mock mod: harici doğrulama yok
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET ?? "",
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    }),
  });
  const json = (await res.json()) as { success?: boolean };
  return json.success === true;
}

// FALLBACK: isolate-bazlı sabit pencere sayacı (RATE_LIMITER binding'siz
// ortamlar için). Mantık ve testleri @dentaliva/lib/worker/rate-limit'te;
// deploy'larda binding devrede (DEP-1).
const fallbackLimiter = createFixedWindowLimiter(5, 60_000);
let fallbackWarned = false;

async function rateLimit(env: CallbackWorkerEnv, ip: string | null): Promise<boolean> {
  if (env.RATE_LIMITER) {
    const result = await env.RATE_LIMITER.limit({ key: ip ?? "unknown" });
    return result.success;
  }
  if (!fallbackWarned) {
    fallbackWarned = true;
    console.warn("[worker] RATE_LIMITER binding yok — isolate-bazlı fallback devrede.");
  }
  return fallbackLimiter.check(ip ?? "unknown");
}

async function sendMail(
  env: CallbackWorkerEnv,
  input: { name: string; phone: string; preferredTime: string },
): Promise<void> {
  if (env.MOCK_EXTERNAL === "1") return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY ?? ""}`,
      "content-type": "application/json",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      from: env.MAIL_FROM ?? "Dentaliva <onboarding@resend.dev>",
      to: [env.NOTIFY_EMAIL ?? env.NOTIFY_FALLBACK ?? "info@dentaliva.com"],
      subject: `Geri arama talebi: ${input.name}`,
      text: `Ad Soyad: ${input.name}\nTelefon: ${input.phone}\nTercih edilen saat: ${input.preferredTime || "-"}`,
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

let mockModeWarned = false;

export default {
  async fetch(request: Request, env: CallbackWorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    // Yalnızca form API'si Worker'da işlenir; diğer istekler statik asset'lere düşer.
    if (request.method === "POST" && url.pathname === "/api/callback") {
      if (env.MOCK_EXTERNAL === "1" && !mockModeWarned) {
        mockModeWarned = true;
        console.warn(
          "[worker] MOCK_EXTERNAL=1 — Turnstile doğrulaması ve e-posta atlanıyor (yalnızca staging/e2e).",
        );
      }
      const deps: CallbackWorkerDeps = {
        verifyTurnstile: (token: string, ip: string | null) => verifyTurnstile(env, token, ip),
        rateLimit: (ip: string | null) => rateLimit(env, ip),
        sendMail: (input: { name: string; phone: string; preferredTime: string }) =>
          sendMail(env, input),
        locale: env.LOCALE === "en" ? "en" : "tr",
      };
      return handleCallbackPost(request, deps);
    }

    return env.ASSETS.fetch(request);
  },
};
