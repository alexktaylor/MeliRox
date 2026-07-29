import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";
import Empresarial from "./Empresarial";

const signature = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-signature", display: "swap" });

// Private tool for Meli — builds a formal corporate proposal, prints/saves PDF. Out of Google.
export const metadata: Metadata = {
  title: "Propuesta Empresarial | Meli Rox",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={signature.variable}>
      <Empresarial />
    </div>
  );
}
