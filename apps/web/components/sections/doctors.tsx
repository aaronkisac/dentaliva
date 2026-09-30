"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Heading, Section, Text } from "@dentaliva/ui";
import { buttonVariants, cn, Link } from "@dentaliva/ui";

export interface DoctorItem {
  name?: string;
  slug?: string;
  title?: { tr?: string; en?: string };
  photo?: { ref?: string; alt?: { tr?: string; en?: string } };
}

const VISIBLE = 4;
const ROTATE_MS = 5000;

/**
 * DSN-18: tek carousel, 4 görünür hekim — SIRA 1'deki hekim BÜYÜK render
 * edilir; carousel döndükçe 1. sıraya gelen hekim team-grow ile büyüyerek
 * gelir; 2-3-4 küçük kalır. Otomatik dönüş 5 sn (hover/odakta durur,
 * reduced-motion'da kapalı); ok butonları sırayı ±1 kaydırır.
 */
export function DoctorsSection({ items }: { items: DoctorItem[] }) {
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = items.length;

  useEffect(() => {
    if (paused || count <= VISIBLE) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setStart((value) => (value + 1) % count);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [start, paused, count]);

  // Görünür pencere: start'tan itibaren 4 hekim (mod ile sarmalar).
  // İndeks her zaman aralıkta — TS daralması için cast.
  const visible = Array.from({ length: Math.min(VISIBLE, count) }, (_v, k) => {
    const index = (start + k) % count;
    const doctor = items[index] as DoctorItem;
    return { doctor, isBig: k === 0 };
  });

  return (
    <Section
      className="bg-white"
      // Otomatik dönüş WCAG 2.2.2: hover/odakta durur.
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-gold" />
        <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">Ekibimiz</p>
      </div>
      <Heading level="h2" size="md" className="mt-4 max-w-2xl">
        Uzmanlarımızla Tanışın
      </Heading>
      <Text className="mt-3 max-w-2xl text-ink/70">
        Deneyimli ve uzman hekimlerimiz, konforlu ve kaliteli hizmeti ilke edinmiştir.
      </Text>

      <div className="mt-10 grid grid-cols-2 items-start gap-4 lg:grid-cols-5">
        {visible.map(({ doctor, isBig }) => (
          <Link
            key={doctor.slug}
            href={`/hekimlerimiz/${doctor.slug}`}
            className={cn(
              "group block overflow-hidden rounded-[4px]",
              isBig ? "col-span-2 team-grow" : "",
            )}
          >
            <div className="overflow-hidden rounded-[4px]">
              {doctor.photo?.ref ? (
                <Image
                  src={doctor.photo.ref}
                  alt={doctor.name ?? ""}
                  width={isBig ? 800 : 400}
                  height={isBig ? 800 : 400}
                  sizes={isBig ? "(max-width: 1023px) 50vw, 40vw" : "220px"}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="aspect-square w-full bg-ivory-2" />
              )}
            </div>
            <p
              className={cn(
                "mt-3 text-ink",
                isBig ? "font-sans text-lg font-medium" : "font-sans text-sm font-medium",
              )}
            >
              {doctor.name}
            </p>
            {doctor.title?.tr ? (
              <p className="mt-0.5 font-sans text-xs text-ink/70">{doctor.title.tr}</p>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link href="/hekimlerimiz" className={cn(buttonVariants({ size: "md" }))}>
          Tüm Uzmanlarımız
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Önceki hekimler"
            onClick={() => setStart((value) => (value - 1 + count) % count)}
            className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Sonraki hekimler"
            onClick={() => setStart((value) => (value + 1) % count)}
            className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
          >
            →
          </button>
        </div>
      </div>
    </Section>
  );
}
