import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import Contrato from "./Contrato";

// Signature-style font, scoped to this page only.
const signature = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-signature", display: "swap" });

// Private tool for Meli — fills a contract per client, prints/saves PDF. Kept out of Google.
export const metadata: Metadata = {
  title: "Contrato — Meli Rox",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={signature.variable}>
      <Contrato />
    </div>
  );
}
