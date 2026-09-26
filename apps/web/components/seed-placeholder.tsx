import { Heading, Section, Text } from "@dentaliva/ui";

/**
 * Placeholder for dynamic routes when the Sanity project has no documents yet
 * (fresh template clone with `output: "export"`: generateStaticParams must
 * yield at least one path, and the page must render without CMS content).
 * Production sites with real content never render this.
 */
export function SeedPlaceholder({ title }: { title: string }) {
  return (
    <Section>
      <Heading level="h1" size="lg">
        {title}
      </Heading>
      <Text size="lg" className="mt-6 max-w-3xl">
        Bu içerik henüz hazırlanıyor. Sanity projenize dokümanlar eklediğinizde bu sayfa otomatik
        olarak doldurulur (webhook yeniden derlemesi ile yayına girer).
      </Text>
    </Section>
  );
}
