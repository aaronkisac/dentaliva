import { Heading, Section } from "@dentaliva/ui";
import { t } from "../../src/i18n";

import type { LocalizedPair } from "../../src/content/home";

/**
 * DSN-66: strateji dokümanı #10 TRAVEL + STAY — uluslararası hastanın
 * lojistik itirazlarını çözen planlama bölümü. Doküman kuralı: paket
 * görselleri yerine kapsam bilgisi; "ücretsiz/hediye" dili yok, dahil-hariç
 * yazılı olarak. Check-list CMS'ten; boşsa bölüm render edilmez.
 */
export function TravelStaySection({
  data,
  eyebrow,
  heading,
}: {
  data: { checklist?: LocalizedPair[] } | null;
  eyebrow?: string;
  heading?: string;
}) {
  const items = (data?.checklist ?? [])
    .map((item) => t(item))
    .filter(Boolean)
    .slice(0, 8);
  if (!data || items.length === 0) return null;
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
        </div>
        <ul className="divide-y divide-[var(--dvn-line-soft)] border-y border-[var(--dvn-line-soft)]">
          {items.map((item, index) => (
            <li key={`${index}-${item}`} className="flex items-baseline gap-3 py-3">
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
 * DSN-66: strateji dokümanı #11 AFTERCARE — tedavi sonrası güven ve komplikasyon
 * planının görünür kılması. Normal iyileşme belirtileri ile dikkat gerektiren
 * belirtiler ayrı kartlarda (doküman: acil/normal ayrımı); iletişim rotası
 * notu CMS'ten. "24/7" ve garanti dili bilinçli yok — yalnız operasyonel
 * doğrulamayla kullanılabilir.
 */
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
            <h3 className="font-serif text-lg text-ink">{normalTitle}</h3>
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
            <h3 className="font-serif text-lg text-ink">{urgentTitle}</h3>
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
