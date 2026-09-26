import { describe, expect, it } from "vitest";

import {
  splitByLastmod,
  toBlogPostDoc,
  toRedirectDoc,
  type SitemapEntry,
} from "../src/blog-transform";

const entries: SitemapEntry[] = [
  {
    loc: "https://www.dentaliva.com/blog/en-iyi-ve-guvenilir-dis-dolgusu-cesitleri/",
    lastmod: "2026-09-04T18:02:42+00:00",
  },
  {
    loc: "https://www.dentaliva.com/blog/implant-yaptirmadan-once/",
    lastmod: "2026-03-15T10:00:00+00:00",
  },
  { loc: "https://www.dentaliva.com/blog/eski-yazi/", lastmod: "2025-07-30T09:00:00+00:00" },
];

const page = {
  url: "https://www.dentaliva.com/blog/en-iyi-ve-guvenilir-dis-dolgusu-cesitleri/",
  title: "En İyi ve Güvenilir Diş Dolgusu Çeşitleri | Dentaliva",
  h1: "En İyi ve Güvenilir Diş Dolgusu Çeşitleri",
  paragraphs: [
    "Diş dolgusu çeşitleri birden fazladır ve malzemeye göre ayrılır.",
    "Kompozit dolgular beyaz dolgu olarak bilinir.",
    "Seramik dolgular porselen olarak anılır.",
  ],
};

describe("splitByLastmod", () => {
  it("separates substantial posts from the bulk stub batch", () => {
    const { substantial, stubs } = splitByLastmod(entries);
    expect(substantial).toHaveLength(2);
    expect(stubs).toHaveLength(1);
    expect(stubs[0]?.loc).toContain("eski-yazi");
  });
});

describe("toBlogPostDoc", () => {
  it("builds a blogPost doc with localized title and portable body", () => {
    const doc = toBlogPostDoc(page, "2026-09-04T00:00:00Z");
    expect(doc._id).toBe("blogPost.en-iyi-ve-guvenilir-dis-dolgusu-cesitleri");
    expect(doc.title).toEqual({ tr: "En İyi ve Güvenilir Diş Dolgusu Çeşitleri" });
    expect(doc.body.tr).toHaveLength(2); // first paragraph became the excerpt
    expect(doc.body.tr?.[0]).toMatchObject({ _type: "block", style: "normal" });
  });
});

describe("toRedirectDoc", () => {
  it("builds a permanent redirect to home", () => {
    const doc = toRedirectDoc("eski-yazi");
    expect(doc).toMatchObject({
      _id: "redirect.blog-eski-yazi",
      from: { _type: "slug", current: "/blog/eski-yazi" },
      to: "/",
      permanent: true,
    });
  });
});
