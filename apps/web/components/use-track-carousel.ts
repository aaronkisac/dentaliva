"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * DSN-51: yatay scroll-snap carousel'lerin ortak durumu — okların başta/sonda
 * pasif kalması için kenar kontrolü mount'ta ve her scroll'da güncellenir;
 * scrollByCard bir kart + boşluk genişliği kadar kaydırır. Kullanım:
 * ref'i track'e bağla, onScroll={updateEdges}, ok onClick={scrollByCard}.
 */
export function useTrackCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }, []);

  // İlk boyamada kenar durumunu kur: görünürden az öğe varsa "sonraki" baştan
  // pasif olmalı (yalnız onScroll'a bırakılırsa ok ölü görünür).
  useEffect(() => {
    updateEdges();
  }, [updateEdges]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("button,a,article");
    if (!card) return;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    const step = card.getBoundingClientRect().width + gap;
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  }, []);

  return { trackRef, atStart, atEnd, updateEdges, scrollByCard };
}
