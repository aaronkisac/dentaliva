"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps Tab focus inside `ref.current` while `active`, restores focus to the
 * previously focused element on close, and calls `onEscape` for Esc.
 * Returns nothing; attach the ref to the container that should trap.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape?: () => void,
): void {
  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape?.();
        return;
      }
      if (event.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      // The length guard above makes both bounds defined — no optional chaining.
      const first = list[0] as HTMLElement;
      const last = list[list.length - 1] as HTMLElement;
      const current = document.activeElement;
      if (event.shiftKey) {
        const inside = container.contains(current);
        if (current === first || !inside) {
          event.preventDefault();
          last.focus();
        }
        return;
      }
      if (current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [ref, active, onEscape]);
}
