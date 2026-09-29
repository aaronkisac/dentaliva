import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Reveal } from "../src/reveal";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

class FakeObserver implements IntersectionObserver {
  static instances: FakeObserver[] = [];
  callback: ObserverCallback;
  element: Element | undefined;
  disconnected = false;
  constructor(callback: ObserverCallback) {
    this.callback = callback;
    FakeObserver.instances.push(this);
  }
  observe(element: Element) {
    this.element = element;
  }
  disconnect() {
    this.disconnected = true;
  }
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}

const matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: query.includes("reduce") ? matchMediaReduce : !matchMediaReduce,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

let matchMediaReduce = false;

Object.defineProperty(window, "matchMedia", { writable: true, value: matchMedia });
Object.defineProperty(window, "IntersectionObserver", { writable: true, value: FakeObserver });
globalThis.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver;

afterEach(() => {
  cleanup();
  FakeObserver.instances = [];
  matchMediaReduce = false;
});

describe("Reveal", () => {
  it("starts hidden with opacity-0 and observes the element", () => {
    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    expect(screen.getByText("content").parentElement).toHaveClass("opacity-0");
    expect(FakeObserver.instances).toHaveLength(1);
  });

  it("reveals when the observer reports intersection, then disconnects", async () => {
    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    const observer = FakeObserver.instances[0];
    observer?.callback([{ isIntersecting: true }]);
    await waitFor(() =>
      expect(screen.getByText("content").parentElement).toHaveClass("opacity-100"),
    );
    expect(observer?.disconnected).toBe(true);
  });

  it("stays hidden while the element is off screen", () => {
    render(
      <Reveal>
        <p>content</p>
      </Reveal>,
    );
    FakeObserver.instances[0]?.callback([{ isIntersecting: false }]);
    expect(screen.getByText("content").parentElement).toHaveClass("opacity-0");
  });

  it("shows content immediately under prefers-reduced-motion", () => {
    matchMediaReduce = true;
    render(
      <Reveal>
        <p>calm content</p>
      </Reveal>,
    );
    expect(screen.getByText("calm content").parentElement).toHaveClass("opacity-100");
    expect(FakeObserver.instances).toHaveLength(0);
  });

  it("applies the stagger delay as transition-delay", () => {
    render(
      <Reveal delay={120}>
        <p>later</p>
      </Reveal>,
    );
    expect(screen.getByText("later").parentElement).toHaveStyle({ transitionDelay: "120ms" });
  });
});

describe("Reveal effect variants (DSN-15)", () => {
  it("scale effect starts hidden with scale-92", () => {
    render(
      <Reveal effect="scale">
        <p>content</p>
      </Reveal>,
    );
    expect(screen.getByText("content").parentElement).toHaveClass("scale-[0.92]");
  });

  it("scale effect reveals to scale-100 when visible", async () => {
    render(
      <Reveal effect="scale">
        <p>content</p>
      </Reveal>,
    );
    FakeObserver.instances[0]?.callback([{ isIntersecting: true }]);
    await waitFor(() => expect(screen.getByText("content").parentElement).toHaveClass("scale-100"));
  });
});
