import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Header, type NavLink } from "../src/header";
import { expectNoA11yViolations, renderUi, screen } from "./helpers";

const items: NavLink[] = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  {
    label: "Hizmetlerimiz",
    href: "/hizmetlerimiz",
    children: [
      { label: "İmplant", href: "/implant-tedavisi" },
      { label: "Ortodonti", href: "/ortodonti" },
    ],
  },
  { label: "İletişim", href: "/iletisim" },
];

function renderHeader(overrides: Partial<Parameters<typeof Header>[0]> = {}) {
  return renderUi(
    <Header
      items={items}
      logo={<span>Dentaliva</span>}
      cta={{ label: "Randevu Al", href: "/randevu" }}
      contact={{ phone: "+90 212 555 54 82", email: "info@dentaliva.com" }}
      {...overrides}
    />,
  );
}

const tick = async () => await new Promise((resolve) => setTimeout(resolve, 0));

describe("Header", () => {
  it("renders the contact bar, logo, nav links and CTA", () => {
    renderHeader();
    expect(screen.getByText("+90 212 555 54 82")).toHaveAttribute("href", "tel:+90 212 555 54 82");
    expect(screen.getByText("Dentaliva")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "İletişim" })).toHaveAttribute("href", "/iletisim");
    expect(screen.getByRole("link", { name: "Randevu Al" })).toHaveAttribute("href", "/randevu");
  });

  it("omits the contact bar when no contact is given", () => {
    renderHeader({ contact: undefined });
    expect(screen.queryByText("+90 212 555 54 82")).not.toBeInTheDocument();
  });

  it("closes the dropdown on outside pointerdown", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Hizmetlerimiz" }));
    await userEvent.click(document.body);
    await tick();
    expect(screen.queryByRole("link", { name: "İmplant" })).not.toBeInTheDocument();
  });

  it("opens the dropdown and closes it on item click", async () => {
    renderHeader();
    const trigger = screen.getByRole("button", { name: "Hizmetlerimiz" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("link", { name: "İmplant" }));
    expect(screen.queryByRole("link", { name: "İmplant" })).not.toBeInTheDocument();
  });

  it("ignores unrelated keys while the dropdown is open", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Hizmetlerimiz" }));
    await userEvent.keyboard("a");
    expect(screen.getByRole("link", { name: "İmplant" })).toBeInTheDocument();
  });

  it("closes the dropdown on Escape", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Hizmetlerimiz" }));
    await userEvent.keyboard("{Escape}");
    await tick();
    expect(screen.queryByRole("link", { name: "İmplant" })).not.toBeInTheDocument();
  });

  it("opens the mobile menu, focuses inside it, and wraps Tab", async () => {
    const { container } = renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    await tick();
    expect(document.activeElement?.tagName).toBe("A");
    const close = screen.getByRole("button", { name: "Close menu" });
    close.focus();
    await userEvent.tab();
    expect(container.ownerDocument.activeElement?.tagName).toBe("A");
  });

  it("closes the mobile menu from its close button and restores focus to the burger", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    await tick();
    expect(screen.getByRole("button", { name: "Toggle menu" })).toHaveFocus();
  });

  it("closes the mobile menu on Escape", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    await userEvent.keyboard("{Escape}");
    await tick();
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("wraps Shift+Tab from the first item to the last in the mobile menu", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Toggle menu" }));
    await tick();
    expect(document.activeElement?.tagName).toBe("A");
    await userEvent.keyboard("{Shift>}{Tab}");
    expect(document.activeElement).toHaveTextContent("Close menu");
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(<Header items={items} logo={<span>Dentaliva</span>} />);
  });
});
