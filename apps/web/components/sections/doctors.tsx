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

const PAGE_SIZE = 4;
const ROTATE_MS = 5000;

/**
 * DSN-17: spot-ışık ekip bölümü — büyük kart her turda sıradaki hekimi
 * gösterir (gelen büyüyerek gelir); küçük şerit 4'lü gruplar halinde döner.
 * Hover/odakta otomatik dönüş durur; reduced-motion'da otomatik dönüş ve
 * büyüme animasyonu kapalıdır. Şeritteki bir karta tıklayınca o hekim
 * öne çıkar.
 */
export function DoctorsSection({ items }: { items: DoctorItem[] }) {
  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = items.length;
  const featured = items[active] ?? items[0];

  // Otomatik dönüş: 5 saniyede sıradaki hekimi öne çıkarır. Hover/odakta
  // durur; reduced-motion'da hiç başlamaz.
  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setActive((value) => (value + 1) % count);
    }, ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, count]);

  // Şerit: aktif hekimden sonraki 4 kişi (sayfa ile döner; mod ile sarmalar).
  const others = items
    .map((doctor, index) => ({ doctor, index }))
    .filter(({ index }) => index !== active)
    .sort(
      (a, b) => ((a.index - active - 1 + count) % count) - ((b.index - active - 1 + count) % count),
    );
  const stripDoctors = others.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const pageCount = Math.max(Math.ceil(others.length / PAGE_SIZE), 1);

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

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Spot-ışık: aktif hekim büyük kartta; her değişimde büyüyerek gelir. */}
        {featured ? (
          <div key={active} className="team-grow min-w-0">
            <Link
              href={`/hekimlerimiz/${featured.slug}`}
              className="group block overflow-hidden rounded-[4px]"
            >
              <div className="overflow-hidden rounded-[4px]">
                {featured.photo?.ref ? (
                  <Image
                    src={featured.photo.ref}
                    alt={featured.name ?? ""}
                    width={800}
                    height={800}
                    sizes="(max-width: 1023px) 100vw, 40vw"
                    className="aspect-square h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-[4px] bg-ivory-2" />
                )}
              </div>
              <p className="mt-4 font-sans text-lg font-medium text-ink">{featured.name}</p>
              {featured.title?.tr ? (
                <p className="mt-1 font-sans text-sm text-ink/70">{featured.title.tr}</p>
              ) : null}
            </Link>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-sans text-sm text-ink/70">
              {count > 0 ? `${count} hekim — otomatik tanıtım` : ""}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Önceki 4 hekim"
                onClick={() => setPage((value) => (value - 1 + pageCount) % pageCount)}
                className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Sonraki 4 hekim"
                onClick={() => setPage((value) => (value + 1) % pageCount)}
                className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
              >
                →
              </button>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
            {stripDoctors.map(({ doctor, index }) => (
              <button
                key={doctor.slug ?? index}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`${doctor.name ?? "Hekim"} — öne çıkar`}
                className="group block overflow-hidden rounded-[4px] text-left ring-gold transition-shadow hover:ring-2"
              >
                {doctor.photo?.ref ? (
                  <Image
                    src={doctor.photo.ref}
                    alt=""
                    width={400}
                    height={400}
                    sizes="220px"
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full bg-ivory-2" />
                )}
                <p className="mt-3 font-sans text-sm font-medium text-ink">{doctor.name}</p>
                {doctor.title?.tr ? (
                  <p className="mt-0.5 font-sans text-xs text-ink/70">{doctor.title.tr}</p>
                ) : null}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/hekimlerimiz" className={cn(buttonVariants({ size: "md" }))}>
              Tüm Uzmanlarımız
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
