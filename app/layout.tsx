import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://melirox.com"),
  title: "Meli Rox — Cantautora y Violinista Eléctrica | Medellín",
  description:
    "Meli Rox: cantautora, violinista eléctrica y artista en vivo en Medellín. Bodas, fiestas de 15, eventos corporativos, conciertos y experiencias musicales personalizadas.",
  openGraph: {
    title: "Meli Rox — Voz, violín y energía que transforma",
    description:
      "Cantautora y violinista eléctrica colombiana. Presentaciones en vivo para bodas, eventos y festivales.",
    images: ["/uploads/drive-download-20260714T181149Z-1-001/DVR_0454.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Manrope:wght@200;300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
