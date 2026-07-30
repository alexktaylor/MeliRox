"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import LeadTracker from "./LeadTracker";

/**
 * Rutas privadas: no llevan analítica. El panel, las propuestas y los contratos.
 *
 * Dos motivos distintos:
 *
 * 1. El panel y sus herramientas viven dentro del layout raíz, así que heredaban
 *    GA4 y el LeadTracker. Como la lista de leads tiene un botón de WhatsApp por
 *    cliente, cada vez que Meli le escribía a alguien se registraba un
 *    `generate_lead` — un mensaje SALIENTE contado como lead entrante.
 *
 * 2. Las propuestas y los contratos son documentos para gente que YA es lead y
 *    con la que Meli está negociando. Contar ahí un clic de WhatsApp volvía a
 *    contar a la misma persona más abajo en el embudo. Sin eso, `generate_lead`
 *    queda siendo una sola cosa: alguien nuevo que escribe desde el sitio
 *    público. Que es justo la señal que le sirve a Google Ads.
 *
 * Los prefijos cubren todo lo que venga después (otra propuesta, una factura),
 * sin tener que volver a tocar esta lista.
 */
const PRIVADAS = ["/panel", "/contrato", "/propuesta"];

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
