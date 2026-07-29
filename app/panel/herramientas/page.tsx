import type { Metadata } from "next";
import { exigirAuth } from "@/app/lib/panel/auth";
import Herramientas from "./Herramientas";

export const metadata: Metadata = {
  title: "Herramientas — Meli Rox",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function HerramientasPage() {
  await exigirAuth();
  return <Herramientas />;
}
