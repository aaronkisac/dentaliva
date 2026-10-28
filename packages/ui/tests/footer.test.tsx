import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Footer } from "../src/footer";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

const props = {
  columns: [{ title: "Hizmetler", links: [{ label: "İmplant", href: "/implant-tedavisi" }] }],
  contact: {
    phone: "+90 212 555 54 82",
    email: "info@dentaliva.com",
    address: "Avcılar, İstanbul",
    hours: "Her gün 09:00 – 23:00",
  },
  social: [{ label: "Instagram", href: "https://instagram.com/dentaliva" }],
  copyright: "© Copyright Dentaliva 2026",
};

describe("Footer", () => {
  it("renders contact details, columns, socials and copyright", () => {
    renderUi(<Footer {...props} />);
    expect(screen.getByRole("link", { name: props.contact.phone })).toHaveAttribute(
      "href",
      `tel:${props.contact.phone}`,
    );
    expect(screen.getByRole("link", { name: "İmplant" })).toHaveAttribute(
      "href",
      "/implant-tedavisi",
    );
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
      "href",
      props.social[0]?.href,
    );
    expect(screen.getByText(props.copyright)).toBeInTheDocument();
    expect(screen.getByText(props.contact.hours)).toBeInTheDocument();
  });

  it("renders as a contentinfo landmark and forwards refs", () => {
    const ref = createRef<HTMLElement>();
    renderUi(<Footer ref={ref} {...props} />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("renders the legal links row only when provided (DSN-78)", () => {
    renderUi(<Footer {...props} legalLinks={[{ label: "Gizlilik Bildirimi", href: "/kvkk" }]} />);
    expect(screen.getByRole("link", { name: "Gizlilik Bildirimi" })).toHaveAttribute(
      "href",
      "/kvkk",
    );
  });

  it("omits nameless anchors when contact values are empty", () => {
    renderUi(
      <Footer
        {...props}
        contact={{ phone: "", email: "info@dentaliva.com", address: "", hours: "" }}
      />,
    );
    expect(screen.queryByRole("link", { name: /tel:/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "info@dentaliva.com" })).toHaveAttribute(
      "href",
      "mailto:info@dentaliva.com",
    );
    expect(screen.queryByText("Her gün 09:00 – 23:00")).not.toBeInTheDocument();
  });

  it("flattens nav columns into a single deduplicated link list (DSN-34)", () => {
    renderUi(
      <Footer
        {...props}
        columns={[
          { title: "A", links: [{ label: "Şubeler", href: "/subelerimiz" }] },
          {
            title: "B",
            links: [
              { label: "Şubeler tekrar", href: "/subelerimiz" },
              { label: "Blog", href: "/blog" },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Şubeler" })).toHaveAttribute("href", "/subelerimiz");
    expect(screen.queryByRole("link", { name: "Şubeler tekrar" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  it("renders platform icons for known socials and falls back to plain text (DSN-34)", () => {
    renderUi(
      <Footer
        {...props}
        social={[
          { label: "Instagram", href: "https://instagram.com/dentaliva" },
          { label: "Facebook", href: "https://facebook.com/dentaliva" },
          { label: "YouTube", href: "https://youtube.com/@dentaliva" },
          { label: "TikTok", href: "https://tiktok.com/@dentaliva" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Instagram" }).querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Facebook" }).querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("link", { name: "YouTube" }).querySelector("svg")).not.toBeNull();
    expect(screen.getByRole("link", { name: "TikTok" }).querySelector("svg")).toBeNull();
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Footer {...props} />);
  });

  it("has no axe violations with partial contact data", async () => {
    await expectNoA11yViolations(
      <Footer {...props} contact={{ phone: "", email: "", address: "", hours: "" }} />,
    );
  });
});

describe("footer labels (DSN-44)", () => {
  it("renders column headings from labels when provided", () => {
    renderUi(
      <Footer
        {...props}
        labels={{ contact: "İletişim", quickLinks: "Hızlı Erişim", follow: "Bizi takip edin" }}
      />,
    );
    expect(screen.getByRole("heading", { name: "İletişim" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hızlı Erişim" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Bizi takip edin" })).toBeInTheDocument();
  });

  it("renders no h2 headings and keeps columns when labels are absent", () => {
    renderUi(<Footer {...props} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "İmplant" })).toBeInTheDocument();
  });
});
