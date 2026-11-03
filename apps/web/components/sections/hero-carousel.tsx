"use client";

import { Children, useEffect, useState, type ReactNode } from "react";

import { uiString } from "../../src/ui-strings";

/**
 * DSN-89: hero banner dönüş kabuğu. Slide içerikleri SERVER'da render edilip
 * children olarak geçilir (DSN-52 perf dersi) — client JS yalnız aktif indeks
 * saatini tutar, LCP slide 0'da kalır. Crossfade: tüm slaytlar aynı grid
 * hücresine yığılır ([grid-area:1/1]) — konteyner yüksekliği en uzun
 * slayttan gelir, mobilde taşma yok. Ok/nokta yok (Aaron); hover/odakta
 * durur (WCAG 2.2.2, DSN-18 deseni), reduced-motion'da dönüş kapalı.
 */
export function HeroCarousel({
  intervalSeconds,
  children,
}: {
  /** CRM'den gelen geçiş süresi (saniye); aralık dışındaysa 5'e döner. */
  intervalSeconds?: number;
  children: ReactNode;
}) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seconds = intervalSeconds ?? 5;
    const ms = Math.max(3, Math.min(15, seconds)) * 1000;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % count), ms);
    return () => window.clearTimeout(timer);
  }, [active, paused, count, intervalSeconds]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={uiString("heroCarouselRegion")}
      className="grid"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          aria-hidden={index !== active}
          className={`[grid-area:1/1] transition-[opacity,visibility] duration-700 motion-reduce:transition-none ${
            index === active ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
          }`}
        >
          {slide}
        </div>
      ))}
    </div>
  );
}
