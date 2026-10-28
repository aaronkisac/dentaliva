import Image from "next/image";

import { Heading, Link, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";
import { lqipUrl } from "@dentaliva/sanity-schema/image-url";

import { imageTarget } from "../../src/image-target";
import { routes } from "../../src/routes";
import type { BranchItem } from "../../src/content/branches";

const ENV = imageTarget();

/**
 * DSN-67: strateji dokümanı #13 WHY THREE CLINICS MATTER — üç lokasyonu
 * "yarışan mağazalar" değil, bakım altyapısı olarak anlatan bölüm.
 * Şube dokümanlarından (SUBE-1 fotoğraflı kart dili) 3 kart + İstanbul
 * bağlam metni; kartlar şube detayına gider. Doküman kuralı: "hangi tedavi
 * hangi şubede" CMS verisiyle doğrulanmadan iddia edilmez — kart yalnızca
 * lokasyon bilgisi verir, tedavi eşleşmesi bilinçli kapsam dışı.
 * Başlıklar siteCopy'den; şube yoksa bölüm render edilmez.
 */
export function ClinicsSection({
  branches,
  eyebrow,
  heading,
  intro,
}: {
  branches: BranchItem[];
  eyebrow?: string;
  heading?: string;
  intro?: string;
}) {
  if (branches.length === 0) return null;
  return (
    <Section>
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
      {intro ? <p className="mt-4 max-w-3xl font-sans text-lg text-ink/70">{intro}</p> : null}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {branches.slice(0, 3).map((branch) => {
          const address = t(branch.address);
          const card = (
            <>
              {branch.image?.ref ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-navy">
                  <Image
                    src={branch.image.ref}
                    alt={t(branch.image.alt) || branch.name || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={branch.image.lqip ?? lqipUrl(branch.image.ref, ENV)}
                    className="object-cover"
                  />
                </div>
              ) : null}
              <h3 className="mt-4 font-serif text-xl text-ink">{branch.name}</h3>
              {address ? (
                <p className="mt-1 font-sans text-sm leading-relaxed text-ink/70">{address}</p>
              ) : null}
            </>
          );
          if (!branch.slug) {
            return <article key={branch.name ?? "branch"}>{card}</article>;
          }
          return (
            <Link
              key={branch.slug}
              href={routes.branch(branch.slug)}
              className="group block rounded-[4px] hover:no-underline"
            >
              {card}
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
