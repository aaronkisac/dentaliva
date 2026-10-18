"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Heading, Link, Section } from "@dentaliva/ui";

import type { QuickServiceItem } from "../../src/content/home";
import { TreatmentCard } from "../treatment-card";
import { t } from "../../src/i18n";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      {direction === "left" ? (
        <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
      ) : (
        <path d="M5 12h14m0 0-6-6m6 6-6 6" />
      )}
    </svg>
  );
}

const arrowClass =
  "flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy transition-colors duration-300 hover:bg-gold hover:text-navy disabled:pointer-events-none disabled:opacity-40";

/** Kart arası gap-6 (24px) — kaydırma adımı kart genişliği + bu boşluk. */
const GAP = 24;

/**
 * DSN-51 perf: ilk boyamada sunucuda basılan kart sayısı. Görünür 3 slayt +
 * peek payı; kalan kartlar ilk yükleme bitince boşta kasma penceresinde
 * DOM'a eklenir (aşağıda renderAll efekti) — 24 kartlık DOM ilk yüke binmez.
 */
const INITIAL_CARDS = 6;

/**
 * DSN-50: ana sayfa hizmet carousel'i — TÜM hizmetler tek sırada (DSN-51:
 * eski 6 kartlık servicesGrid kesimi grid dönemiyle öldü); masaüstünde
 * oklarla kart kaydırma, mobilde yerleşik swipe (scroll-snap).
 *
 * DSN-51 düzeltmeleri:
 * - Kaydırma scrollBy yerine İNDEKS tabanlı scrollTo: hedef her zaman bir
 *   kartın başına hizalanır ve son indeks track sonuna flush sıkıştırılır —
 *   kenarda yarım slayt kalıntısı kalmaz.
 * - Slaytların altında nokta göstergeleri: her slayt bir nokta; aktif nokta
 *   görünürdeki ilk kartı gösterir (aria-current), tıklanabilir.
 * - Resize'da yeniden ölçüm; swipe sırasında noktalar/oklar senkron.
 * Başlık bloğu solda, sağda CMS'ten gelen "Tüm Hizmetlerimiz" metin
 * bağlantısı + oklar (DSN-44 copy'siz render edilmez).
 */
export function QuickServicesSection({
  items,
  eyebrow,
  heading,
  ctaLabel,
}: {
  items: QuickServiceItem[];
  eyebrow?: string;
  heading?: string;
  ctaLabel?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [renderAll, setRenderAll] = useState(false);
  /** Senkron sayaç — hızlı tıklamalar React commit'inden hızlı akabilir. */
  const indexRef = useRef(0);
  /** Programatik scrollTo hedefi — animasyon ortasında scroll-sync'i kilitler. */
  const programmaticLeft = useRef<number | null>(null);

  const cardStep = () => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>("a,article");
    if (!track || !card) return 0;
    return card.getBoundingClientRect().width + GAP;
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

  /** Swipe/scroll sonrası nokta ve ok durumunu gerçek konumdan senkronla. */
  const syncFromScroll = useCallback(() => {
    const track = trackRef.current;
    const step = cardStep();
    if (!track || step <= 0) return;
    // Programatik animasyon sürerken ara konumlar indeksi geri çekmesin —
    // hedefe yarım kart yakınına varınca tek sefer senkronla.
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
    const last = Math.max(0, items.length - visible);
    setMaxIndex(last);
    applyIndex(Math.min(indexRef.current, last));
  }, [items.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, renderAll]);

  // Erteleme: ilk yükleme sonrası boşta kasma penceresinde kalan slaytları bas.
  useEffect(() => {
    if (renderAll) return;
    const start = () => setRenderAll(true);
    const handle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(start)
        : window.setTimeout(start, 2000);
    return () => {
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [renderAll]);

  if (items.length === 0) return null;

  return (
    <Section>
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                {eyebrow}
              </p>
            </div>
          ) : null}
          {heading ? (
            <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-2xl" : "max-w-2xl"}>
              {heading}
            </Heading>
          ) : null}
        </div>
        <div className="flex items-center gap-3 max-md:mt-2">
          {ctaLabel ? (
            <Link
              href="/hizmetlerimiz"
              className="font-sans text-sm font-semibold text-navy underline-offset-4 hover:text-gold-deep hover:underline"
            >
              {ctaLabel} →
            </Link>
          ) : null}
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              aria-label="Önceki hizmetler"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              className={arrowClass}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Sonraki hizmetler"
              onClick={() => goTo(index + 1)}
              disabled={index >= maxIndex}
              className={arrowClass}
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={trackRef}
        onScroll={syncFromScroll}
        onPointerDown={markUserScroll}
        onWheel={markUserScroll}
        className="-mx-[var(--dvn-container-gutter)] mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-[var(--dvn-container-gutter)] px-[var(--dvn-container-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {(renderAll ? items : items.slice(0, INITIAL_CARDS)).map((item) => (
          <div key={item.slug ?? t(item.name)} className="dvn-service-card shrink-0 snap-start">
            <TreatmentCard item={item} />
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
          {items.map((item, i) => (
            <button
              key={item.slug ?? (t(item.name) || i)}
              type="button"
              aria-label={`${i + 1}. hizmet`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(Math.min(i, maxIndex))}
              className="p-1.5"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i === index ? "bg-gold-deep" : "bg-ink/20 hover:bg-ink/40"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
