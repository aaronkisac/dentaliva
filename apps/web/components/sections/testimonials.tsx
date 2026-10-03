import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

export interface TestimonialItem {
  author?: string;
  quote?: { tr?: string; en?: string };
  rating?: number;
  source?: string;
}

/** Google "G" mark — resmi dört renkli logo (statik güven rozeti, DSN-30). */
function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function ReviewsSection({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section className="bg-navy">
      <Heading level="h2" size="md" className="text-white">
        Hastalarımızın Yorumları
      </Heading>
      {/* DSN-30: statik Google güven rozeti — Trustindex embed yok (v1 kararı);
          puan elle güncellenen statik veridir. */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <GoogleMark className="h-8 w-8" />
        <div>
          <p aria-hidden="true" className="text-lg leading-none text-gold">
            {"★★★★★"}
          </p>
          <p className="mt-1 font-sans text-sm text-white/85">Google Değerlendirmeleri · 5,0</p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <Card key={`${item.author ?? index}-${index}`} tone="dark">
            <Text tone="gold" size="small">
              {"★".repeat(Math.min(item.rating ?? 5, 5))}
            </Text>
            <Text tone="white" className="mt-3">
              {pickLocalized(item.quote)}
            </Text>
            <Text tone="white" size="small" className="mt-4">
              {item.author} · {item.source}
            </Text>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export interface VideoTestimonial {
  author?: string;
  youtubeId?: string;
}

export function VideoTestimonialsSection({ items }: { items: VideoTestimonial[] }) {
  const videos = items.filter((item) => item.youtubeId);
  if (videos.length === 0) return null;
  return (
    <Section>
      <Heading level="h2" size="md">
        Hastalarımızın Görüşleri
      </Heading>
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
              alt={item.author ?? "Hasta videosu"}
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
