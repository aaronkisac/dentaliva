// Visual smoke page for the token set (DSN-1 acceptance).
import { contrastPairs, color } from "@dentaliva/tokens";

const swatches = Object.entries(color);

export const metadata = { title: "Dentaliva · Tokens" };

export default function TokensPage() {
  return (
    <main className="mx-auto max-w-[var(--dvn-container-max)] px-[var(--dvn-container-gutter)] py-16">
      <h1 className="font-serif text-[var(--dvn-text-display-lg-size)] text-navy">Design tokens</h1>
      <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {swatches.map(([name, hex]) => (
          <div key={name} className="border border-[var(--dvn-line-gold)] p-3">
            <div className="h-16 w-full" style={{ backgroundColor: hex }} />
            <p className="mt-2 text-sm text-ink">{name}</p>
            <p className="text-xs text-muted">{hex}</p>
          </div>
        ))}
      </section>
      <section className="mt-12">
        <h2 className="font-serif text-[var(--dvn-text-display-md-size)] text-navy">
          Approved contrast pairs
        </h2>
        <ul className="mt-4 space-y-2">
          {contrastPairs.map((pair) => (
            <li
              key={pair.usage}
              className="flex items-center justify-between border border-[var(--dvn-line-soft)] px-4 py-2"
            >
              <span
                style={{ color: pair.fg, backgroundColor: pair.bg }}
                className="px-2 py-1 text-sm"
              >
                {pair.fg} on {pair.bg}
              </span>
              <span className="text-sm text-muted">
                {pair.usage} · min {pair.min}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
