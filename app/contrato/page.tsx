import type { Metadata } from "next";
import Contrato from "./Contrato";

// Private tool for Meli — fills a contract per client, prints/saves PDF. Kept out of Google.
export const metadata: Metadata = {
  title: "Contrato — Meli Rox",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Contrato />;
}
