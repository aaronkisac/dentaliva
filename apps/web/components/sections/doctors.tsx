"use client";

import { useState } from "react";

import { cn, Heading, Link, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import type { HomeTeamSection } from "../../src/content/home";
import { imageTarget } from "../../src/image-target";
import { DoctorPortrait } from "../doctor-portrait";

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

/** DSN-38: ok ikonu unicode değil stroke SVG (DSN-23 burger kararıyla aynı ikon dili). */
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
export function DoctorsSection({
  items,
  team,
}: {
  items: DoctorItem[];
  team?: HomeTeamSection | null;
}) {
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
      {pickLocalized(team?.heading) ? (
        <>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-gold" />
            <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
              {pickLocalized(team?.eyebrow)}
            </p>
          </div>
          <Heading level="h2" size="md" className="mt-4 max-w-2xl">
            {pickLocalized(team?.heading)}
          </Heading>
        </>
      ) : null}
      {pickLocalized(team?.text) ? (
        <Text className="mt-3 max-w-2xl text-ink/70">{pickLocalized(team?.text)}</Text>
      ) : null}

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
                {/* DSN-43: foto yoksa boş alan yerine markalı baş harf monogramı. */}
                <DoctorPortrait
                  name={doctor.name}
                  photo={{
                    ref: doctor.photo?.ref,
                    lqip:
                      doctor.lqip ??
                      (doctor.photo?.ref ? lqipUrl(doctor.photo.ref, ENV) : undefined),
                  }}
                  alt={doctor.photo?.alt?.tr ?? doctor.name ?? ""}
                  frameClassName="aspect-[20/21] w-full"
                  width={isBig ? 800 : 400}
                  height={isBig ? 840 : 420}
                  sizes={isBig ? "(max-width: 1023px) 100vw, 38vw" : "220px"}
                  imageClassName="transition-transform duration-500 group-hover:scale-105"
                />
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
              className="flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Sonraki hekimler"
              onClick={() => rotate(1)}
              className="flex h-11 w-11 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        )}
      </div>

      {/* DSN-54: altta nokta göstergeleri — tüm carousel'lerde aynı düzen. */}
      {count > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
          {items.map((doctor, i) => (
            <button
              key={doctor.slug ?? i}
              type="button"
              aria-label={`${i + 1}. hekim`}
              aria-current={i === start ? "true" : undefined}
              onClick={() => {
                setDir(i > start ? 1 : -1);
                setMoved(true);
                setStart(i);
              }}
              className="p-1.5"
            >
              <span
                aria-hidden="true"
                className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  i === start ? "bg-gold-deep" : "bg-ink/20 hover:bg-ink/40"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
