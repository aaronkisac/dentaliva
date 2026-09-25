import { render } from "@testing-library/react";
import { useRef, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { useFocusTrap } from "../src/use-focus-trap";

function Trap({
  active,
  children,
  attach = true,
  onEscape,
}: {
  active: boolean;
  children?: ReactNode;
  attach?: boolean;
  onEscape?: () => void;
}) {
  const attached = useRef<HTMLDivElement>(null);
  const detached = useRef<HTMLDivElement>(null);
  const hookRef = attach ? attached : detached;
  useFocusTrap(hookRef, active, onEscape);
  return (
    <div ref={attach ? attached : undefined} data-testid="trap">
      {children}
    </div>
  );
}

function EmptyTrap({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="trap">
      <span>not focusable</span>
    </div>
  );
}

function key(key: string, shift = false): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    shiftKey: shift,
    cancelable: true,
  });
  document.dispatchEvent(event);
  return event;
}

describe("useFocusTrap", () => {
  it("does nothing while inactive", () => {
    render(
      <Trap active={false}>
        <a href="/x">anchor</a>
      </Trap>,
    );
    expect(document.activeElement?.tagName).toBe("BODY");
  });

  it("tolerates an unattached ref", () => {
    render(
      <Trap active={true} attach={false}>
        <a href="/x">anchor</a>
      </Trap>,
    );
    expect(document.activeElement?.tagName).toBe("BODY");
  });

  it("focuses the first focusable when active", async () => {
    const { container } = render(
      <Trap active={true}>
        <a href="/x">anchor</a>
      </Trap>,
    );
    await new Promise((r) => setTimeout(r, 0));
    expect(document.activeElement).toBe(container.querySelector("a"));
  });

  it("ignores Tab when the container has no focusables", () => {
    render(<EmptyTrap active={true} />);
    const event = key("Tab");
    expect(event.defaultPrevented).toBe(false);
  });

  it("calls onEscape on Escape", () => {
    const onEscape = vi.fn();
    render(
      <Trap active={true} onEscape={onEscape}>
        <a href="/x">anchor</a>
      </Trap>,
    );
    key("Escape");
    expect(onEscape).toHaveBeenCalledOnce();
  });

  it("wraps Tab from the last focusable back to the first", () => {
    render(
      <Trap active={true}>
        <a href="/first" data-first="true">
          first
        </a>
        <a href="/last" data-last="true">
          last
        </a>
      </Trap>,
    );
    document.querySelector<HTMLAnchorElement>("[data-last]")?.focus();
    const event = key("Tab");
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toHaveAttribute("data-first", "true");
  });

  it("pulls focus back on Shift+Tab when focus escaped the container", () => {
    render(
      <Trap active={true}>
        <a href="/first" data-first="true">
          first
        </a>
        <a href="/last" data-last="true">
          last
        </a>
      </Trap>,
    );
    document.body.focus();
    const event = key("Tab", true);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toHaveAttribute("data-last", "true");
  });

  it("lets Tab proceed normally when focus is not at the last item", () => {
    render(
      <Trap active={true}>
        <a href="/first" data-first="true">
          first
        </a>
        <a href="/last" data-last="true">
          last
        </a>
      </Trap>,
    );
    document.querySelector<HTMLAnchorElement>("[data-first]")?.focus();
    const event = key("Tab");
    expect(event.defaultPrevented).toBe(false);
  });

  it("wraps Shift+Tab from the first focusable to the last", () => {
    render(
      <Trap active={true}>
        <a href="/first" data-first="true">
          first
        </a>
        <a href="/last" data-last="true">
          last
        </a>
      </Trap>,
    );
    document.querySelector<HTMLAnchorElement>("[data-first]")?.focus();
    const event = key("Tab", true);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toHaveAttribute("data-last", "true");
  });
});
