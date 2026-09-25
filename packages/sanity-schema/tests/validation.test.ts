import { describe, expect, it } from "vitest";

import { requireTr, validRedirectTarget, validTrPhone } from "../src/validation";

describe("requireTr", () => {
  it.each([[undefined], [null], [{ tr: undefined }], [{ tr: "" }], [{ tr: "   " }]])(
    "rejects %j",
    (value) => {
      expect(requireTr(value)).toBe("Türkçe içerik zorunludur");
    },
  );

  it("accepts real Turkish content", () => {
    expect(requireTr({ tr: "Gülüş tasarımı" })).toBe(true);
  });
});

describe("validTrPhone", () => {
  it("allows empty (optional field)", () => {
    expect(validTrPhone(undefined)).toBe(true);
    expect(validTrPhone("")).toBe(true);
  });

  it.each(["+90 212 555 54 82", "02125555482", "+90 532 000 00 00", "905320000000"])(
    "accepts %s",
    (phone) => {
      expect(validTrPhone(phone)).toBe(true);
    },
  );

  it.each(["12345", "abc", "+44 20 7000 0000", "555"])("rejects %s", (phone) => {
    expect(validTrPhone(phone)).toBe("Geçerli bir telefon girin (örn. +90 212 555 54 82)");
  });
});

describe("validRedirectTarget", () => {
  it("requires a value", () => {
    expect(validRedirectTarget(undefined)).toContain("Hedef zorunludur");
    expect(validRedirectTarget("")).toContain("Hedef zorunludur");
  });

  it.each(["/blog/yeni-yazi", "https://dentaliva.com/sayfa"])("accepts %s", (target) => {
    expect(validRedirectTarget(target)).toBe(true);
  });

  it.each(["blog/yeni-yazi", "http://insecure.com/x", "javascript:alert(1)"])(
    "rejects %s",
    (target) => {
      expect(validRedirectTarget(target)).toContain("ile başlamalı");
    },
  );
});
