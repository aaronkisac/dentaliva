import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { Link } from "../src/link";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

describe("Link", () => {
  it("renders internal routes as plain anchors with the route href", () => {
    renderUi(<Link href="/hizmetler">Treatments</Link>);
    const a = screen.getByRole("link", { name: "Treatments" });
    expect(a).toHaveAttribute("href", "/hizmetler");
    expect(a).not.toHaveAttribute("target");
  });

  it("renders object hrefs internally as well", () => {
    renderUi(<Link href={{ pathname: "/iletisim" }}>Contact</Link>);
    expect(screen.getByRole("link", { name: "Contact" })).not.toHaveAttribute("target");
  });

  it("opens external links in a new tab with noopener", () => {
    renderUi(<Link href="https://wa.me/905308405482">WhatsApp</Link>);
    const a = screen.getByRole("link", { name: "WhatsApp" });
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lets callers override target and rel on external links", () => {
    renderUi(
      <Link href="https://dentaliva.com" target="_self" rel="external">
        Site
      </Link>,
    );
    const a = screen.getByRole("link", { name: "Site" });
    expect(a).toHaveAttribute("target", "_self");
    expect(a).toHaveAttribute("rel", "external");
  });

  it("forwards refs and keeps the focus ring class", () => {
    const ref = createRef<HTMLAnchorElement>();
    renderUi(
      <Link href="/" ref={ref}>
        Home
      </Link>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toHaveClass("focus-visible:outline-gold");
  });

  it("has no axe violations for internal and external links", async () => {
    await expectNoA11yViolations(
      <>
        <Link href="/about">About</Link>
        <Link href="https://example.com">Example</Link>
      </>,
    );
  });
});
