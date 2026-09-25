import { Button } from "@dentaliva/ui";
import { Container } from "@dentaliva/ui";
import { Heading } from "@dentaliva/ui";
import { Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import { site } from "../../src/config";

export interface HeroData {
  headline?: { tr?: string; en?: string };
  subline?: { tr?: string; en?: string };
}

export function HeroSection({ data }: { data: HeroData | null }) {
  const headline = pickLocalized(data?.headline) || "Herkesi Gülümset";
  const subline = pickLocalized(data?.subline) || "İstanbul'da güvenilir dental klinik";
  return (
    <section className="bg-navy text-white">
      <Container className="py-[var(--dvn-section-y)] md:py-[var(--dvn-section-y-md)]">
        <Heading level="h1" size="xl" className="text-white">
          {headline}
        </Heading>
        <Text size="lg" tone="white" className="mt-6 max-w-2xl">
          {subline}
        </Text>
        <div className="mt-8 flex gap-4">
          <Button size="lg">Randevu Al</Button>
          <Button size="lg" variant="outline" className="border-gold-soft text-white">
            Hizmetlerimizi Keşfedin
          </Button>
        </div>
        <p className="mt-8 font-sans text-sm text-gold-soft">{site.domain.replace("www.", "")}</p>
      </Container>
    </section>
  );
}
