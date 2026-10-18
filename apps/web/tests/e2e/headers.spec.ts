import { expect, test } from "@playwright/test";

/** DEP-2: güvenlik başlıkları ve CSP assertion'ları (wrangler dev üzerinden). */
// INT-9: site-farkındalı rotalar + ters-site 404 savunması.
const SITE = process.env.SITE_ID ?? "com";
const contactRoute = SITE === "eu" ? "/contact" : "/iletisim";
const foreignSegment = SITE === "eu" ? "/hizmetlerimiz" : "/services";
const routes = ["/", contactRoute];

test.describe("DEP-2: güvenlik başlıkları", () => {
  for (const route of routes) {
    test(`başlıklar mevcut: ${route}`, async ({ request }) => {
      const res = await request.get(route);
      expect(res.ok()).toBeTruthy();
      const headers = res.headers();

      expect(headers["strict-transport-security"]).toContain("max-age=63072000");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["permissions-policy"]).toContain("camera=()");
      expect(headers["cross-origin-opener-policy"]).toBe("same-origin");

      const csp = headers["content-security-policy"];
      expect(csp).toBeTruthy();
      expect(csp).toContain("default-src 'self'");
      // Gözden geçirilmiş üçüncü taraf yüzeyleri: Turnstile + youtube-nocookie.
      expect(csp).toContain("https://challenges.cloudflare.com");
      expect(csp).toContain("https://www.youtube-nocookie.com");
      expect(csp).toContain("https://cdn.sanity.io");
      // Inline script'ler hash'le kurulur — 'unsafe-inline' scriptler için yok.
      expect(csp).toMatch(/'sha256-[A-Za-z0-9+/=]+'/);
      expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
      expect(csp).toContain("frame-ancestors 'none'");
    });
  }

  test("CSP ihlali yok (hidrasyon + Turnstile yüklemesi sonrası)", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") violations.push(msg.text());
    });
    await page.goto(contactRoute);
    await page.waitForLoadState("networkidle");
    // Turnstile widget'ı hidrasyondan sonra yüklenir; ihlaller console'a düşer.
    expect(violations.filter((v) => v.includes("Content-Security-Policy"))).toEqual([]);
  });

  // SEC-1: not_found_handling=404-page, 404 HTML'ini rastgele path'lerde
  // servis eder; o path'ler yalnızca /* kuralıyla eşleşir. Taban koruma
  // (XFO + script-src içermeyen kısmi CSP) orada da devrede olmalı.
  test("INT-6: öteki sitenin segmentleri bu export'ta servis edilmez", async ({ request }) => {
    const res = await request.get(foreignSegment);
    expect(res.status()).toBe(404);
  });

  test("404 path: taban güvenlik koruması aktif", async ({ request }) => {
    const res = await request.get("/bu-bir-404-yolu");
    expect(res.status()).toBe(404);
    const headers = res.headers();

    expect(headers["strict-transport-security"]).toContain("max-age=63072000");
    expect(headers["x-frame-options"]).toBe("DENY");

    const csp = headers["content-security-policy"];
    expect(csp).toBeTruthy();
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
  });
});
