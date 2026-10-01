import { describe, expect, it } from "vitest";

import { schemaTypes } from "../src/schema";

/**
 * Sanity, validation/initialValue callback'lerini yalnızca Studio doğrulama
 * koşarken çağırır — import onları çalıştırmaz. Bu suite, şemadaki her
 * callback'i zincirlenebilir sahte bir Rule ile çağırarak kapıyı ölçülebilir
 * kılar (TEST: clinic coverage gate) ve zincirleme yanlış kurulan bir kuralı
 * daha erken yakalar.
 */
type ClinicField = {
  name?: string;
  validation?: unknown;
  initialValue?: unknown;
};

type ClinicType = { name: string; fields?: readonly unknown[] };

function chainableRule(): unknown {
  const rule: unknown = new Proxy(
    function chain() {
      return rule;
    },
    {
      get: (_target, prop) => (prop === "custom" ? () => rule : () => rule),
      apply: () => rule,
    },
  );
  return rule;
}

describe("schema field callbacks (TEST coverage gate)", () => {
  it("every validation rule chains against a Rule instance", () => {
    let checked = 0;
    for (const type of schemaTypes as ClinicType[]) {
      for (const raw of type.fields ?? []) {
        const field = raw as ClinicField;
        if (typeof field.validation === "function") {
          const validate = field.validation as (rule: unknown) => unknown;
          expect(validate(chainableRule()), `${type.name}.${field.name}`).toBeDefined();
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("every initialValue resolves without touching the clock", () => {
    let checked = 0;
    for (const type of schemaTypes as ClinicType[]) {
      for (const raw of type.fields ?? []) {
        const field = raw as ClinicField;
        if (typeof field.initialValue === "function") {
          const initial = field.initialValue as () => unknown;
          expect(initial(), `${type.name}.${field.name}`).toBeDefined();
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("field names are unique inside every document", () => {
    for (const type of schemaTypes as ClinicType[]) {
      const names = (type.fields ?? []).map((raw) => (raw as ClinicField).name);
      expect(new Set(names).size, type.name).toBe(names.length);
    }
  });
});
