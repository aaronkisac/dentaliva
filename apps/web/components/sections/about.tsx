import Image from "next/image";

import { Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";

export interface AboutData {
  title?: { tr?: string; en?: string };
  body?: { tr?: string; en?: string };
  image?: { asset?: { _ref?: string }; alt?: { tr?: string; en?: string }; lqip?: string };
}

const ENV = imageTarget();

export function AboutSection({ data }: { data: AboutData | null }) {
  if (!data) return null;
  const ref = data.image?.asset?._ref;
  const dims = ref ? (refDimensions(ref) ?? { width: 1200, height: 900 }) : null;
  // Copy sweep: başlık yalnızca CMS'ten — fallback copy yok; başlıksız
  // gövde yine de render edilir.
  const title = pickLocalized(data.title);
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          {title ? (
            <Heading level="h2" size="md">
              {title}
            </Heading>
          ) : null}
          <Text className="mt-4 max-w-3xl">{pickLocalized(data.body)}</Text>
        </div>
        {ref && dims ? (
          <Image
            src={ref}
            alt={pickLocalized(data.image?.alt) ?? title}
            width={dims.width}
            height={dims.height}
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={data.image?.lqip ?? lqipUrl(ref, ENV)}
            className="h-auto w-full border border-[var(--dvn-line-gold)] object-cover"
          />
        ) : null}
      </div>
    </Section>
  );
}
