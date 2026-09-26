import Image from "next/image";

import { Button } from "@dentaliva/ui";
import { Container } from "@dentaliva/ui";
import { Heading } from "@dentaliva/ui";
import { Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import { site } from "../../src/config";

export interface HeroData {
  headline?: { tr?: string; en?: string };
  subline?: { tr?: string; en?: string };
  image?: { asset?: { _ref?: string }; alt?: { tr?: string; en?: string } };
}

const ENV = {
  projectId: process.env.SANITY_PROJECT_ID ?? "86x2hbzv",
  dataset: process.env.SANITY_DATASET ?? "production",
};

export function HeroSection({ data }: { data: HeroData | null }) {
  const headline = pickLocalized(data?.headline) || "Herkesi Gülümset";
  const subline = pickLocalized(data?.subline) || "İstanbul'da güvenilir dental klinik";
  const ref = data?.image?.asset?._ref;
  // LCP element when present: priority + explicit dimensions (no CLS) + blur-up.
  const dims = ref ? (refDimensions(ref) ?? { width: 1600, height: 900 }) : null;
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
        {ref && dims ? (
          <Image
            src={ref}
            alt={pickLocalized(data?.image?.alt) || headline}
            width={dims.width}
            height={dims.height}
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={lqipUrl(ref, ENV)}
            className="mt-10 h-auto w-full border border-[var(--dvn-line-gold)] object-cover"
          />
        ) : null}
        <p className="mt-8 font-sans text-sm text-gold-soft">{site.domain.replace("www.", "")}</p>
      </Container>
    </section>
  );
}
