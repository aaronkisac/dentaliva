import { describe, expect, it } from "vitest";

import { treatment } from "../src/documents/treatment";

/**
 * DSN-86 — Tedavi içerik standardının Studio yüzeyi: bölüm önizlemesi hangi
 * sayfa kompozisyonunu alacağını yazmalı (editör standartı kodu okumadan
 * görür) ve belge önizlemesi bölüm sayısını taşımmalı.
 */
type PreviewLike = { select: Record<string, string>; prepare?: (v?: unknown) => unknown };

const sectionsField = treatment.fields.find((f) => f.name === "sections") as {
  of: Array<{ preview?: PreviewLike }>;
};
const sectionPreview = (sectionsField.of[0]?.preview ?? {}) as PreviewLike & {
  prepare: (v?: unknown) => unknown;
};
const docPreview = treatment.preview as PreviewLike & { prepare: (v?: unknown) => unknown };

const sectionPrepare = (items: number, media?: unknown) =>
  sectionPreview.prepare({
    title: "Nasıl Yapılır?",
    items: Array.from({ length: items }),
    media,
  }) as {
    title: string;
    subtitle: string;
  };

describe("treatment content standard (DSN-86)", () => {
  it("labels each item count with its page composition", () => {
    expect(sectionPrepare(4).subtitle).toContain("kadran");
    expect(sectionPrepare(6).subtitle).toContain("mozaik");
    expect(sectionPrepare(2).subtitle).toContain("lacivert bant");
    expect(sectionPrepare(1).subtitle).toContain("kapanış bandı");
    expect(sectionPrepare(0).subtitle).toContain("okuma kolonu");
  });

  it("flags photoless sections and untitled drafts", () => {
    expect(sectionPrepare(2).subtitle).toContain("foto yok");
    expect(sectionPrepare(2, { asset: {} }).subtitle).not.toContain("foto yok");
    const unnamed = sectionPreview.prepare({ items: [] }) as { title: string };
    expect(unnamed.title).toContain("başlıksız");
  });

  it("shows section count on the document preview", () => {
    const withSections = docPreview.prepare({
      title: "Periodontoloji",
      subtitle: "periodontoloji",
      sections: [1, 2, 3],
    }) as { subtitle: string };
    expect(withSections.subtitle).toContain("3 bölüm");

    const empty = docPreview.prepare({ title: "X", subtitle: "x", sections: [] }) as {
      subtitle: string;
    };
    expect(empty.subtitle).toContain("içerik bölümleri yok");
  });

  it("keeps the standard guardrails in schema", () => {
    const heading = (
      sectionsField.of[0] as { fields: Array<{ name: string; validation?: unknown }> }
    ).fields.find((f) => f.name === "heading");
    expect(heading?.validation).toBeTypeOf("function");
    const sections = treatment.fields.find((f) => f.name === "sections") as {
      validation?: unknown;
    };
    expect(sections.validation).toBeTypeOf("function");
  });
});
