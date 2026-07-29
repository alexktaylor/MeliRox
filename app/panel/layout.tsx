import type { Metadata, Viewport } from "next";
import "./panel.css";

// Herramienta privada de Meli — fuera de Google y del sitemap.
export const metadata: Metadata = {
  title: "Mis leads — Meli Rox",
  robots: { index: false, follow: false, nocache: true },
  // Al agregarlo a la pantalla de inicio del iPhone abre sin barras del navegador.
  appleWebApp: { capable: true, title: "Leads", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Sin maximumScale: bloquear el zoom rompe la accesibilidad. Los inputs ya usan
  // 16px, que es lo que evita el zoom automático de Safari al enfocar.
  themeColor: "#0b0a08",
  viewportFit: "cover",
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <div className="mp">{children}</div>;
}
