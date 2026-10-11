import Image from "next/image";
import { Fragment } from "react";

import { Heading, Section, Text } from "@dentaliva/ui";
import { pickLocalized } from "@dentaliva/sanity-schema/client";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";

export interface AboutData {
  title?: { tr?: string; en?: string };
  body?: { tr?: string; en?: string };
  benefits?: Array<{ tr?: string; en?: string }>;
  image?: { asset?: { _ref?: string }; alt?: { tr?: string; en?: string }; lqip?: string };
}

export interface AboutStat {
  value?: string;
  label?: { tr?: string; en?: string };
}

const ENV = imageTarget();

/**
 * DSN-52: about — ReoDental benefits kompozisyonunun bizim dilimizdeki
 * karşılığı: solda fotoğraf kartı, alt kenarda navy scrim üzerinde
 * istatistik rozetleri (kanıt yüzeyi — DSN-46 galeri bandının yeni evi);
 * sağda başlık + açıklama + numaralı fayda listesi (serif altın
 * numaralar — ikon-daire kalıbı bilinçli yok). Faydalar ve istatistikler
 * CMS'ten; boş parçalar gizlenir, about yine render edilir.
 */
export function AboutSection({
  data,
  stats,
  tone = "light",
}: {
  data: AboutData | null;
  stats?: AboutStat[];
  /** DSN-52: ana sayfa denemesi koyu zeminde; hakkımızda sayfası açık kalır. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  if (!data) return null;
  const ref = data.image?.asset?._ref;
  // Copy sweep: başlık yalnızca CMS'ten — fallback copy yok.
  const title = pickLocalized(data.title);
  const body = pickLocalized(data.body);
  const benefits = (data.benefits ?? []).map((item) => pickLocalized(item)).filter(Boolean);
  const visibleStats = (stats ?? []).filter((stat) => stat.value).slice(0, 2);
  return (
    <Section className={dark ? "bg-navy text-white" : "bg-white"}>
      <div className="grid items-center gap-10 md:grid-cols-2">
        {ref ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-[var(--dvn-line-gold)]">
            <Image
              src={ref}
              alt={pickLocalized(data.image?.alt) ?? title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={data.image?.lqip ?? lqipUrl(ref, ENV)}
              className="object-cover"
            />
            {visibleStats.length > 0 ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 via-navy/60 to-transparent px-5 pb-4 pt-12">
                <div className="flex items-center gap-5">
                  {visibleStats.map((stat, i) => (
                    <Fragment key={`${stat.value}-${i}`}>
                      {i > 0 ? <span aria-hidden="true" className="h-9 w-px bg-white/30" /> : null}
                      <div>
                        <p className="font-serif text-2xl text-gold-soft">{stat.value}</p>
                        <p className="font-sans text-xs uppercase tracking-widest text-white/80">
                          {pickLocalized(stat.label)}
                        </p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <div>
          {title ? (
            <Heading level="h2" size="md" className={dark ? "text-white" : undefined}>
              {title}
            </Heading>
          ) : null}
          {body ? (
            <Text className={dark ? "mt-4 max-w-3xl text-white/80" : "mt-4 max-w-3xl"}>{body}</Text>
          ) : null}
          {benefits.length > 0 ? (
            <ul
              className={`mt-8 divide-y ${
                dark ? "divide-white/15" : "divide-[var(--dvn-line-soft)]"
              }`}
            >
              {benefits.map((benefit, i) => (
                <li key={`${i}-${benefit}`} className="flex items-baseline gap-3 py-3">
                  <span
                    aria-hidden="true"
                    className={`font-serif text-sm ${dark ? "text-gold-soft" : "text-gold-deep"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Text className={dark ? "text-white/90" : undefined}>{benefit}</Text>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
