"use client";

import Image from "next/image";
import { useState } from "react";

import { Heading, Section, Text } from "@dentaliva/ui";
import { cn, Link } from "@dentaliva/ui";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

const ENV = {
  projectId: process.env.SANITY_PROJECT_ID ?? "86x2hbzv",
  dataset: process.env.SANITY_DATASET ?? "production",
};

export interface DoctorItem {
  name?: string;
  slug?: string;
  title?: { tr?: string; en?: string };
  photo?: { ref?: string; alt?: { tr?: string; en?: string } };
}

const VISIBLE = 4;

/**
 * DSN-19: tamamen manuel carousel — 4 görünür hekim; SIRA 1'deki hekim
 * BÜYÜK render edilir, 2-3-4 küçük kalır ve alt kenara hizalanır. Ok
 * butonları sırayı ±1 kaydırır ve kayma animasyonu görünür (DSN-11 ease).
 * LQIP blur placeholder sayesinde görsel değişiminde arkaplan flash'ı yok.
 * Otomatik dönüş yoktur.
 */
export function DoctorsSection({ items }: { items: DoctorItem[] }) {
  const [start, setStart] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const count = items.length;

  // Ok butonları: sırayı ±1 kaydırır; kayma animasyonu yön bilinciyle oynar.
  const rotate = (delta: 1 | -1) => {
    setDir(delta);
    setStart((value) => (value + delta + count) % count);
  };

  // Görünür pencere: start'tan itibaren 4 hekim (mod ile sarmalar).
  // İndeks her zaman aralıkta — TS daralması için cast.
  const visible = Array.from({ length: Math.min(VISIBLE, count) }, (_v, k) => {
    const index = (start + k) % count;
    const doctor = items[index] as DoctorItem;
    return { doctor, isBig: k === 0 };
  });

  return (
    <Section className="bg-white">
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

      <div
        key={`${start}-${dir}`}
        className={cn(
          "mt-10 flex flex-wrap items-end gap-4",
          dir === 1 ? "team-slide-next" : "team-slide-prev",
        )}
      >
        {visible.map(({ doctor, isBig }) => (
          <Link
            key={doctor.slug}
            href={`/hekimlerimiz/${doctor.slug}`}
            className={cn(
              "group block",
              isBig ? "w-full sm:w-[38%]" : "w-[calc(50%-0.5rem)] sm:w-auto sm:flex-1",
            )}
          >
            <div className="overflow-hidden rounded-[4px]">
              {doctor.photo?.ref ? (
                <Image
                  src={doctor.photo.ref}
                  alt={doctor.name ?? ""}
                  width={isBig ? 800 : 400}
                  height={isBig ? 800 : 400}
                  sizes={isBig ? "(max-width: 1023px) 100vw, 38vw" : "220px"}
                  placeholder="blur"
                  blurDataURL={lqipUrl(doctor.photo.ref, ENV)}
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

      <div className="mt-8 flex justify-end gap-2">
        <button
          type="button"
          aria-label="Önceki hekimler"
          onClick={() => rotate(-1)}
          className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Sonraki hekimler"
          onClick={() => rotate(1)}
          className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
        >
          →
        </button>
      </div>
    </Section>
  );
}
