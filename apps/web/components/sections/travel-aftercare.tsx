import Image from "next/image";

import { Heading, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";
import type { LocalizedPair } from "../../src/content/home";

const ENV = imageTarget();

interface TravelImage {
  ref?: string;
  alt?: LocalizedPair;
  lqip?: string;
}

/**
 * DSN-66/84: doküman #10 TRAVEL + STAY — uluslararası hastanın lojistik
 * itirazlarını çözen planlama bölümü. Doküman kuralı: paket görselleri
 * yerine kapsam bilgisi; "ücretsiz/hediye" dili yok, dahil-hariç yazılı
 * olarak. DSN-84: check-list tek hairline kutu kartta (DentalX kapsam
 * kartı deseni), sol kolonda data-gated görsel. Boşsa bölüm render edilmez.
 */
export function TravelStaySection({
  data,
  eyebrow,
  heading,
}: {
  data: { checklist?: LocalizedPair[]; image?: TravelImage } | null;
  eyebrow?: string;
  heading?: string;
}) {
  const items = (data?.checklist ?? [])
    .map((item) => t(item))
    .filter(Boolean)
    .slice(0, 8);
  if (!data || items.length === 0) return null;
  const image = data.image?.ref ? data.image : null;
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          {eyebrow ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
                {eyebrow}
              </p>
            </div>
          ) : null}
          {heading ? (
            <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-xl" : "max-w-xl"}>
              {heading}
            </Heading>
          ) : null}
          {image?.ref ? (
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[4px] border border-gold/60 p-1.5">
              <div className="relative h-full w-full overflow-hidden rounded-[2px]">
                <Image
                  src={image.ref}
                  alt={t(image.alt) || ""}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={image.lqip ?? lqipUrl(image.ref, ENV)}
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </div>
        <ul className="divide-y divide-[var(--dvn-line-soft)] rounded-[4px] border border-[var(--dvn-line-soft)] bg-white">
          {items.map((item, index) => (
            <li key={`${index}-${item}`} className="flex items-baseline gap-3 px-5 py-4 md:px-6">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 h-4 w-4 shrink-0 text-gold-deep"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="font-sans text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/**
 * DSN-66/84: doküman #11 AFTERCARE — tedavi sonrası güven ve komplikasyon
 * planının görünür kılınması. Normal iyileşme belirtileri ile dikkat
 * gerektiren durumlar ayrı kartlarda (doküman: acil/normal ayrımı);
 * kart başlıkları ikonlu (DSN-84). "24/7" ve garanti dili bilinçli yok —
 * yalnız operasyonel doğrulamayla kullanılabilir.
 */
function CardIcon({ kind }: { kind: "check" | "bell" }) {
  return kind === "check" ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-gold-deep"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-gold-deep"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function AftercareSection({
  data,
  eyebrow,
  heading,
  normalTitle,
  urgentTitle,
}: {
  data: { normal?: LocalizedPair[]; urgent?: LocalizedPair[]; contactNote?: LocalizedPair } | null;
  eyebrow?: string;
  heading?: string;
  /** Kart başlıkları siteCopy'den — copy'siz kart başlığı basılmaz. */
  normalTitle?: string;
  urgentTitle?: string;
}) {
  if (!data) return null;
  const normal = (data.normal ?? [])
    .map((item) => t(item))
    .filter(Boolean)
    .slice(0, 5);
  const urgent = (data.urgent ?? [])
    .map((item) => t(item))
    .filter(Boolean)
    .slice(0, 5);
  const contact = t(data.contactNote);
  if (normal.length === 0 && urgent.length === 0 && !contact) return null;
  return (
    <Section className="bg-ivory">
      {eyebrow ? (
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-gold" />
          <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">{eyebrow}</p>
        </div>
      ) : null}
      {heading ? (
        <Heading level="h2" size="md" className={eyebrow ? "mt-4 max-w-2xl" : "max-w-2xl"}>
          {heading}
        </Heading>
      ) : null}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {normalTitle && normal.length > 0 ? (
          <div className="rounded-[4px] border border-[var(--dvn-line-soft)] bg-white p-6">
            <h3 className="flex items-center gap-3 font-serif text-lg text-ink">
              <CardIcon kind="check" />
              {normalTitle}
            </h3>
            <ul className="mt-4 space-y-2">
              {normal.map((item, index) => (
                <li key={`${index}-${item}`} className="font-sans text-sm text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {urgentTitle && urgent.length > 0 ? (
          <div className="rounded-[4px] border border-[var(--dvn-line-gold)] bg-white p-6">
            <h3 className="flex items-center gap-3 font-serif text-lg text-ink">
              <CardIcon kind="bell" />
              {urgentTitle}
            </h3>
            <ul className="mt-4 space-y-2">
              {urgent.map((item, index) => (
                <li key={`${index}-${item}`} className="font-sans text-sm text-ink/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      {contact ? <p className="mt-6 font-sans text-sm text-ink/70">{contact}</p> : null}
    </Section>
  );
}
