/**
 * POST /api/callback Worker: Zod doğrulama → Turnstile → rate limit → Resend.
 * Kalıcı veri tutulmaz; tek çıkış e-postadır (FRM-3).
 */
import { handleCallbackPost } from "@dentaliva/lib/worker/callback-handler";

interface CallbackWorkerEnv {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  NOTIFY_EMAIL?: string;
  MAIL_FROM?: string;
  /** E2E/local: dış çağrıları atlat (mock mod). */
  MOCK_EXTERNAL?: string;
  RATE_LIMITER?: { limit(key: { key: string }): Promise<{ success: boolean }> };
  ASSETS: { fetch(request: Request): Promise<Response> };
}

async function verifyTurnstile(
  env: CallbackWorkerEnv,
  token: string,
  ip: string | null,
): Promise<boolean> {
  if (env.MOCK_EXTERNAL === "1") return true; // mock mod: harici doğrulama yok
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET ?? "",
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    }),
  });
  const json = (await res.json()) as { success?: boolean };
  return json.success === true;
}

const memoryCounters = new Map<string, { count: number; resetAt: number }>();

async function rateLimit(env: CallbackWorkerEnv, ip: string | null): Promise<boolean> {
  if (env.RATE_LIMITER) {
    const result = await env.RATE_LIMITER.limit({ key: ip ?? "unknown" });
    return result.success;
  }
  // FALLBACK: isolate-bazlı bellek sayacı (tek isolate'te yeterli; DEP-1'de
  // RATE_LIMITER binding bağlanır).
  const key = ip ?? "unknown";
  const now = Date.now();
  const entry = memoryCounters.get(key);
  if (entry && now < entry.resetAt) return entry.count < 5;
  memoryCounters.set(key, { count: 1, resetAt: now + 60_000 });
  return true;
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
    body: JSON.stringify({
      from: env.MAIL_FROM ?? "Dentaliva <onboarding@resend.dev>",
      to: [env.NOTIFY_EMAIL ?? "info@dentaliva.com"],
      subject: `Geri arama talebi: ${input.name}`,
      text: `Ad Soyad: ${input.name}\nTelefon: ${input.phone}\nTercih edilen saat: ${input.preferredTime || "-"}`,
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}

export default {
  async fetch(request: Request, env: CallbackWorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    // Yalnızca form API'si Worker'da işlenir; diğer istekler statik asset'lere düşer.
    if (request.method === "POST" && url.pathname === "/api/callback") {
      const deps = {
        verifyTurnstile: (token: string, ip: string | null) => verifyTurnstile(env, token, ip),
        rateLimit: (ip: string | null) => rateLimit(env, ip),
        sendMail: (input: { name: string; phone: string; preferredTime: string }) =>
          sendMail(env, input),
      };
      return handleCallbackPost(request, deps);
    }

    return env.ASSETS.fetch(request);
  },
};
