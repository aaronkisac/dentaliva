import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { Card, Heading, Section, Text } from "@dentaliva/ui";

export interface QuickServiceItem {
  name?: { tr?: string; en?: string };
  slug?: string;
  summary?: { tr?: string; en?: string };
}

export function QuickServicesSection({ items }: { items: QuickServiceItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section>
      <Heading level="h2" size="md">
        Hizmetlerimiz
      </Heading>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.slug} hover="lift">
            <Heading level="h3" size="title">
              {pickLocalized(item.name)}
            </Heading>
            <Text className="mt-2">{pickLocalized(item.summary)}</Text>
          </Card>
        ))}
      </div>
    </Section>
  );
}
