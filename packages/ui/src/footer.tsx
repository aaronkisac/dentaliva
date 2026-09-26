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

/** Site footer: NAP block, link columns, socials, copyright (CMS-driven). */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  { columns, contact, social, copyright, className, ...rest },
  ref,
) {
  return (
    <footer ref={ref} className={cn("bg-navy text-white", className)} {...rest}>
      <div className="mx-auto grid max-w-[var(--dvn-container-max)] gap-10 px-[var(--dvn-container-gutter)] py-14 md:grid-cols-4">
        <div>
          <h2 className="font-serif text-[length:var(--dvn-text-title-size)] text-gold-soft">
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
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="font-serif text-[length:var(--dvn-text-title-size)] text-gold-soft">
              {column.title}
            </h2>
            <ul className="mt-3 space-y-2 font-sans text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold-soft">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="font-serif text-[length:var(--dvn-text-title-size)] text-gold-soft">
            Bizi takip edin
          </h2>
          <ul className="mt-3 space-y-2 font-sans text-sm">
            {social.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold-soft">
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
