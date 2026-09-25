import { Card, Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

export interface DoctorItem {
  name?: string;
  slug?: string;
  title?: { tr?: string; en?: string };
}

export function DoctorsSection({ items }: { items: DoctorItem[] }) {
  if (items.length === 0) return null;
  return (
    <Section className="bg-white">
      <Heading level="h2" size="md">
        Uzmanlarımızla Tanışın
      </Heading>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.slug} hover="lift">
            <Heading level="h3" size="title">
              {item.name}
            </Heading>
            <Text tone="muted" size="small">
              {pickLocalized(item.title)}
            </Text>
          </Card>
        ))}
      </div>
    </Section>
  );
}
