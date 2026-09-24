import "./globals.css";

export const metadata = {
  title: "Dentaliva",
  description: "Dental clinic in Istanbul",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
