import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

export interface TestimonialItem {
  author?: string;
  quote?: { tr?: string; en?: string };
  rating?: number;
  source?: string;
}

export function ReviewsSection({ items }: { items: TestimonialItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section className="bg-navy">
      <Heading level="h2" size="md" className="text-white">
        Hastalarımızın Yorumları
      </Heading>
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
