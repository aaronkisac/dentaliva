import Image from "next/image";

import { Card, Heading, Link, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";

import type { TreatmentListItem } from "../src/content/treatments";

/**
 * DSN-45: hizmet kartı — ana sayfa hizmet grid'i ile /hizmetlerimiz listesi
 * tek kalıbı paylaşır (DSN-26 kart dili: üstte hero görseli + lqip blur,
 * başlık, özet, Detay bağlantısı). Görsel yoksa alan basılmaz; slug yoksa
 * bağlantı render edilmez.
 */
export function TreatmentCard({ item }: { item: TreatmentListItem }) {
  return (
    <Card hover="lift">
      {item.heroImage?.ref ? (
        <Image
          src={item.heroImage.ref}
          alt={item.heroImage.alt?.tr ?? ""}
          width={600}
          height={400}
          sizes="(max-width: 768px) 100vw, 33vw"
          placeholder={item.heroImage.lqip ? "blur" : "empty"}
          blurDataURL={item.heroImage.lqip}
          className="h-48 w-full object-cover"
        />
      ) : null}
      <Heading level="h3" size="title">
        {pickLocalized(item.name)}
      </Heading>
      <Text className="mt-2 line-clamp-3">{pickLocalized(item.summary)}</Text>
      {item.slug ? (
        <Link
          href={`/hizmetlerimiz/${item.slug}`}
          className="mt-4 inline-block font-sans text-sm font-semibold text-navy hover:text-gold-deep"
        >
          Detay →
        </Link>
      ) : null}
    </Card>
  );
}
