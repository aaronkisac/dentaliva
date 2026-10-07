import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// next/image özel loader'ı vitest ortamında yok — lightbox testindeki sızdırmaz
// ikame deseni.
vi.mock("next/image", () => ({
  default: function MockImage(props: { src?: string; alt?: string; className?: string }) {
    return <img src={props.src} alt={props.alt} className={props.className} />;
  },
}));

import { DoctorPortrait, monogramInitials } from "../components/doctor-portrait";

describe("monogramInitials (DSN-43)", () => {
  it("strips title prefixes and takes the first two initials with Turkish casing", () => {
    expect(monogramInitials("Dr. Dt. Emel Özdemir")).toBe("EÖ");
    expect(monogramInitials("Dt. Şehmus Saygın")).toBe("ŞS");
    expect(monogramInitials("Dr.Dt. M.Cihan Babuccu")).toBe("MB");
    expect(monogramInitials("Dr. Melis Bal")).toBe("MB");
  });

  it("falls back to the brand initial when no name survives", () => {
    expect(monogramInitials(undefined)).toBe("D");
    expect(monogramInitials("Dt.")).toBe("D");
  });
});

describe("DoctorPortrait (DSN-43)", () => {
  it("renders the photo through next/image when a ref exists", () => {
    const html = renderToStaticMarkup(
      <DoctorPortrait
        name="Dt. Şehmus Saygın"
        photo={{ ref: "image-abc-600x400-jpg", lqip: undefined }}
        alt="Dt. Şehmus Saygın"
        imageClassName="h-48 w-full"
      />,
    );
    expect(html).toContain('src="image-abc-600x400-jpg"');
    expect(html).toContain('alt="Dt. Şehmus Saygın"');
    expect(html).not.toContain("bg-navy");
  });

  it("renders the branded monogram tile when no photo exists", () => {
    const html = renderToStaticMarkup(
      <DoctorPortrait name="Dt. Şehmus Saygın" frameClassName="aspect-[20/21] w-full" />,
    );
    expect(html).toContain("bg-navy");
    expect(html).toContain("ŞS");
    expect(html).toContain("aspect-[20/21]");
  });

  it("keeps the frame classes on both branches", () => {
    const photo = renderToStaticMarkup(
      <DoctorPortrait
        name="Dr. Melis Bal"
        photo={{ ref: "image-x-800x600-jpg" }}
        frameClassName="h-48 w-full"
      />,
    );
    const mono = renderToStaticMarkup(
      <DoctorPortrait name="Dr. Melis Bal" frameClassName="h-48 w-full" />,
    );
    expect(photo).toContain("h-48");
    expect(mono).toContain("h-48");
  });
});
