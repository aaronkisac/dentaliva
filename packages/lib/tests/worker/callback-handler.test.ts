import { describe, expect, it, vi } from "vitest";

import { handleCallbackPost, type CallbackWorkerDeps } from "../../src/worker/callback-handler";

function jsonRequest(body: unknown, ip = "1.2.3.4"): Request {
  return new Request("https://www.dentaliva.com/api/callback", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": ip },
    body: JSON.stringify(body),
  });
}

function makeDeps(overrides: Partial<CallbackWorkerDeps> = {}): CallbackWorkerDeps {
  return {
    verifyTurnstile: vi.fn().mockResolvedValue(true),
    rateLimit: vi.fn().mockResolvedValue(true),
    sendMail: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

const validBody = {
  name: "Test Kullanıcı",
  phone: "05320000000",
  preferredTime: "",
  kvkkConsent: true,
  website: "",
  turnstileToken: "tok",
};

describe("handleCallbackPost (FRM-3)", () => {
  it("400 on invalid JSON body", async () => {
    const request = new Request("https://x/api/callback", {
      method: "POST",
      body: "not-json",
      headers: { "content-type": "application/json" },
    });
    const res = await handleCallbackPost(request, makeDeps());
    expect(res.status).toBe(400);
  });

  it("200 + silent ok on honeypot fill (no mail sent)", async () => {
    const deps = makeDeps();
    const res = await handleCallbackPost(
      jsonRequest({ ...validBody, website: "spam", name: "Bot" }),
      deps,
    );
    expect(res.status).toBe(200);
    expect(deps.sendMail).not.toHaveBeenCalled();
  });

  it("400 with per-field messages on schema violations", async () => {
    const res = await handleCallbackPost(
      jsonRequest({ name: "", phone: "abc", kvkkConsent: true }),
      makeDeps(),
    );
    const body = (await res.json()) as { fields: Record<string, string> };
    expect(res.status).toBe(400);
    expect(body.fields.name).toBeDefined();
    expect(body.fields.phone).toBeDefined();
  });

  it("400 when turnstile verification fails", async () => {
    const deps = makeDeps({ verifyTurnstile: vi.fn().mockResolvedValue(false) });
    const res = await handleCallbackPost(jsonRequest(validBody), deps);
    expect(res.status).toBe(400);
  });

  it("429 when rate limited", async () => {
    const deps = makeDeps({ rateLimit: vi.fn().mockResolvedValue(false) });
    const res = await handleCallbackPost(jsonRequest(validBody), deps);
    expect(res.status).toBe(429);
  });

  it("502 when mail send fails", async () => {
    const deps = makeDeps({ sendMail: vi.fn().mockRejectedValue(new Error("resend down")) });
    const res = await handleCallbackPost(jsonRequest(validBody), deps);
    expect(res.status).toBe(502);
  });

  it("200 on the happy path and sends mail with the form values", async () => {
    const deps = makeDeps();
    const res = await handleCallbackPost(
      jsonRequest({ ...validBody, preferredTime: "14:00" }),
      deps,
    );
    expect(res.status).toBe(200);
    expect(deps.sendMail).toHaveBeenCalledWith({
      name: "Test Kullanıcı",
      phone: "05320000000",
      preferredTime: "14:00",
    });
  });

  it("passes the client IP to the rate limiter", async () => {
    const deps = makeDeps();
    await handleCallbackPost(jsonRequest(validBody, "9.9.9.9"), deps);
    expect(deps.rateLimit).toHaveBeenCalledWith("9.9.9.9");
  });
});
