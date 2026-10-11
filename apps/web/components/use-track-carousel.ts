"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * DSN-54: yatay scroll-snap carousel'lerin ortak durumu — hizmetler
 * carousel'indeki indeks tabanlı desenin genelleştirilmişi. Oklar
 * "sağ üstte", noktalar "altta" kuralı bu hook'un döndürdüğü
 * index/goTo/maxIndex ile kurulur; syncFromScroll swipe ile senkron tutar.
 * cardStep ilk çocuğun genişliği + columnGap; measure resize'da yeniden
 * ölçer ve son geçerli indeksi sıkıştırır.
 */
export function useTrackCarousel(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  /** Senkron sayaç — hızlı tıklamalar React commit'inden hızlı akabilir. */
  const indexRef = useRef(0);
  /** Programatik scrollTo hedefi — animasyon ortasında scroll-sync'i kilitler. */
  const programmaticLeft = useRef<number | null>(null);

  const cardStep = useCallback(() => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("a,article,button,div");
    if (!track || !card) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  }, []);

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

  /** Swipe/scroll sonrası nokta ve ok durumunu gerçek konumdan senkronla. */
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

  return { trackRef, index, maxIndex, goTo, syncFromScroll, markUserScroll };
}
