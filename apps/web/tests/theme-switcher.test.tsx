import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

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
}

const wrapper = () => document.querySelector<HTMLElement>("[data-theme-switcher]")!;
const tab = () => wrapper().querySelector<HTMLButtonElement>("button")!;
const select = () => document.querySelector<HTMLSelectElement>("#dvn-theme-select")!;
const dismiss = () =>
  document.querySelector<HTMLButtonElement>('button[aria-label="Renk paleti seçiciyi kapat"]')!;

afterEach(cleanup);

describe("ThemeSwitcher (DSN-57)", () => {
  it("renders only the collapsed edge tab while closed", () => {
    mount();
    expect(tab().getAttribute("aria-label")).toBe("Renk paleti seçiciyi aç");
    expect(tab().getAttribute("aria-expanded")).toBe("false");
    expect(document.querySelector("select")).toBeNull();
  });

  it("opens the panel with all palette options and closes via the tab", () => {
    mount();
    act(() => tab().click());
    expect(tab().getAttribute("aria-expanded")).toBe("true");
    const options = [...select().options].map((option) => [option.value, option.textContent]);
    expect(options).toEqual([
      ["espresso", "Espresso"],
      ["gece", "Gece Mavisi"],
      ["deniz", "Deniz Yeşili"],
      ["bordeaux", "Bordeaux"],
    ]);
    act(() => tab().click());
    expect(document.querySelector("select")).toBeNull();
  });

  it("applies the chosen palette to the document element and storage", () => {
    mount();
    act(() => tab().click());
    act(() => {
      select().value = "gece";
      select().dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(document.documentElement.dataset.palette).toBe("gece");
    expect(localStorage.getItem("dvn-palette")).toBe("gece");
    act(() => {
      select().value = "espresso";
      select().dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(document.documentElement.dataset.palette).toBeUndefined();
  });

  it("syncs the select from storage after mount (hydration order)", () => {
    localStorage.setItem("dvn-palette", "bordeaux");
    mount();
    act(() => tab().click());
    expect(select().value).toBe("bordeaux");
  });

  it("closes the panel on Escape and returns focus to the tab", () => {
    mount();
    act(() => tab().click());
    act(() => {
      wrapper().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(document.querySelector("select")).toBeNull();
    expect(document.activeElement).toBe(tab());
  });

  it("closes the panel when focus leaves the widget", () => {
    mount();
    act(() => tab().click());
    act(() => {
      wrapper().dispatchEvent(new FocusEvent("focusout", { bubbles: true, relatedTarget: null }));
    });
    expect(document.querySelector("select")).toBeNull();
  });

  it("keeps the panel open while focus stays inside", () => {
    mount();
    act(() => tab().click());
    act(() => {
      wrapper().dispatchEvent(
        new FocusEvent("focusout", { bubbles: true, relatedTarget: select() }),
      );
    });
    expect(select()).not.toBeNull();
  });

  it("dismisses the whole widget via the X button", () => {
    mount();
    act(() => tab().click());
    act(() => dismiss().click());
    expect(document.querySelector("[data-theme-switcher]")).toBeNull();
  });
});
