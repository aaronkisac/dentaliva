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

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Footer {...props} />);
  });

  it("has no axe violations with partial contact data", async () => {
    await expectNoA11yViolations(
      <Footer {...props} contact={{ phone: "", email: "", address: "", hours: "" }} />,
    );
  });
});
