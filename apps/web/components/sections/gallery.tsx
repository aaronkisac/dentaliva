import { Heading, Section } from "@dentaliva/ui";

export interface GalleryImage {
  asset?: { _ref?: string };
  alt?: { tr?: string };
}

export function GallerySection({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) return null;
  return (
    <Section>
      <Heading level="h2" size="md">
        Galeri
      </Heading>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.slice(0, 8).map((image, index) => (
          <div key={image.asset?._ref ?? index} className="aspect-square bg-ivory-2" />
        ))}
      </div>
    </Section>
  );
}
