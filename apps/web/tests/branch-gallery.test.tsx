import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string; className?: string }) {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

import { BranchGallery } from "../components/branch-gallery";

const photo = (n: number) => ({
  ref: `image-${String(n).padStart(40, "5")}-1080x1350-jpg`,
  alt: { tr: `Şube foto ${n}` },
  lqip: undefined,
});

const render = (photos: Parameters<typeof BranchGallery>[0]["photos"]) =>
  renderToStaticMarkup(
    <BranchGallery name="Altunizade" photos={photos} closeLabel="Kapat" />,
  );

describe("BranchGallery (DSN-72)", () => {
  it("renders a single 4/3 tile for one photo", () => {
    const html = render([photo(1)]);
    expect(html).toContain("aspect-[4/3]");
    expect(html).not.toContain("col-span-2 aspect-[16/10]");
    expect(html).toContain("<dialog");
  });

  it("renders the mosaic for three photos: wide first, two squares", () => {
    const html = render([photo(1), photo(2), photo(3)]);
    expect(html.match(/col-span-2 aspect-\[16\/10\]/g)?.length).toBe(1);
    expect(html.match(/aspect-square/g)?.length).toBe(2);
  });

  it("drops ref-less entries and renders nothing without photos", () => {
    expect(render([{ alt: { tr: "bozuk" } }])).toBe("");
    expect(render([{ ref: "image-a-800x600-jpg" }, {}]).match(/image-a-800x600-jpg/g)?.length)
      .toBeGreaterThan(0);
  });

  it("carries the branch name as the dialog label and alt fallback", () => {
    const html = render([photo(1)]);
    expect(html).toContain('aria-label="Altunizade"');
    expect(html).toContain("Şube foto 1");
  });
});
