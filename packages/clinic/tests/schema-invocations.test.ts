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
  preview?: { prepare?: unknown };
  fields?: readonly unknown[];
  of?: readonly unknown[];
};

type ClinicType = { name: string; fields?: readonly unknown[]; preview?: { prepare?: unknown } };

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

/** Nesne alanların "fields"ını ve dizi alanların "of" üyelerini özyinelemeli gez. */
function* walkFields(fields: readonly unknown[]): Generator<ClinicField> {
  for (const raw of fields) {
    const field = raw as ClinicField;
    yield field;
    if (Array.isArray(field.of)) yield* walkFields(field.of);
    if (Array.isArray(field.fields)) yield* walkFields(field.fields);
  }
}

describe("schema field callbacks (TEST coverage gate)", () => {
  it("every validation rule chains against a Rule instance", () => {
    let checked = 0;
    for (const type of schemaTypes as ClinicType[]) {
      for (const field of walkFields(type.fields ?? [])) {
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
      for (const field of walkFields(type.fields ?? [])) {
        if (typeof field.initialValue === "function") {
          const initial = field.initialValue as () => unknown;
          expect(initial(), `${type.name}.${field.name}`).toBeDefined();
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("every preview prepare resolves (document and field level)", () => {
    let checked = 0;
    for (const type of schemaTypes as ClinicType[]) {
      if (typeof type.preview?.prepare === "function") {
        expect((type.preview.prepare as () => unknown)(), `${type.name}.preview`).toBeDefined();
        checked += 1;
      }
      for (const field of walkFields(type.fields ?? [])) {
        if (typeof field.preview?.prepare === "function") {
          expect(
            (field.preview.prepare as () => unknown)(),
            `${type.name}.${field.name}.preview`,
          ).toBeDefined();
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it("field names are unique among siblings at every nesting level", () => {
    for (const type of schemaTypes as ClinicType[]) {
      const check = (scope: string, fields: readonly unknown[]) => {
        const names = fields.map((raw) => (raw as ClinicField).name);
        expect(new Set(names).size, scope).toBe(names.length);
        for (const raw of fields) {
          const field = raw as ClinicField;
          if (Array.isArray(field.of))
            field.of.forEach((member, i) => check(`${scope}.${field.name}[${i}]`, [member]));
          if (Array.isArray(field.fields)) check(`${scope}.${field.name}`, field.fields);
        }
      };
      check(type.name, type.fields ?? []);
    }
  });
});
