import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "./cn";
import { Link } from "./link";

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export interface FooterContact {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  columns: FooterColumn[];
  contact: FooterContact;
  social: Array<{ label: string; href: string }>;
  copyright: string;
}

function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const key = platform.toLowerCase();
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: cn("h-4 w-4", className),
  } as const;
  if (key.includes("instagram")) {
    return (
      <svg {...common}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (key.includes("facebook")) {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (key.includes("youtube")) {
    return (
      <svg {...common}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    );
  }
  return null;
}

/** Site footer: NAP block, link columns, socials, copyright (CMS-driven). */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { columns, contact, social, copyright, className, ...rest },
  ref,
) {
  // DSN-34: tek linkli nav sütunları tek düz listeye indirgenir (href dedupe).
  const seen = new Set<string>();
  const links: FooterColumn["links"] = [];
  for (const column of columns) {
    for (const link of column.links) {
      if (!seen.has(link.href)) {
        seen.add(link.href);
        links.push(link);
      }
    }
  }

  return (
    <footer ref={ref} className={cn("bg-navy text-white", className)} {...rest}>
      <div className="mx-auto grid max-w-[var(--dvn-container-max)] gap-10 px-[var(--dvn-container-gutter)] py-14 md:grid-cols-3">
        <div>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center bg-gold font-serif text-xl font-bold text-navy"
          >
            D
          </span>
          <h2 className="mt-6 font-serif text-[length:var(--dvn-text-title-size)] text-gold-soft">
            İletişim
          </h2>
          <address className="mt-3 space-y-2 font-sans text-sm not-italic">
            {/* Render the anchor only when a value exists — an empty tel:/mailto:
                link has no accessible name (axe link-name) and dials nothing. */}
            {contact.phone ? (
              <a href={`tel:${contact.phone}`} className="block hover:text-gold-soft">
                {contact.phone}
              </a>
            ) : null}
            {contact.email ? (
              <a href={`mailto:${contact.email}`} className="block hover:text-gold-soft">
                {contact.email}
              </a>
            ) : null}
            {contact.address ? <p>{contact.address}</p> : null}
            {contact.hours ? <p className="text-gold-soft">{contact.hours}</p> : null}
          </address>
        </div>
        <div>
          <h2 className="font-serif text-[length:var(--dvn-text-title-size)] text-gold-soft">
            Hızlı Erişim
          </h2>
          <ul className="mt-3 space-y-2 font-sans text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-soft">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-[length:var(--dvn-text-title-size)] text-gold-soft">
            Bizi takip edin
          </h2>
          <ul className="mt-3 space-y-2 font-sans text-sm">
            {social.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center gap-2 hover:text-gold-soft">
                  <SocialIcon platform={item.label} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--dvn-line-gold)] py-4 text-center font-sans text-xs">
        {copyright}
      </div>
    </footer>
  );
});
