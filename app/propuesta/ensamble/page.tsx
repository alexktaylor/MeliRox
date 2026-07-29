import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import Ensamble from "./Ensamble";

const signature = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-signature", display: "swap" });

// Private tool for Meli — builds a formal ensemble proposal, prints/saves PDF. Out of Google.
export const metadata: Metadata = {
  title: "Propuesta — Ensamble | Meli Rox",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={signature.variable}>
      <Ensamble />
    </div>
  );
}
