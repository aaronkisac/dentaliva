import Image from "next/image";

import { Heading, Section } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl, refDimensions } from "@dentaliva/sanity-schema/image-url";

import type { GalleryImage } from "../../src/content/home";

const ENV = {
  projectId: process.env.SANITY_PROJECT_ID ?? "86x2hbzv",
  dataset: process.env.SANITY_DATASET ?? "production",
};

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const rendered = images.filter((image) => image.asset?._ref).slice(0, 8);
  if (rendered.length === 0) return null;
  return (
    <Section>
      <Heading level="h2" size="md">
        Galeri
      </Heading>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {rendered.map((image, index) => {
          const ref = image.asset?._ref as string;
          const dims = refDimensions(ref) ?? { width: 800, height: 800 };
          return (
            <Image
              key={ref}
              src={ref}
              alt={pickLocalized(image.alt) || `Klinik görseli ${index + 1}`}
              width={dims.width}
              height={dims.height}
              sizes="(max-width: 768px) 50vw, 25vw"
              placeholder="blur"
              blurDataURL={lqipUrl(ref, ENV)}
              className="aspect-square h-auto w-full border border-[var(--dvn-line)] object-cover"
            />
          );
        })}
      </div>
    </Section>
  );
}
