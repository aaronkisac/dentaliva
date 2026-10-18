import { describe, expect, it } from "vitest";

import {
  INTL_PHONE_PATTERN,
  TR_PHONE_PATTERN,
  callbackFormSchema,
  createCallbackSchema,
} from "../src/forms/callback-schema";

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

  it("rejects names longer than 100 characters (SEC-1)", () => {
    const parsed = callbackFormSchema.safeParse({ ...valid, name: "A".repeat(101) });
    expect(parsed.success).toBe(false);
  });

  it("strips control characters from name (SEC-1)", () => {
    const parsed = callbackFormSchema.safeParse({
      ...valid,
      name: "Ada\nBcc: x@y.z\u0000",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.name).toBe("Ada Bcc: x@y.z");
  });

  it("strips control characters from preferredTime (SEC-1)", () => {
    const parsed = callbackFormSchema.safeParse({
      ...valid,
      preferredTime: "14:00\r\nSet: trap",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.preferredTime).toBe("14:00  Set: trap");
  });

  it("rejects preferredTime longer than 120 characters", () => {
    const parsed = callbackFormSchema.safeParse({ ...valid, preferredTime: "x".repeat(121) });
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

describe("createCallbackSchema('en') (INT-4)", () => {
  const enSchema = createCallbackSchema("en");
  const valid = {
    name: "Ada Lovelace",
    phone: "+49 151 234 5678",
    kvkkConsent: true,
  };

  it("accepts an international number and keeps Turkish numbers working", () => {
    expect(enSchema.safeParse(valid).success).toBe(true);
    expect(enSchema.safeParse({ ...valid, phone: "0532 000 00 00" }).success).toBe(true);
  });

  it("still rejects impossible numbers", () => {
    expect(enSchema.safeParse({ ...valid, phone: "123" }).success).toBe(false);
  });

  it("returns EN field messages", () => {
    const parsed = enSchema.safeParse({ ...valid, name: "A", kvkkConsent: false });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message);
      expect(messages).toContain("Please enter your full name.");
      expect(messages).toContain("You must accept the Privacy Policy to continue.");
    }
  });

  it("uses the EN phone hint in the invalid-phone message", () => {
    const parsed = enSchema.safeParse({ ...valid, phone: "123" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toContain("+49 151 234 5678");
    }
  });
});

describe("INTL_PHONE_PATTERN", () => {
  it.each(["+491512345678", "491512345678", "+905320000000", "05320000000"])(
    "matches %s",
    (phone) => {
      expect(INTL_PHONE_PATTERN.test(phone)).toBe(true);
    },
  );

  it.each(["+49 15", "abcdefgh", "+", "1234567890123456"])("does not match %s", (phone) => {
    expect(INTL_PHONE_PATTERN.test(phone)).toBe(false);
  });
});
