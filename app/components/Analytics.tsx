"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import LeadTracker from "./LeadTracker";

/**
 * Rutas privadas de Meli: no llevan analítica.
 *
 * El panel y sus herramientas viven dentro del layout raíz, así que heredaban
 * GA4 y el LeadTracker. Como la lista de leads tiene un botón de WhatsApp por
 * cliente, cada vez que Meli le escribía a alguien se registraba un
 * `generate_lead` nuevo — un mensaje SALIENTE contado como lead entrante. Eso
 * inflaba las conversiones y, al ser visitas suyas, se las cargaba a "Direct".
 *
 * /propuesta/15 NO está acá a propósito: esa la abren las clientas con el link
 * que Meli les manda, y que toquen WhatsApp ahí sí es un lead de verdad.
 */
const PRIVADAS = [
  "/panel",
  "/contrato",
  "/propuesta/15/editar",
  "/propuesta/empresarial",
];

function esPrivada(pathname: string): boolean {
  return PRIVADAS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export default function Analytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  // En las rutas privadas no se carga gtag ni se escuchan clics: no se envía nada.
  if (esPrivada(pathname)) return null;

  return (
    <>
      <LeadTracker />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
