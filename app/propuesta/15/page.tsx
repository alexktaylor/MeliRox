import type { Metadata } from "next";
import Propuesta15 from "./Propuesta15";

// Private sales page Meli sends to leads on WhatsApp — kept out of Google on purpose.
export const metadata: Metadata = {
  title: "Propuesta Musical — Fiesta de 15 | Meli Rox",
  description: "Propuesta musical personalizada para tu fiesta de 15: show en vivo de violín y voz con Meli Rox en Medellín.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/propuesta/15" },
};

export default function Page() {
  return <Propuesta15 />;
}
