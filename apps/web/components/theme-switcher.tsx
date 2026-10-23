"use client";

import { useEffect, useRef, useState } from "react";

import { defaultPaletteId, paletteIds, type PaletteId } from "@dentaliva/tokens";

import { PALETTE_STORAGE_KEY, applyPalette, resolveStoredPalette } from "../src/theme";
import { uiString } from "../src/ui-strings";

/**
 * DSN-57 — sol altta kenar sekmesi olarak duran, hover/dokunma/klavye ile
 * açılan renk paleti seçici. Kapat (X) yalnızca widget'ı gizler: state React
 * tarafında kalır, bu yüzden client-side sayfa geçişlerinde gizli kalır ama
 * tam yenilemede (refresh / yeni sekme) yeniden görünür — depoya yazılmaz.
 * Seçilen palet ise localStorage'da yaşar ve layout'taki pre-paint script
 * ile ilk boyamadan önce uygulanır.
 *
 * Hover/Escape/blur davranışı JSX handler yerine ref listener'larıyla bağlı:
 * sarmalayıcı statik bir group — jsx-a11y kuralları etkileşimli olmayan
 * konteynerlerdeki handler'ları reddediyor (ui/header'ın document keydown
 * deseniyle aynı yaklaşım).
 */
export function ThemeSwitcher() {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PaletteId>(defaultPaletteId);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);

  // Hidrasyon sonrası senkron — SSR markup'ı storage okumaz, mismatch olmaz.
  useEffect(() => {
    const stored = resolveStoredPalette(localStorage.getItem(PALETTE_STORAGE_KEY));
    if (stored) setSelected(stored);
  }, []);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const enter = () => setOpen(true);
    const leave = () => setOpen(false);
    const blur = (event: FocusEvent) => {
      if (!node.contains(event.relatedTarget as Node | null)) setOpen(false);
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        tabRef.current?.focus();
      }
    };
    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);
    node.addEventListener("focusout", blur);
    node.addEventListener("keydown", keydown);
    return () => {
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
      node.removeEventListener("focusout", blur);
      node.removeEventListener("keydown", keydown);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      ref={wrapperRef}
      data-theme-switcher=""
      role="group"
      className="fixed bottom-6 left-0 z-[var(--dvn-z-overlay)] flex items-end"
    >
      <button
        ref={tabRef}
        type="button"
        // Mouse'da hover paneli zaten açmıştır — click yeniden kapatabilir;
        // toggle yalnızca klavye (pointerType yok) ve dokunma içindir.
        onClick={(event) => {
          const pointer =
            event.nativeEvent instanceof PointerEvent ? event.nativeEvent.pointerType : null;
          setOpen((value) => (pointer === "mouse" ? true : !value));
        }}
        aria-expanded={open}
        aria-controls="dvn-theme-panel"
        aria-label={uiString("themeOpenAria")}
        className="flex h-11 w-7 items-center justify-center rounded-r-[4px] border border-l-0 border-[var(--dvn-line-gold)] bg-white text-navy shadow-soft transition-shadow hover:shadow-gold focus-visible:outline-2 focus-visible:outline-gold"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M12 3a9 9 0 1 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h6.5A2.5 2.5 0 0 0 21 9.5 9 9 0 0 0 12 3Z" />
          <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      </button>
      {open ? (
        <div
          id="dvn-theme-panel"
          role="group"
          aria-label={uiString("themeLabel")}
          className="absolute bottom-0 left-9 w-64 rounded-[4px] border border-[var(--dvn-line-gold)] bg-white p-4 shadow-lift"
        >
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="dvn-theme-select"
              className="text-xs font-semibold uppercase tracking-widest text-ink"
            >
              {uiString("themeLabel")}
            </label>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label={uiString("themeClose")}
              className="flex h-11 w-11 items-center justify-center text-muted hover:text-navy focus-visible:outline-2 focus-visible:outline-gold"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <select
            id="dvn-theme-select"
            value={selected}
            onChange={(event) => {
              const id = event.target.value as PaletteId;
              setSelected(id);
              applyPalette(id);
            }}
            className="mt-3 h-11 w-full rounded-[4px] border border-[var(--dvn-line-gold)] bg-white px-3 font-sans text-sm text-ink focus-visible:outline-2 focus-visible:outline-gold"
          >
            {paletteIds.map((id) => (
              <option key={id} value={id}>
                {uiString("paletteNames")[id]}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}
