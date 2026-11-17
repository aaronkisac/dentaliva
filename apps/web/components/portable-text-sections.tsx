import { Container } from "@dentaliva/ui";

import type { PortableBlock } from "../src/content/blog";
import { renderChildren } from "./portable-text";

/**
 * DSN-93: PortableText gövdesi için editoryal bant düzeni (şube detay
 * sayfası). Veri bulgusu: üç şubenin gövdesi de 1 h2 (SEO anahtar satırı)
 * + h3 bölümlerden oluşur — bu yüzden şube splitAt="h3" geçer: h3'lerde
 * bölünen gruplar, dönüşümlü beyaz/fildişi tam genişlik bantlara basılır
 * (sol rafta altın serif sayaç 01… + serif navy başlık — DSN-92 hekim CV
 * dili); banttan önceki h2 + paragraflar intro olarak (h2 serif büyük
 * başlık + lead paragraflar) gelir. Varsayılan splitAt="h2" (genel desen).
 * Blog detay bilinçli olarak düz PortableText okuma kolonunda kalır.
 */

export interface BlockGroup {
  /** Bölümü açan başlık bloğu — null ise intro grubu (ilk başlık öncesi). */
  heading: PortableBlock | null;
  children: PortableBlock[];
}

/** Bir bloğun düz metni — başlık gruplaması ve testler için. */
export function blockText(block: PortableBlock): string {
  return (block.children ?? [])
    .map((child) => child.text ?? "")
    .join(" ")
    .trim();
}

/** Blokları verilen başlık stilinde (h2|h3) kesimlere ayırır — saf. */
export function groupBlocksByHeading(blocks: PortableBlock[], splitAt = "h2"): BlockGroup[] {
  const groups: BlockGroup[] = [];
  for (const block of blocks) {
    if (block._type !== "block") continue;
    if (block.style === splitAt) {
      groups.push({ heading: block, children: [] });
      continue;
    }
    const last = groups[groups.length - 1];
    if (last) last.children.push(block);
    else groups.push({ heading: null, children: [block] });
  }
  // Başlıksız ve içeriksiz grup akışa girmez.
  return groups.filter((group) => group.heading || group.children.length > 0);
}

function GroupContent({ children }: { children: PortableBlock[] }) {
  return (
    <div className="max-w-3xl space-y-5">
      {children.map((block) => {
        if (block._type !== "block") return null;
        if (block.style === "h3") {
          return (
            <h3
              key={block._key}
              className="font-serif text-[length:var(--dvn-text-title-size)] text-navy"
            >
              {renderChildren(block)}
            </h3>
          );
        }
        if (block.style === "h2") {
          return (
            <h3
              key={block._key}
              className="mt-6 font-serif text-[length:var(--dvn-text-title-size)] text-navy"
            >
              {renderChildren(block)}
            </h3>
          );
        }
        return (
          <p key={block._key} className="leading-[var(--dvn-text-body-lh)] text-ink/80">
            {renderChildren(block)}
          </p>
        );
      })}
    </div>
  );
}

export function PortableTextSections({
  blocks,
  splitAt = "h2",
}: {
  blocks?: PortableBlock[];
  /** Bant kesim başlık stili — şube gövdesi (1 h2 + h3 bölümler) "h3". */
  splitAt?: "h2" | "h3";
}) {
  if (!blocks || blocks.length === 0) return null;
  const groups = groupBlocksByHeading(blocks, splitAt);
  const intro = groups[0]?.heading === null ? groups[0] : null;
  const sections = groups.filter((group) => group.heading !== null);

  return (
    <div>
      {intro && intro.children.length > 0 ? (
        <Container className="pb-[var(--dvn-section-y)] md:pb-[var(--dvn-section-y-md)]">
          <div className="max-w-3xl space-y-5">
            {intro.children.map((block) => {
              if (block._type !== "block") return null;
              if (block.style === splitAt || block.style === "h2") {
                // Intro'daki başlık (şubede SEO satırı) — serif büyük başlık.
                return (
                  <h2
                    key={block._key}
                    className="font-serif [text-wrap:balance] text-[length:var(--dvn-text-display-md-size)] leading-[var(--dvn-text-display-md-lh)] text-navy"
                  >
                    {renderChildren(block)}
                  </h2>
                );
              }
              return (
                <p key={block._key} className="leading-[var(--dvn-text-body-lh)] text-ink/80">
                  {renderChildren(block)}
                </p>
              );
            })}
          </div>
        </Container>
      ) : null}
      {sections.map((group, index) => {
        const HeadingTag = splitAt === "h3" ? "h3" : "h2";
        return (
          <section
            key={group.heading!._key ?? index}
            className={index % 2 === 0 ? "bg-white" : "bg-ivory"}
          >
            <Container className="py-[var(--dvn-section-y)] md:py-[var(--dvn-section-y-md)]">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-12">
                <div>
                  <span aria-hidden="true" className="font-serif text-sm text-gold-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <HeadingTag className="mt-2 font-serif text-2xl leading-snug text-navy [text-wrap:balance]">
                    {renderChildren(group.heading!)}
                  </HeadingTag>
                </div>
                {group.children.length > 0 ? <GroupContent>{group.children}</GroupContent> : null}
              </div>
            </Container>
          </section>
        );
      })}
    </div>
  );
}
