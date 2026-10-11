"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * DSN-52: yatay scroll-snap carousel iskeleti — kart içerikleri SERVER'da
 * render edilip children olarak geçilir (client JS yalnız kaydırma + nokta
 * mantığı; kart verisi hydrate edilmez). Hizmetler carousel'indeki indeks
 * tabanlı desenin genelleştirilmiş hali: indeks tabanlı scrollTo hedefi her
 * zaman bir kartın başına hizalanır, son indeks track sonuna sıkıştırılır;
 * noktalar tıklanabilir (aria-current) ve swipe ile senkron kalır.
 */
export function CarouselTrack({
  count,
  ariaLabelPrefix,
  children,
  className,
}: {
  count: number;
  /** Nokta aria etiketi öneki: "yorum" -> "3. yorum". */
  ariaLabelPrefix: string;
  children: React.ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  /** Senkron sayaç — hızlı tıklamalar React commit'inden hızlı akabilir. */
  const indexRef = useRef(0);
  /** Programatik scrollTo hedefi — animasyon ortasında scroll-sync'i kilitler. */
  const programmaticLeft = useRef<number | null>(null);

  const cardStep = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("a,article,div");
    if (!track || !card) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const applyIndex = (value: number) => {
    indexRef.current = value;
    setIndex(value);
  };

  const goTo = (target: number) => {
    const track = trackRef.current;
    if (!track) return;
    const step = cardStep();
    const clamped = Math.min(Math.max(target, 0), maxIndex);
    applyIndex(clamped);
    const left = Math.min(clamped * step, track.scrollWidth - track.clientWidth);
    programmaticLeft.current = left;
    track.scrollTo({ left, behavior: "smooth" });
  };

  /** Kullanıcı girişimi (swipe/trackpad) — programatik kilidi aç. */
  const markUserScroll = () => {
    programmaticLeft.current = null;
  };

  /** Swipe/scroll sonrası nokta durumunu gerçek konumdan senkronla. */
  const syncFromScroll = useCallback(() => {
    const track = trackRef.current;
    const step = cardStep();
    if (!track || step <= 0) return;
    if (programmaticLeft.current !== null) {
      if (Math.abs(track.scrollLeft - programmaticLeft.current) > step / 2) return;
      programmaticLeft.current = null;
    }
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    applyIndex(
      atEnd ? maxIndex : Math.min(maxIndex, Math.max(0, Math.round(track.scrollLeft / step))),
    );
  }, [maxIndex]);

  /** Görünür kart sayısından son geçerli indeksi hesapla (resize'da da). */
  const measure = useCallback(() => {
    const track = trackRef.current;
    const step = cardStep();
    if (!track || step <= 0) return;
    const visible = Math.max(1, Math.round(track.clientWidth / step));
    const last = Math.max(0, count - visible);
    setMaxIndex(last);
    applyIndex(Math.min(indexRef.current, last));
  }, [count]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <>
      <div
        ref={trackRef}
        onScroll={syncFromScroll}
        onPointerDown={markUserScroll}
        onWheel={markUserScroll}
        className={
          "-mx-[var(--dvn-container-gutter)] flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-[var(--dvn-container-gutter)] px-[var(--dvn-container-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
          (className ?? "")
        }
      >
        {children}
      </div>
      {count > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1}. ${ariaLabelPrefix}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(Math.min(i, maxIndex))}
              className="p-1.5"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i === index ? "bg-gold" : "bg-white/25 hover:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
}
