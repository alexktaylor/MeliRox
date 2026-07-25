import type { Metadata } from "next";
import Editar from "./Editar";

// Meli's private tool: type the prices, copy the link, send it on WhatsApp.
export const metadata: Metadata = {
  title: "Editar propuesta — Fiesta de 15 | Meli Rox",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Editar />;
}
