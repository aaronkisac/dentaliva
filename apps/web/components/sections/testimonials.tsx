import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import { clampWords } from "../treatment-card";
import { CarouselTrack } from "../carousel-track";
import { GoogleMark } from "../google-mark";
import { uiString } from "../../src/ui-strings";

export interface TestimonialItem {
  author?: string;
  quote?: { tr?: string; en?: string };
  rating?: number;
  source?: string;
}

/**
 * DSN-52: yorum carousel'i — hizmetler carousel'iyle (DSN-50/51) aynı nokta
 * deseni; kartlar SERVER'da render edilip CarouselTrack'e children olarak
 * geçilir (client JS yalnız kaydırma + nokta mantığı — ilk denemede tüm
 * bölüm client'a alınca ana sayfa Lighthouse perf bütçesi aşılmıştı).
 * Quote'lar veri seviyesinde kısaltılır (TreatmentCard'taki Chromium
 * line-clamp dersi). Başlık siteCopy'den; copy'siz render edilmez.
 */
export function ReviewsSection({ items, heading }: { items: TestimonialItem[]; heading?: string }) {
  if (items.length === 0) return null;
  const header = (
    <div>
      {heading ? (
        <Heading level="h2" size="md" className="text-white">
          {heading}
        </Heading>
      ) : null}
      {/* DSN-30: statik Google güven rozeti — Trustindex embed yok (v1 kararı);
          puan elle güncellenen statik veridir. */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <GoogleMark className="h-8 w-8" />
        <div>
          <p aria-hidden="true" className="text-lg leading-none text-gold">
            {"★★★★★"}
          </p>
          <p className="mt-1 font-sans text-sm text-white/85">{uiString("googleBadge")}</p>
        </div>
      </div>
    </div>
  );
  return (
    <Section className="bg-navy">
      <CarouselTrack
        count={items.length}
        ariaLabelPrefix="yorum"
        tone="dark"
        header={header}
        className="mt-8 items-stretch"
      >
        {items.map((item, index) => (
          <div
            key={`${item.author ?? index}-${index}`}
            className="dvn-carousel-card shrink-0 snap-start"
          >
            {/* DSN-54: kartlar track yüksekliğine esner — tüm slaytlar eşit. */}
            <Card tone="dark" className="h-full">
              <Text tone="gold" size="small">
                {"★".repeat(Math.min(item.rating ?? 5, 5))}
              </Text>
              <Text tone="white" className="mt-3">
                {clampWords(t(item.quote), 30)}
              </Text>
              <Text tone="white" size="small" className="mt-4">
                {item.author} · {item.source}
              </Text>
            </Card>
          </div>
        ))}
      </CarouselTrack>
    </Section>
  );
}

export interface VideoTestimonial {
  author?: string;
  youtubeId?: string;
}

export function VideoTestimonialsSection({
  items,
  heading,
}: {
  items: VideoTestimonial[];
  heading?: string;
}) {
  const videos = items.filter((item) => item.youtubeId);
  if (videos.length === 0) return null;
  return (
    <Section>
      {/* DSN-52: başlık siteCopy'den — copy'siz render edilmez. */}
      {heading ? (
        <Heading level="h2" size="md">
          {heading}
        </Heading>
      ) : null}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {videos.map((item) => (
          <a
            key={item.youtubeId}
            href={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video overflow-hidden border border-[var(--dvn-line-soft)]"
          >
            {/* CSP img-src i.ytimg.com'a izin verir (PRF-1); iframe yerine
                poster: klavye tek durak + sayfa 6 uzaktan frame yüklemez. */}
            <img
              src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
              alt={item.author || uiString("patientVideoAlt")}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center bg-navy/30 text-3xl text-white"
            >
              ▶
            </span>
            {item.author ? (
              <span className="absolute inset-x-0 bottom-0 bg-navy/80 px-3 py-2 font-sans text-sm text-white">
                {item.author}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    </Section>
  );
}
