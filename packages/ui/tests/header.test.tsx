import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockPathname } = vi.hoisted(() => ({ mockPathname: { value: "/" } }));
vi.mock("next/navigation", () => ({ usePathname: () => mockPathname.value }));

import { headerMode, Header, type NavLink } from "../src/header";
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

const logo = {
  src: "/logo.png",
  srcDark: "/logo-white.png",
  alt: "Dentaliva",
  width: 339,
  height: 112,
};

function renderHeader(overrides: Partial<Parameters<typeof Header>[0]> = {}) {
  return renderUi(
    <Header
      items={items}
      logo={logo}
      cta={{ label: "Randevu Al", href: "/randevu" }}
      contact={{ phone: "+90 212 555 54 82", email: "info@dentaliva.com" }}
      labels={{ toggleMenu: "Menüyü aç/kapat", closeMenu: "Menüyü kapat" }}
      {...overrides}
    />,
  );
}

const tick = async () => await new Promise((resolve) => setTimeout(resolve, 0));

describe("Header", () => {
  it("renders the contact bar, logo, nav links and CTA", () => {
    renderHeader();
    expect(screen.getByText("+90 212 555 54 82")).toHaveAttribute("href", "tel:+90 212 555 54 82");
    expect(screen.getByRole("img", { name: "Dentaliva" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "İletişim" })).toHaveAttribute("href", "/iletisim");
    expect(screen.getByRole("link", { name: "Randevu Al" })).toHaveAttribute("href", "/randevu");
  });

  it("uses the brand lockup as the home link (DSN-58)", () => {
    renderHeader();
    expect(screen.getByRole("link", { name: "Dentaliva" })).toHaveAttribute("href", "/");
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
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    const mobileNav = within(screen.getByRole("navigation", { name: "Mobile" }));
    expect(mobileNav.getByRole("link", { name: "Randevu Al" })).toHaveAttribute("href", "/randevu");
    await tick();
    expect(document.activeElement?.tagName).toBe("A");
    mobileNav.getByRole("link", { name: "Randevu Al" }).focus();
    await userEvent.tab();
    expect(container.ownerDocument.activeElement?.tagName).toBe("A");
  });

  it("closes the mobile menu via the burger toggle and restores focus to the burger", async () => {
    renderHeader();
    const burger = screen.getByRole("button", { name: "Menüyü aç/kapat" });
    await userEvent.click(burger);
    expect(screen.getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
    await userEvent.click(burger);
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
    await tick();
    expect(screen.getByRole("button", { name: "Menüyü aç/kapat" })).toHaveFocus();
  });

  it("closes the mobile menu when the primary CTA link is clicked", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    const mobileCta = within(screen.getByRole("navigation", { name: "Mobile" })).getByRole("link", {
      name: "Randevu Al",
    });
    expect(mobileCta).toHaveAttribute("href", "/randevu");
    await userEvent.click(mobileCta);
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("falls back to a close button in the mobile menu when no cta is given", async () => {
    renderHeader({ cta: undefined });
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    const close = screen.getByRole("button", { name: "Menüyü kapat" });
    await userEvent.click(close);
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("closes the mobile menu on Escape", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    await userEvent.keyboard("{Escape}");
    await tick();
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("wraps Shift+Tab from the first item to the last in the mobile menu", async () => {
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    await tick();
    expect(document.activeElement?.tagName).toBe("A");
    await userEvent.keyboard("{Shift>}{Tab}");
    expect(document.activeElement).toHaveTextContent("Randevu Al");
  });

  it("has no axe violations", async () => {
    await expectNoA11yViolations(
      <Header
        items={items}
        logo={logo}
        labels={{ toggleMenu: "Menüyü aç/kapat", closeMenu: "Menüyü kapat" }}
      />,
    );
  });
});

describe("DSN-10 header variants", () => {
  it("dark variant on home: espresso header, outlined CTA, phone link", () => {
    mockPathname.value = "/";
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header.className).toContain("fixed");
    expect(header.className).toContain("bg-transparent");
    expect(screen.getByRole("link", { name: "Randevu Al" })).toHaveAttribute("href", "/randevu");
    expect(screen.getByRole("link", { name: "+90 212 555 54 82" })).toHaveAttribute(
      "href",
      "tel:+90 212 555 54 82",
    );
  });

  it("light variant on inner routes: ivory header, blur, ink links", () => {
    mockPathname.value = "/hakkimizda";
    renderHeader();
    const header = screen.getByRole("banner");
    expect(header.className).toContain("bg-ivory");
    expect(header.className).toContain("backdrop-blur");
    expect(header.className).not.toContain("bg-navy");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav.textContent).toContain("İletişim");
  });

  it("logo follows the dark/light state (DSN-58): white over hero, colored when lit", () => {
    mockPathname.value = "/";
    const { unmount } = renderHeader();
    expect(screen.getByRole("img", { name: "Dentaliva" })).toHaveAttribute(
      "src",
      "/logo-white.png",
    );
    unmount();
    mockPathname.value = "/hakkimizda";
    renderHeader();
    expect(screen.getByRole("img", { name: "Dentaliva" })).toHaveAttribute("src", "/logo.png");
  });

  it("keeps the light logo when no dark variant is given", () => {
    mockPathname.value = "/";
    renderHeader({ logo: { ...logo, srcDark: undefined } });
    expect(screen.getByRole("img", { name: "Dentaliva" })).toHaveAttribute("src", "/logo.png");
  });

  it("light variant dropdown opens", async () => {
    mockPathname.value = "/hakkimizda";
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Hizmetlerimiz" }));
    expect(
      screen.getByRole("button", { name: "Hizmetlerimiz" }).getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("mobile menu shows the phone entry when contact is given", async () => {
    mockPathname.value = "/";
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    expect(screen.getAllByText("+90 212 555 54 82").length).toBeGreaterThan(0);
  });
});

describe("DSN-10 header variant branches", () => {
  it("dark variant dropdown opens with light styling", async () => {
    mockPathname.value = "/";
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Hizmetlerimiz" }));
    expect(
      screen.getByRole("button", { name: "Hizmetlerimiz" }).getAttribute("aria-expanded"),
    ).toBe("true");
    expect(screen.getByText("İmplant")).toBeInTheDocument();
  });

  it("light variant mobile menu uses ivory panel and hides dark phone", async () => {
    mockPathname.value = "/hakkimizda";
    renderHeader({ contact: undefined });
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    expect(screen.getByRole("navigation", { name: "Mobile" }).textContent).toContain("Hakkımızda");
  });
});

describe("headerMode (DSN-11)", () => {
  it("home at top is dark (transparent over hero)", () => {
    expect(headerMode("/", 0, 800)).toBe("dark");
  });

  it("home past the hero threshold turns light", () => {
    expect(headerMode("/", 720, 800)).toBe("light");
  });

  it("inner routes are always light", () => {
    expect(headerMode("/hakkimizda", 0, 800)).toBe("light");
    expect(headerMode("/hakkimizda", 5000, 800)).toBe("light");
  });

  it("keeps a minimum threshold on short viewports", () => {
    expect(headerMode("/", 115, 200)).toBe("dark");
    expect(headerMode("/", 125, 200)).toBe("light");
  });
});

describe("DSN-11 light mobile menu", () => {
  it("opens with ink styling and phone entry", async () => {
    mockPathname.value = "/hakkimizda";
    renderHeader();
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    const mobile = screen.getByRole("navigation", { name: "Mobile" });
    expect(mobile.textContent).toContain("İletişim");
    expect(screen.getAllByText("+90 212 555 54 82").length).toBeGreaterThan(0);
  });
});

describe("gruplu açılır menü (mega panel)", () => {
  const menuItems: NavLink[] = [
    { label: "Hakkımızda", href: "/hakkimizda" },
    {
      label: "Tedavilerimiz",
      href: "/hizmetlerimiz",
      menu: {
        groups: [
          {
            heading: "İmplant Tedavisi",
            headingHref: "/hizmetlerimiz/implant-tedavisi",
            links: [
              { label: "All On Four Implant", href: "/hizmetlerimiz/all-on-four" },
              { label: "All On Six Implant", href: "/hizmetlerimiz/all-on-six" },
            ],
          },
          {
            heading: "Diş Estetiği",
            links: [{ label: "Diş Beyazlatma", href: "/hizmetlerimiz/dis-beyazlatma" }],
          },
          {
            links: [{ label: "Ortodonti", href: "/hizmetlerimiz/ortodonti" }],
          },
        ],
        all: { label: "Tüm Tedavilerimiz", href: "/hizmetlerimiz" },
      },
    },
    { label: "İletişim", href: "/iletisim" },
  ];

  function renderMega() {
    return renderUi(
      <Header
        items={menuItems}
        logo={<span>Dentaliva</span>}
        labels={{ toggleMenu: "Menüyü aç/kapat", closeMenu: "Menüyü kapat" }}
      />,
    );
  }

  it("renders the treatments item as a disclosure trigger and opens the grouped panel", async () => {
    renderMega();
    const trigger = screen.getByRole("button", { name: "Tedavilerimiz" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", "dvn-mega-panel");
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "All On Four Implant" })).toHaveAttribute(
      "href",
      "/hizmetlerimiz/all-on-four",
    );
    // Başlığı linke çevrilen grup: headingHref panelde bağlantıdır.
    expect(screen.getByRole("link", { name: "İmplant Tedavisi" })).toHaveAttribute(
      "href",
      "/hizmetlerimiz/implant-tedavisi",
    );
    // Başlıksız grubun bağlantıları başlıksız sütunda kalır.
    expect(screen.getByRole("link", { name: "Ortodonti" })).toBeInTheDocument();
    expect(screen.queryByText("Diş Estetiği")).toBeInTheDocument();
  });

  it("toggles the panel closed from the trigger", async () => {
    renderMega();
    const trigger = screen.getByRole("button", { name: "Tedavilerimiz" });
    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Ortodonti" })).not.toBeInTheDocument();
  });

  it("closes the panel on Escape", async () => {
    renderMega();
    await userEvent.click(screen.getByRole("button", { name: "Tedavilerimiz" }));
    await userEvent.keyboard("{Escape}");
    await tick();
    expect(screen.queryByRole("link", { name: "Ortodonti" })).not.toBeInTheDocument();
  });

  it("closes the panel on outside pointerdown", async () => {
    renderMega();
    await userEvent.click(screen.getByRole("button", { name: "Tedavilerimiz" }));
    await userEvent.click(document.body);
    await tick();
    expect(screen.queryByRole("link", { name: "Ortodonti" })).not.toBeInTheDocument();
  });

  it("closes the panel when a group link is clicked", async () => {
    renderMega();
    await userEvent.click(screen.getByRole("button", { name: "Tedavilerimiz" }));
    await userEvent.click(screen.getByRole("link", { name: "Diş Beyazlatma" }));
    expect(screen.queryByRole("link", { name: "Diş Beyazlatma" })).not.toBeInTheDocument();
  });

  it("renders the all-treatments link and closes the panel when it is clicked", async () => {
    renderMega();
    await userEvent.click(screen.getByRole("button", { name: "Tedavilerimiz" }));
    const all = screen.getByRole("link", { name: "Tüm Tedavilerimiz" });
    expect(all).toHaveAttribute("href", "/hizmetlerimiz");
    await userEvent.click(all);
    expect(screen.queryByRole("link", { name: "Tüm Tedavilerimiz" })).not.toBeInTheDocument();
  });

  it("mobile menu expands the grouped item and closes on link click", async () => {
    renderMega();
    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    const disclosure = within(screen.getByRole("navigation", { name: "Mobile" })).getByRole(
      "button",
      { name: "Tedavilerimiz" },
    );
    expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(disclosure);
    expect(disclosure).toHaveAttribute("aria-expanded", "true");
    const mobile = within(screen.getByRole("navigation", { name: "Mobile" }));
    expect(mobile.getByRole("link", { name: "Tüm Tedavilerimiz" })).toHaveAttribute(
      "href",
      "/hizmetlerimiz",
    );
    expect(mobile.getByText("Diş Estetiği")).toBeInTheDocument();
    await userEvent.click(mobile.getByRole("link", { name: "All On Four Implant" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });

  it("has no axe violations with the grouped menu present", async () => {
    await expectNoA11yViolations(
      <Header
        items={menuItems}
        logo={<span>Dentaliva</span>}
        labels={{ toggleMenu: "Menüyü aç/kapat", closeMenu: "Menüyü kapat" }}
      />,
    );
  });
});

describe("gruplu menü varyant dalları", () => {
  const darkItems: NavLink[] = [
    {
      label: "Tedavilerimiz",
      href: "/hizmetlerimiz",
      menu: {
        groups: [
          {
            heading: "İmplant Tedavisi",
            headingHref: "/hizmetlerimiz/implant-tedavisi",
            links: [{ label: "All On Four Implant", href: "/hizmetlerimiz/all-on-four" }],
          },
          {
            heading: "Diş Estetiği",
            links: [{ label: "Diş Beyazlatma", href: "/hizmetlerimiz/dis-beyazlatma" }],
          },
          { links: [{ label: "Ortodonti", href: "/hizmetlerimiz/ortodonti" }] },
        ],
      },
    },
  ];

  function renderDarkMenu() {
    return renderUi(
      <Header
        items={darkItems}
        logo={<span>Dentaliva</span>}
        labels={{ toggleMenu: "Menüyü aç/kapat", closeMenu: "Menüyü kapat" }}
      />,
    );
  }

  it("dark home variant: ivory mega trigger, panel without the all row, dark mobile disclosure", async () => {
    mockPathname.value = "/";
    renderDarkMenu();
    const trigger = screen.getByRole("button", { name: "Tedavilerimiz" });
    expect(trigger.className).toContain("text-ivory/90");
    await userEvent.click(trigger);
    expect(screen.getByRole("link", { name: "All On Four Implant" })).toBeInTheDocument();
    // menu.all yok — "tümünü gör" satırı render edilmez.
    expect(screen.queryByRole("link", { name: "Tüm Tedavilerimiz" })).not.toBeInTheDocument();
    await userEvent.keyboard("{Escape}");

    await userEvent.click(screen.getByRole("button", { name: "Menüyü aç/kapat" }));
    const disclosure = within(screen.getByRole("navigation", { name: "Mobile" })).getByRole(
      "button",
      { name: "Tedavilerimiz" },
    );
    expect(disclosure.className).toContain("text-ivory");
    await userEvent.click(disclosure);
    const mobile = within(screen.getByRole("navigation", { name: "Mobile" }));
    // Başlığı linke çevrilen grup + düz başlık + başlıksız grup — koyu varyant.
    expect(mobile.getByRole("link", { name: "İmplant Tedavisi" })).toHaveAttribute(
      "href",
      "/hizmetlerimiz/implant-tedavisi",
    );
    expect(mobile.getByText("Diş Estetiği")).toBeInTheDocument();
    expect(mobile.getByRole("link", { name: "Ortodonti" })).toBeInTheDocument();
    // Menü kapanınca gruplar da düşer (kapsam: bağlantı tıklaması → onClose).
    await userEvent.click(mobile.getByRole("link", { name: "Ortodonti" }));
    expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument();
  });
});
