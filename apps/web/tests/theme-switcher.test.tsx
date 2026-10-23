import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ThemeSwitcher } from "../components/theme-switcher";

// RTL'siz etkileşim testi (repo deseni): createRoot + act + native event'ler.
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
let container: HTMLElement | null = null;

function mount(): HTMLElement {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(<ThemeSwitcher />));
  return container;
}

function cleanup(): void {
  if (root) act(() => root!.unmount());
  container?.remove();
  root = null;
  container = null;
  delete document.documentElement.dataset.palette;
  localStorage.clear();
  vi.useRealTimers();
}

const wrapper = () => document.querySelector<HTMLElement>("[data-theme-switcher]")!;
const tab = () => wrapper().querySelector<HTMLButtonElement>("button")!;
const swatches = () => [...wrapper().querySelectorAll<HTMLButtonElement>('[role="radio"]')];
const swatch = (id: string) => document.getElementById(`dvn-swatch-${id}`) as HTMLButtonElement;
const dismiss = () =>
  document.querySelector<HTMLButtonElement>('button[aria-label="Renk paleti seçiciyi kapat"]')!;

afterEach(cleanup);

describe("ThemeSwitcher swatch menu (DSN-57b)", () => {
  it("renders ten color swatches with localized names, espresso checked", () => {
    mount();
    act(() => tab().click());
    expect(swatches()).toHaveLength(10);
    const names = swatches().map((button) => button.getAttribute("aria-label"));
    expect(names[0]).toBe("Espresso");
    expect(names.at(-1)).toBe("Orman");
    // Görsel isimsiz: ad yalnızca erişilebilir ad + tooltip
    expect(swatches()[1]!.textContent).toBe("");
    expect(swatches()[1]!.getAttribute("title")).toBe("Gece Mavisi");
    expect(swatches().filter((b) => b.getAttribute("aria-checked") === "true")).toEqual([
      swatch("espresso"),
    ]);
    // Roving tabindex: yalnızca seçili çip sekme sırasında
    expect(swatch("espresso").getAttribute("tabindex")).toBe("0");
    expect(swatch("gece").getAttribute("tabindex")).toBe("-1");
  });

  it("applies the clicked palette and moves the checked state", () => {
    mount();
    act(() => tab().click());
    act(() => swatch("bordeaux").click());
    expect(document.documentElement.dataset.palette).toBe("bordeaux");
    expect(localStorage.getItem("dvn-palette")).toBe("bordeaux");
    expect(swatch("bordeaux").getAttribute("aria-checked")).toBe("true");
    expect(swatch("espresso").getAttribute("aria-checked")).toBe("false");
  });

  it("checks the stored palette after mount (hydration order)", () => {
    localStorage.setItem("dvn-palette", "deniz");
    mount();
    act(() => tab().click());
    expect(swatch("deniz").getAttribute("aria-checked")).toBe("true");
  });

  it("selects the next palette with ArrowRight and focuses it (APG radio)", () => {
    mount();
    act(() => tab().click());
    act(() => {
      swatch("espresso").dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
    });
    expect(document.documentElement.dataset.palette).toBe("gece");
    expect(document.activeElement).toBe(swatch("gece"));
    act(() => {
      swatch("gece").dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    });
    expect(document.documentElement.dataset.palette).toBe("orman");
    act(() => {
      swatch("orman").dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    });
    // Varsayılan palet attribute'suzdur — seçim onu kaldırır.
    expect(document.documentElement.dataset.palette).toBeUndefined();
  });

  it("keeps the panel open while hovered; closes after the grace delay", () => {
    vi.useFakeTimers();
    mount();
    act(() => tab().click());
    act(() => {
      wrapper().dispatchEvent(new Event("mouseleave"));
    });
    expect(document.querySelector('[role="radiogroup"]')).not.toBeNull();
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(document.querySelector('[role="radiogroup"]')).toBeNull();
    expect(tab()).not.toBeNull();
  });

  it("cancels the close when the pointer returns within the grace window", () => {
    vi.useFakeTimers();
    mount();
    act(() => tab().click());
    act(() => {
      wrapper().dispatchEvent(new Event("mouseleave"));
      vi.advanceTimersByTime(200);
      wrapper().dispatchEvent(new Event("mouseenter"));
      vi.advanceTimersByTime(400);
    });
    expect(document.querySelector('[role="radiogroup"]')).not.toBeNull();
  });

  it("closes the panel on Escape and returns focus to the tab", () => {
    mount();
    act(() => tab().click());
    act(() => {
      wrapper().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.querySelector('[role="radiogroup"]')).toBeNull();
    expect(document.activeElement).toBe(tab());
  });

  it("closes the panel when focus leaves the widget", () => {
    mount();
    act(() => tab().click());
    act(() => {
      wrapper().dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: null }));
    });
    expect(document.querySelector('[role="radiogroup"]')).toBeNull();
  });

  it("dismisses the whole widget via the X button", () => {
    mount();
    act(() => tab().click());
    act(() => dismiss().click());
    expect(document.querySelector("[data-theme-switcher]")).toBeNull();
  });
});
