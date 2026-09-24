import type { Metadata } from "next";

import "./globals.css";
import { fontVariables } from "../src-fonts";

export const metadata: Metadata = {
  title: "Dentaliva",
  description: "Dental clinic in Istanbul",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={fontVariables}>
      <body className="bg-ivory text-ink antialiased">{children}</body>
    </html>
  );
}
