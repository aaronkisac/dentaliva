"use client";

import Image from "next/image";
import { useState } from "react";

import { cn, Heading, Link, Section, Text } from "@dentaliva/ui";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";

const ENV = imageTarget();

export interface DoctorItem {
  name?: string;
  slug?: string;
  title?: { tr?: string; en?: string };
  photo?: { ref?: string; alt?: { tr?: string; en?: string } };
  /** Sanity metadata.lqip — inline base64 blur placeholder. */
  lqip?: string;
}

const VISIBLE = 4;

/**
 * DSN-20: tamamen manuel carousel — 4 görünür hekim; SIRA 1'deki hekim
 * BÜYÜK render edilir, 2-3-4 küçük kalır ve alt kenara hizalanır. Slaytlar
 * portre fotolara göre %5 uzun (20/21). Ok butonları sırayı ±1 kaydırır:
 * küçük kartlar yön bilinçli kayar; büyük kartın görsel çerçevesi gidiş
 * yönünden, küçük kart boyutunda başlayıp büyüyerek ve kayarak yerleşir
 * (DSN-11 ease; reduced-motion'da kapalı). Ok butonları desktop'ta küçük
 * kartların üstündeki boşlukta, mobilde akışın altında. LQIP blur
 * placeholder; otomatik dönüş yoktur. Veri yoksa bölüm render edilmez;
 * ok butonları yalnız birden fazla hekimde çıkar; slayt değişimi
 * role="status" ile duyurulur (WCAG 4.1.3).
 */
export function DoctorsSection({ items }: { items: DoctorItem[] }) {
  const [start, setStart] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  // Yön animasyonları yalnız gezinmede oynar; ilk boyamada değil (bölüm
  // ekranın altındayken görünmez oynar ve geometri testleriyle yarışır).
  const [moved, setMoved] = useState(false);

  const count = items.length;

  // Veri yoksa bölüm hiç render edilmez; % count NaN üretmesin.
  if (count === 0) return null;

  const slideClass = moved ? (dir === 1 ? "team-slide-next" : "team-slide-prev") : "";
  const featuredClass = moved ? (dir === 1 ? "team-featured-next" : "team-featured-prev") : "";

  // Ok butonları: sırayı ±1 kaydırır; kayma animasyonu yön bilinciyle oynar.
  const rotate = (delta: 1 | -1) => {
    setDir(delta);
    setMoved(true);
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

      {/* relative sarmalayıcı: ok butonları sm+ üstünde küçük kartların
          üstündeki boşluğa mutlak konumlanır; mobilde akışta kalır. */}
      <div className="relative mt-10">
        {/* Ekran okuyucu duyurusu: öne çıkan hekim + konum; metin her
            ok tıklamasında değişir, öğe remount edilmez. */}
        <p role="status" className="sr-only">
          Öne çıkan: {visible[0]?.doctor.name} ({start + 1}/{count})
        </p>
        <div
          key={`${start}-${dir}`}
          role="group"
          aria-roledescription="carousel"
          aria-label="Uzman hekimler"
          className="flex flex-wrap items-end gap-4"
        >
          {visible.map(({ doctor, isBig }) => (
            <Link
              key={doctor.slug}
              href={`/hekimlerimiz/${doctor.slug}`}
              className={cn(
                "group block",
                isBig ? "w-full sm:w-[38%]" : "w-[calc(50%-0.5rem)] sm:w-auto sm:min-w-0 sm:flex-1",
                !isBig && slideClass,
              )}
            >
              <div className={cn("overflow-hidden rounded-[4px]", isBig && featuredClass)}>
                {doctor.photo?.ref ? (
                  <Image
                    src={doctor.photo.ref}
                    alt={doctor.photo?.alt?.tr ?? doctor.name ?? ""}
                    width={isBig ? 800 : 400}
                    height={isBig ? 840 : 420}
                    sizes={isBig ? "(max-width: 1023px) 100vw, 38vw" : "220px"}
                    placeholder="blur"
                    blurDataURL={doctor.lqip ?? lqipUrl(doctor.photo.ref, ENV)}
                    className="aspect-[20/21] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[20/21] w-full bg-ivory-2" />
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

        {count > 1 && (
          <div className="mt-8 flex justify-end gap-2 sm:absolute sm:right-0 sm:top-0 sm:mt-0">
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
        )}
      </div>
    </Section>
  );
}
