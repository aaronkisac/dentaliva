"use client";

import Image from "next/image";
import { useRef } from "react";

import { Heading, Reveal, Section, Text } from "@dentaliva/ui";
import { buttonVariants, cn, Link } from "@dentaliva/ui";

export interface DoctorItem {
  name?: string;
  slug?: string;
  title?: { tr?: string; en?: string };
  photo?: { ref?: string; alt?: { tr?: string; en?: string } };
}

/**
 * DSN-15: ReoDental ekip bölümü — eyebrow başlık, büyük featured kart
 * (ilk hekim, scale-in animasyonu) ve kalan hekimler için ok butonlu
 * yatay carousel. Kartlar yatay görünüme girdiğinde belirir;
 * reduced-motion'da animasyonsuz.
 */
export function DoctorsSection({ items }: { items: DoctorItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const featured = items[0];
  if (!featured) return null;
  const rest = items.slice(1);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

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

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Featured: ilk hekim — bölüme gelindiğinde büyüyerek belirir. */}
        <Reveal effect="scale" className="min-w-0">
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
        </Reveal>

        {/* Carousel: kalan hekimler — yatay kaydırılabilir, ok butonlu. */}
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-sans text-sm text-ink/70">
              {rest.length} hekim daha — kartlar arasında gezinin
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Önceki hekimler"
                onClick={() => scrollByCards(-1)}
                className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Sonraki hekimler"
                onClick={() => scrollByCards(1)}
                className="flex h-10 w-10 items-center justify-center border border-[var(--dvn-line-gold)] text-navy hover:bg-gold hover:text-navy"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
          >
            {rest.map((doctor, index) => (
              <Reveal
                key={doctor.slug}
                delay={(index % 4) * 60}
                className="w-44 shrink-0 snap-start sm:w-52"
              >
                <Link
                  href={`/hekimlerimiz/${doctor.slug}`}
                  className="group block overflow-hidden rounded-[4px]"
                >
                  <div className="overflow-hidden rounded-[4px]">
                    {doctor.photo?.ref ? (
                      <Image
                        src={doctor.photo.ref}
                        alt={doctor.name ?? ""}
                        width={400}
                        height={400}
                        sizes="220px"
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-square w-full rounded-[4px] bg-ivory-2" />
                    )}
                  </div>
                  <p className="mt-3 font-sans text-sm font-medium text-ink">{doctor.name}</p>
                  {doctor.title?.tr ? (
                    <p className="mt-0.5 font-sans text-xs text-ink/70">{doctor.title.tr}</p>
                  ) : null}
                </Link>
              </Reveal>
            ))}
          </div>
          <Link href="/hekimlerimiz" className={cn(buttonVariants({ size: "md" }), "mt-6")}>
            Tüm Uzmanlarımız
          </Link>
        </div>
      </div>
    </Section>
  );
}
