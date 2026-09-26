import Image from "next/image";

import { Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

export interface AboutData {
  title?: { tr?: string; en?: string };
  body?: { tr?: string; en?: string };
  image?: { asset?: { _ref?: string }; alt?: { tr?: string; en?: string } };
}

const ENV = {
  projectId: process.env.SANITY_PROJECT_ID ?? "86x2hbzv",
  dataset: process.env.SANITY_DATASET ?? "production",
};

export function AboutSection({ data }: { data: AboutData | null }) {
  if (!data) return null;
  const ref = data.image?.asset?._ref;
  const dims = ref ? (refDimensions(ref) ?? { width: 1200, height: 900 }) : null;
  const title = pickLocalized(data.title) || "Hakkımızda";
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <Heading level="h2" size="md">
            {title}
          </Heading>
          <Text className="mt-4 max-w-3xl">{pickLocalized(data.body)}</Text>
        </div>
        {ref && dims ? (
          <Image
            src={ref}
            alt={pickLocalized(data.image?.alt) || title}
            width={dims.width}
            height={dims.height}
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={lqipUrl(ref, ENV)}
            className="h-auto w-full border border-[var(--dvn-line-gold)] object-cover"
          />
        ) : null}
      </div>
    </Section>
  );
}
