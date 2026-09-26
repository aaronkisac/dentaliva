import { describe, expect, it } from "vitest";

import { TR_PHONE_PATTERN, callbackFormSchema } from "../src/forms/callback-schema";

const valid = {
  name: "Aaron Kisac",
  phone: "0532 000 00 00",
  preferredTime: "",
  kvkkConsent: true,
  website: "",
};

describe("callbackFormSchema", () => {
  it("accepts a fully valid payload", () => {
    const parsed = callbackFormSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it.each(["", "abc", "1234", "0532 000"])("rejects invalid phone: %s", (phone) => {
    const parsed = callbackFormSchema.safeParse({ ...valid, phone });
    expect(parsed.success).toBe(false);
  });

  it.each(["+90 532 000 00 00", "0532 000 00 00", "5320000000"])("accepts phone: %s", (phone) => {
    const parsed = callbackFormSchema.safeParse({ ...valid, phone });
    expect(parsed.success).toBe(true);
  });

  it("rejects missing KVKK consent", () => {
    const parsed = callbackFormSchema.safeParse({ ...valid, kvkkConsent: false });
    expect(parsed.success).toBe(false);
  });

  it("rejects short names", () => {
    const parsed = callbackFormSchema.safeParse({ ...valid, name: "A" });
    expect(parsed.success).toBe(false);
  });
});

describe("TR_PHONE_PATTERN", () => {
  it.each(["05320000000", "+905320000000", "5320000000", "02125555482", "+902125555482"])(
    "matches %s",
    (phone) => {
      expect(TR_PHONE_PATTERN.test(phone)).toBe(true);
    },
  );

  it.each(["123", "53200000", "abc"])("does not match %s", (phone) => {
    expect(TR_PHONE_PATTERN.test(phone)).toBe(false);
  });
});
