import { describe, expect, it } from "vitest";

import { branch } from "../src/documents/branch";
import { doctor } from "../src/documents/doctor";
import { siteCopy } from "../src/documents/site-copy";
import { treatment } from "../src/documents/treatment";

type AnyField = { name: string; validation?: unknown; type?: string; options?: unknown };

function fieldsOf(type: { fields?: readonly unknown[] }): AnyField[] {
  return (type.fields ?? []) as AnyField[];
}

function fieldOf(type: { fields?: readonly unknown[] }, name: string): AnyField {
  const field = fieldsOf(type).find((f) => f.name === name);
  expect(field, `${name} must exist`).toBeDefined();
  return field as AnyField;
}

function fakeRule() {
  const captured: { custom?: (value: unknown) => unknown } = {};
  const rule: unknown = new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "custom") {
          return (fn: (value: unknown) => unknown) => {
            captured.custom = fn;
            return rule;
          };
        }
        return () => rule;
      },
    },
  );
  return { rule, captured };
}

describe("clinic core documents", () => {
  it.each([
    ["treatment", treatment],
    ["doctor", doctor],
    ["branch", branch],
  ])("%s declares name, slug and seo", (name, type) => {
    expect(type.name).toBe(name);
    for (const fieldName of ["name", "slug", "seo"]) {
      expect(fieldOf(type, fieldName)).toBeDefined();
    }
  });

  it("treatment wires faq and doctor references", () => {
    expect(fieldOf(treatment, "faqs")).toMatchObject({ type: "array" });
    expect(fieldOf(treatment, "doctors")).toMatchObject({ type: "array" });
  });

  it("branch phone runs the Turkish phone validator", () => {
    const phone = fieldOf(branch, "phone");
    const { rule, captured } = fakeRule();
    (phone.validation as (rule: unknown) => unknown)(rule);
    expect(captured.custom?.("0532 000 00 00")).toBe(true);
    expect(captured.custom?.("not-a-phone")).toContain("Geçerli bir telefon");
  });

  it("doctor phone is optional but validated when present", () => {
    const phone = fieldOf(doctor, "phone");
    const { rule, captured } = fakeRule();
    (phone.validation as (rule: unknown) => unknown)(rule);
    expect(captured.custom?.(undefined)).toBe(true);
  });

  it("slug fields source from their names", () => {
    expect(fieldOf(treatment, "slug").options).toMatchObject({ source: "name.tr" });
    expect(fieldOf(doctor, "slug").options).toMatchObject({ source: "name" });
  });

  it("navMenu group requires a heading or at least one treatment", () => {
    const navMenu = fieldOf(siteCopy, "navMenu") as AnyField & { of?: AnyField[] };
    const groupRule = navMenu.of?.[0]?.validation;
    expect(groupRule).toBeDefined();
    const { rule, captured } = fakeRule();
    (groupRule as (r: unknown) => unknown)(rule);
    expect(captured.custom?.(undefined)).toContain("en az bir başlık ya da tedavi");
    expect(captured.custom?.({})).toContain("en az bir başlık ya da tedavi");
    expect(captured.custom?.({ heading: { tr: "Diş Estetiği" } })).toBe(true);
    expect(captured.custom?.({ treatments: [{}] })).toBe(true);
  });
});
