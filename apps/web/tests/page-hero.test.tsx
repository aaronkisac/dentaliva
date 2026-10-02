import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { PageHero } from "../components/page-hero";

const render = (props: Parameters<typeof PageHero>[0]) =>
  renderToStaticMarkup(<PageHero {...props} />);

describe("PageHero (DSN-25)", () => {
  it("renders eyebrow link, title, lead and media children", () => {
    const html = renderToStaticMarkup(
      <PageHero
        eyebrow="Hizmetlerimiz"
        eyebrowHref="/hizmetlerimiz"
        title="İmplant Tedavisi"
        lead="Eksik dişlerin tedavisi."
      >
        <div>medya</div>
      </PageHero>,
    );
    expect(html).toContain('href="/hizmetlerimiz"');
    expect(html).toContain("Hizmetlerimiz");
    expect(html).toContain("İmplant Tedavisi");
    expect(html).toContain("Eksik dişlerin tedavisi.");
    expect(html).toContain("medya");
  });

  it("renders the eyebrow without a link when no href is given", () => {
    const html = render({ eyebrow: "Dentaliva", title: "Blog" });
    expect(html).toContain("Dentaliva");
    expect(html).toContain("Blog");
    expect(html).not.toContain("<a ");
  });

  it("omits eyebrow, lead and children blocks when absent", () => {
    const html = render({ title: "Şubelerimiz" });
    expect(html).toContain("Şubelerimiz");
    expect(html).not.toContain("mt-6");
    expect(html).not.toContain("uppercase");
  });
});
