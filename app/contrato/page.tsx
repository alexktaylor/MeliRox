import type { Metadata } from "next";
import { exigirAuth } from "@/app/lib/panel/auth";
import { Great_Vibes } from "next/font/google";
import Contrato from "./Contrato";

// Signature-style font, scoped to this page only.
const signature = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-signature", display: "swap" });

// Private tool for Meli — fills a contract per client, prints/saves PDF. Kept out of Google.
export const metadata: Metadata = {
  title: "Contrato — Meli Rox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Herramienta privada: exige la sesión del panel. Antes cualquiera con la URL
// podía abrirla.
export default async function Page() {
  await exigirAuth();
  return (
    <div className={signature.variable}>
      <Contrato />
    </div>
  );
}
