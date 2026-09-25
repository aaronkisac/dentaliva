import { Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

export interface AboutData {
  title?: { tr?: string; en?: string };
  body?: { tr?: string; en?: string };
}

export function AboutSection({ data }: { data: AboutData | null }) {
  if (!data) return null;
  return (
    <Section className="bg-white">
      <Heading level="h2" size="md">
        {pickLocalized(data.title) || "Hakkımızda"}
      </Heading>
      <Text className="mt-4 max-w-3xl">{pickLocalized(data.body)}</Text>
    </Section>
  );
}
