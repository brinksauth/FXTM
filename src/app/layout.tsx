import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FXTM Mining Investment Company",
  description: "Gestiona tu portafolio de inversión desde un panel privado, seguro y moderno.",
  keywords: ["FXTM", "Mining", "Inversion", "Portafolio"],
  authors: [{ name: "JULIO QUINTERO DAZA" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className="h-full">
      <body className="bg-bg-main text-foreground font-sans antialiased min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
