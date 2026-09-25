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
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {videos.map((item) => (
          <div key={item.youtubeId} className="aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
              title={item.author ?? "Hasta videosu"}
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
