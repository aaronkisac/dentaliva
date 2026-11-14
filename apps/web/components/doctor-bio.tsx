import { Text } from "@dentaliva/ui";

import { parseDoctorBio } from "../src/content/doctor-bio";

/**
 * DSN-92: hekim özgeçmişi — CMS'teki düz biyo metni editoryal CV düzeninde
 * basılır: her bölüm solda altın serif sayaç + serif başlık (DSN-52 numaralı
 * liste dili), sağda hairline ile ayrılmış satırlar; "Lisans"/"Adres 1" gibi
 * etiketler altın eyebrow tipografisinde. Yapı tanınmayan biyolarda (kısa
 * metin, EN/NL) eski düz metin render'ı aynen korunur.
 */
export function DoctorBio({
  bio,
  heroTitle,
}: {
  bio: string | null | undefined;
  /** Hero'da zaten basılan unvan — biyodaki "Ünvan:" aynıysa tekrarlanmaz. */
  heroTitle?: string | null;
}) {
  if (!bio) return null;
  const parsed = parseDoctorBio(bio);
  if (!parsed) {
    return <Text className="max-w-3xl whitespace-pre-line">{bio}</Text>;
  }

  const same = (a?: string | null, b?: string | null) =>
    (a ?? "").trim().toLocaleLowerCase("tr") === (b ?? "").trim().toLocaleLowerCase("tr");
  const lead = parsed.title && !same(parsed.title, heroTitle) ? parsed.title : null;

  return (
    <div>
      {lead ? <p className="mb-10 max-w-3xl font-serif text-2xl text-navy">{lead}</p> : null}
      <div className="border-t border-[var(--dvn-line-soft)]">
        {parsed.sections.map((section, index) => (
          <section
            key={`${index}-${section.heading}`}
            className="grid gap-4 border-b border-[var(--dvn-line-soft)] py-10 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-12"
          >
            <div>
              <span aria-hidden="true" className="font-serif text-sm text-gold-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 font-serif text-2xl leading-snug text-navy [text-wrap:balance]">
                {section.heading}
              </h2>
            </div>
            <ul className="divide-y divide-[var(--dvn-line-soft)]">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="py-3 first:pt-0 last:pb-0">
                  {item.label ? (
                    <span className="mb-1 block font-sans text-xs uppercase tracking-widest text-gold-deep">
                      {item.label}
                    </span>
                  ) : null}
                  <span className="font-sans text-base leading-relaxed text-ink/80">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
