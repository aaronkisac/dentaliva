"use client";

import { useEffect, useRef, useState } from "react";

import { Heading, Link, Section } from "@dentaliva/ui";

import type { QuickServiceItem } from "../../src/content/home";
import { TreatmentCard } from "../treatment-card";

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

/**
 * DSN-50: ana sayfa hizmet carousel'i — 3'lü overlay kartlar tek sırada;
 * masaüstünde oklarla kart kaydırma, mobilde yerleşik swipe (scroll-snap).
 * Bölüm yüksekliği iki sıralı grid'in ~ yarısına iner; 6 curated hizmetin
 * tamamı carousel'de ulaşılabilir kalır. Başlık bloğu solda, sağda CMS'ten
 * gelen "Tüm Hizmetlerimiz" metin bağlantısı + oklar (DSN-44 copy'siz
 * render edilmez).
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
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  if (items.length === 0) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("a,article");
    if (!card) return;
    const step = card.getBoundingClientRect().width + 24; // gap-6
    track.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const updateEdges = () => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  };

  // İlk boyamada kenar durumunu kur: görünürden az öğe varsa "sonraki" baştan
  // pasif olmalı (yalnız onScroll'a bırakılırsa ok ölü görünür).
  useEffect(() => {
    updateEdges();
  }, []);

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
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              className={arrowClass}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Sonraki hizmetler"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              className={arrowClass}
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={trackRef}
        onScroll={updateEdges}
        className="-mx-[var(--dvn-container-gutter)] mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-[var(--dvn-container-gutter)] px-[var(--dvn-container-gutter)] pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div
            key={item.slug ?? item.name?.tr}
            className="w-[82%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)]"
          >
            <TreatmentCard item={item} />
          </div>
        ))}
      </div>
    </Section>
  );
}
