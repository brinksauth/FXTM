import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto Gem | Plataforma Bitcoin Colombia",
  description: "Gestiona tu portafolio de Bitcoin en Colombia desde un panel privado, seguro y moderno.",
  keywords: ["Crypto", "Gem", "Bitcoin", "Colombia", "Inversion", "Portafolio Crypto"],
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
    <html lang="es-CO" className="h-full">
      <body className="bg-bg-main text-foreground font-sans antialiased min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
