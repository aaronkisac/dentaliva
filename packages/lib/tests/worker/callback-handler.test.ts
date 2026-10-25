import { describe, expect, it, vi } from "vitest";

import { handleCallbackPost, type CallbackWorkerDeps } from "../../src/worker/callback-handler";

const MAX_BODY_BYTES = 10_000;

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

  it("429 before parsing or verification when rate limited (SEC-1)", async () => {
    const order: string[] = [];
    const deps = makeDeps({
      rateLimit: vi.fn().mockImplementation(() => {
        order.push("rateLimit");
        return false;
      }),
      verifyTurnstile: vi.fn().mockImplementation(() => {
        order.push("verifyTurnstile");
        return true;
      }),
    });
    const request = new Request("https://x/api/callback", {
      method: "POST",
      body: "not-json",
      headers: { "content-type": "application/json" },
    });
    const res = await handleCallbackPost(request, deps);
    expect(res.status).toBe(429);
    expect(order).toEqual(["rateLimit"]);
  });

  it("413 on oversized body (SEC-1)", async () => {
    // Node'un Request'i content-length'i kendiliğinden açığa çıkarmaz; Workers
    // runtime'da her POST gövdesinde mevcut olduğu için başlığı açıkça veriyoruz.
    const request = new Request("https://x/api/callback", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cf-connecting-ip": "1.2.3.4",
        "content-length": String(MAX_BODY_BYTES + 1),
      },
      body: JSON.stringify({ ...validBody, name: "x".repeat(20_000) }),
    });
    const res = await handleCallbackPost(request, makeDeps());
    expect(res.status).toBe(413);
  });

  it("passes an empty token when turnstileToken is absent (SEC-1)", async () => {
    const withoutToken: Record<string, unknown> = { ...validBody };
    delete withoutToken.turnstileToken;
    const deps = makeDeps();
    const res = await handleCallbackPost(jsonRequest(withoutToken), deps);
    expect(res.status).toBe(200);
    expect(deps.verifyTurnstile).toHaveBeenCalledWith("", "1.2.3.4");
  });

  it("defaults preferredTime to an empty string when the field is omitted (SEC-1)", async () => {
    const withoutTime: Record<string, unknown> = { ...validBody };
    delete withoutTime.preferredTime;
    const deps = makeDeps();
    const res = await handleCallbackPost(jsonRequest(withoutTime), deps);
    expect(res.status).toBe(200);
    expect(deps.sendMail).toHaveBeenCalledWith({
      name: "Test Kullanıcı",
      phone: "05320000000",
      preferredTime: "",
      email: "",
      treatmentInterest: "",
      contactMethod: "",
    });
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
      email: "",
      treatmentInterest: "",
      contactMethod: "",
    });
  });

  it("forwards the DSN-63 review-form fields to the mailer (DSN-63)", async () => {
    const deps = makeDeps();
    const res = await handleCallbackPost(
      jsonRequest({
        ...validBody,
        email: "ada@example.com",
        treatmentInterest: "implants",
        contactMethod: "whatsapp",
      }),
      deps,
    );
    expect(res.status).toBe(200);
    expect(deps.sendMail).toHaveBeenCalledWith({
      name: "Test Kullanıcı",
      phone: "05320000000",
      preferredTime: "",
      email: "ada@example.com",
      treatmentInterest: "implants",
      contactMethod: "whatsapp",
    });
  });

  it("passes the client IP to the rate limiter", async () => {
    const deps = makeDeps();
    await handleCallbackPost(jsonRequest(validBody, "9.9.9.9"), deps);
    expect(deps.rateLimit).toHaveBeenCalledWith("9.9.9.9");
  });
});

describe("handleCallbackPost locale packs (INT-4)", () => {
  const baseDeps = (over: Partial<Parameters<typeof handleCallbackPost>[1]> = {}) => ({
    verifyTurnstile: vi.fn().mockResolvedValue(true),
    rateLimit: vi.fn().mockResolvedValue(true),
    sendMail: vi.fn().mockResolvedValue(undefined),
    ...over,
  });
  const validBody = { name: "Ada", phone: "+49 151 234 5678", kvkkConsent: true };
  const post = (deps: Parameters<typeof handleCallbackPost>[1], body: unknown) =>
    handleCallbackPost(
      new Request("https://x/api/callback", { method: "POST", body: JSON.stringify(body) }),
      deps,
    );

  it("serves EN handler errors when locale=en", async () => {
    const limited = baseDeps({ locale: "en", rateLimit: vi.fn().mockResolvedValue(false) });
    expect(((await (await post(limited, validBody)).json()) as { error: string }).error).toBe(
      "Too many requests. Please try again shortly.",
    );

    const failVerify = baseDeps({
      locale: "en",
      verifyTurnstile: vi.fn().mockResolvedValue(false),
    });
    expect(((await (await post(failVerify, validBody)).json()) as { error: string }).error).toBe(
      "Verification failed. Please try again.",
    );

    const failMail = baseDeps({
      locale: "en",
      sendMail: vi.fn().mockRejectedValue(new Error("x")),
    });
    expect(((await (await post(failMail, validBody)).json()) as { error: string }).error).toBe(
      "Email could not be sent. Please contact us by phone.",
    );

    const badBody = baseDeps({ locale: "en" });
    const res = await post(badBody, { ...validBody, phone: "123" });
    const json = (await res.json()) as { error: string; fields: Record<string, string> };
    expect(json.error).toBe("Validation failed.");
    expect(json.fields.phone).toContain("+49 151 234 5678");

    const garbage = baseDeps({ locale: "en" });
    const res2 = await handleCallbackPost(
      new Request("https://x/api/callback", { method: "POST", body: "not-json" }),
      garbage,
    );
    expect(((await res2.json()) as { error: string }).error).toBe("Invalid request body.");
  });

  it("defaults to tr when locale is absent", async () => {
    const limited = baseDeps({ rateLimit: vi.fn().mockResolvedValue(false) });
    expect(((await (await post(limited, validBody)).json()) as { error: string }).error).toBe(
      "Çok fazla istek. Lütfen birazdan tekrar deneyin.",
    );
  });
});
