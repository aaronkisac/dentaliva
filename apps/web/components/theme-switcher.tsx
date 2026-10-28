"use client";

import { useEffect, useRef, useState } from "react";

import { defaultPaletteId, paletteIds, paletteSwatches, type PaletteId } from "@dentaliva/tokens";

import { PALETTE_STORAGE_KEY, applyPalette, resolveStoredPalette } from "../src/theme";
import { uiString } from "../src/ui-strings";

// DSN-57b: sekmeden menüye gidişte panelin kaçmasını engelleyen götürme
// payı — hover alanından çıkıldıktan kısa süre sonra kapanır, dönüş iptal eder.
const HOVER_CLOSE_DELAY_MS = 300;

const ARROW_DELTAS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

const SWATCH_IDS: Record<PaletteId, string> = Object.fromEntries(
  paletteIds.map((id) => [id, `dvn-swatch-${id}`]),
) as Record<PaletteId, string>;

/**
 * DSN-57 — sol altta kenar sekmesi olarak duran, hover/dokunma/klavye ile
 * açılan renk paleti seçici. DSN-57b: select yerine isimsiz renk swatch'ları
 * (APG radiogroup — ok tuşları seçimi takip eder; erişilebilir adlar kalır).
 * Kapat (X) yalnızca widget'ı gizler: state React tarafında kalır, bu yüzden
 * client-side sayfa geçişlerinde gizli kalır ama tam yenilemede (refresh /
 * yeni sekme) yeniden görünür — depoya yazılmaz. Seçilen palet localStorage'da
 * yaşar ve layout'taki pre-paint script ile ilk boyamadan önce uygulanır.
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
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hidrasyon sonrası senkron — SSR markup'ı storage okumaz, mismatch olmaz.
  useEffect(() => {
    const stored = resolveStoredPalette(localStorage.getItem(PALETTE_STORAGE_KEY));
    if (stored) setSelected(stored);
  }, []);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const cancelClose = () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
    const enter = () => {
      cancelClose();
      setOpen(true);
    };
    const leave = () => {
      cancelClose();
      closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
    };
    const blur = (event: FocusEvent) => {
      if (!node.contains(event.relatedTarget as Node | null)) {
        cancelClose();
        setOpen(false);
      }
    };
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancelClose();
        setOpen(false);
        tabRef.current?.focus();
      }
    };
    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);
    node.addEventListener("focusout", blur);
    node.addEventListener("keydown", keydown);
    return () => {
      cancelClose();
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
      node.removeEventListener("focusout", blur);
      node.removeEventListener("keydown", keydown);
    };
  }, []);

  if (dismissed) return null;

  const choose = (id: PaletteId) => {
    setSelected(id);
    applyPalette(id);
  };

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
          className="absolute bottom-0 left-7 w-56 rounded-[4px] border border-[var(--dvn-line-gold)] bg-white p-4 shadow-lift"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink">
              {uiString("themeLabel")}
            </span>
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
          <div
            role="radiogroup"
            aria-label={uiString("themeLabel")}
            className="mt-2 grid grid-cols-5 gap-2"
          >
            {paletteIds.map((id) => {
              const name = uiString("paletteNames")[id];
              const swatchColors = paletteSwatches[id];
              return (
                <button
                  key={id}
                  id={SWATCH_IDS[id]}
                  type="button"
                  role="radio"
                  aria-checked={selected === id}
                  tabIndex={selected === id ? 0 : -1}
                  aria-label={name}
                  title={name}
                  onClick={() => choose(id)}
                  onKeyDown={(event) => {
                    if (
                      event.key !== "Home" &&
                      event.key !== "End" &&
                      !(event.key in ARROW_DELTAS)
                    ) {
                      return;
                    }
                    event.preventDefault();
                    const index = paletteIds.indexOf(id);
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? paletteIds.length - 1
                          : (index + ARROW_DELTAS[event.key]! + paletteIds.length) %
                            paletteIds.length;
                    choose(paletteIds[next]!);
                    document.getElementById(SWATCH_IDS[paletteIds[next]!])?.focus();
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${swatchColors.dark} 0% 50%, ${swatchColors.accent} 50% 100%)`,
                  }}
                  className={
                    "h-8 w-8 rounded-[4px] border border-[var(--dvn-line-gold)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" +
                    (selected === id ? " ring-2 ring-gold ring-offset-2 ring-offset-white" : "")
                  }
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
