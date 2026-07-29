import type { Metadata } from "next";
import { exigirAuth } from "@/app/lib/panel/auth";
import Editar from "./Editar";

// Meli's private tool: type the prices, copy the link, send it on WhatsApp.
export const metadata: Metadata = {
  title: "Editar propuesta — Fiesta de 15 | Meli Rox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Herramienta privada: exige la sesión del panel. Antes cualquiera con la URL
// podía abrirla.
export default async function Page() {
  await exigirAuth();
  return <Editar />;
}
