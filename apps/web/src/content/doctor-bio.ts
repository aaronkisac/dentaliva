/**
 * DSN-92: hekim biyosu ayrıştırıcısı — CMS'teki düz metin (doctor.bio)
 * yapılandırılmış CV bölümlerine çevrilir. Kaynak metin legacy migrasyondan
 * gelir ve alt başlıklar da "- " maddesi olarak düzleşmiştir:
 *
 *   Ünvan: Diş Hekimi
 *   Eğitim:
 *   - Lisans : İstanbul Üniversitesi …
 *   - Yayınlar            ← başlık (madde kılığında)
 *   - ”A Demographic …”
 *   - Adres 1: Başakşehir …
 *
 * Deterministik ve saf: <2 bölüm tanınırsa null döner — çağıran eski düz
 * metin render'ına düşer (19 hekim güvenli; EN/NL biyoları etkilenmez).
 */

export interface BioItem {
  /** "Lisans", "Doktora", "Adres 1" gibi kısa etiket — yoksa düz madde. */
  label?: string;
  text: string;
}

export interface BioSection {
  heading: string;
  items: BioItem[];
}

export interface ParsedBio {
  /** "Ünvan:" satırının değeri — hero unvanıyla aynıysa çağıran basmaz. */
  title?: string;
  sections: BioSection[];
}

const lower = (value: string) => value.toLocaleLowerCase("tr");

/** Madde kılığındaki başlıklar — satır başı anahtar kelimeleri (tr-lower). */
const HEADING_PREFIXES = [
  "yayın",
  "üyelik",
  "katılınan",
  "sertifika",
  "kurslar",
  "kongre",
  "proje",
  "doktora tez",
  "ödül",
  "uzmanlık alan",
  "mesleki",
  "deneyim",
  "ilgi alan",
  "bilimsel",
  "yabancı dil",
  "seminer",
  "sempozyum",
  "eğitim",
];

/** "Lisans: …" / "- Lisans:" + sonraki satır → etiketli madde. */
const LABELS = ["yüksek lisans", "ön lisans", "lisans", "doktora", "uzmanlık", "lise", "master"];

function stripDash(line: string): string | null {
  const match = line.match(/^[-–•]\s*(.*)$/);
  return match ? (match[1] ?? "").trim() : null;
}

function labelOf(content: string): { label: string; rest: string } | null {
  const colon = content.indexOf(":");
  if (colon < 0) return null;
  const head = lower(content.slice(0, colon).trim());
  if (!LABELS.includes(head)) return null;
  return { label: content.slice(0, colon).trim(), rest: content.slice(colon + 1).trim() };
}

function isHeading(content: string): boolean {
  if (content.length > 70) return false;
  const trimmed = content.replace(/:\s*$/, "").trim();
  if (!trimmed) return false;
  // "Projelerde Yaptığı Görevler:" — değer taşımayan iki nokta ile biten satır.
  if (content.endsWith(":") && !labelOf(content)) return true;
  const head = lower(trimmed);
  const words = trimmed.split(/\s+/).length;
  return words <= 7 && HEADING_PREFIXES.some((prefix) => head.startsWith(prefix));
}

function afterColon(content: string): string {
  const colon = content.indexOf(":");
  return colon < 0 ? content : content.slice(colon + 1).trim();
}

export function parseDoctorBio(bio: string | null | undefined): ParsedBio | null {
  if (!bio) return null;
  const lines = bio
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let title: string | undefined;
  const sections: BioSection[] = [];
  const addresses: BioItem[] = [];
  let current: BioSection | null = null;
  let pendingLabel: string | null = null;

  const open = (heading: string) => {
    current = { heading: heading.replace(/:\s*$/, "").trim(), items: [] };
    sections.push(current);
    pendingLabel = null;
  };

  for (const line of lines) {
    if (lower(line).startsWith("ünvan") && line.includes(":")) {
      title = afterColon(line);
      continue;
    }

    const dashed = stripDash(line);
    const content = dashed ?? line;

    const address = lower(content).match(/^adres\s*(\d*)\s*:/);
    if (address) {
      const number = address[1] ?? "";
      addresses.push({
        label: number ? `Adres ${number}` : "Adres",
        text: afterColon(content),
      });
      continue;
    }

    const labeled = labelOf(content);
    if (labeled) {
      // "- Lisans:" (değersiz) → etiketi bir sonraki madde taşır.
      if (!labeled.rest) {
        pendingLabel = labeled.label;
        continue;
      }
      if (!current) open("Eğitim");
      current!.items.push({ label: labeled.label, text: labeled.rest });
      pendingLabel = null;
      continue;
    }

    if (isHeading(content)) {
      open(content);
      continue;
    }

    if (!current) open("Özgeçmiş");
    current!.items.push(pendingLabel ? { label: pendingLabel, text: content } : { text: content });
    pendingLabel = null;
  }

  const filled = sections.filter((section) => section.items.length > 0);
  if (addresses.length > 0) {
    filled.push({ heading: addresses.length > 1 ? "Adresler" : "Adres", items: addresses });
  }
  if (filled.length < 2) return null;
  return { title, sections: filled };
}
