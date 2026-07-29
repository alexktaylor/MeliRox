"use client";

import { useState } from "react";
import Link from "next/link";
import { SERVICE_LINKS, HUB_LINK } from "@/app/components/serviceLinks";

const SITIO = "https://melirox.com";

/**
 * Herramientas con las que Meli arma algo para un cliente. Se marca qué produce
 * cada una — un link o un PDF — porque es justo lo que se confunde: la de 15 da
 * una página para mandar, las otras dos dan un archivo.
 */
const CREAR: {
  href: string;
  titulo: string;
  para: string;
  produce: "link" | "pdf";
  nota: string;
}[] = [
  {
    href: "/propuesta/15/editar",
    titulo: "Propuesta de 15",
    para: "Fiestas de 15 años",
    produce: "link",
    nota: "Escribe el nombre y los precios, copia el link y mándalo por WhatsApp.",
  },
  {
    href: "/propuesta/empresarial",
    titulo: "Propuesta empresarial",
    para: "Empresas y eventos corporativos",
    produce: "pdf",
    nota: "Arma la propuesta, ajusta los músicos y descarga el PDF.",
  },
  {
    href: "/contrato",
    titulo: "Contrato",
    para: "Cualquier evento ya confirmado",
    produce: "pdf",
    nota: "Llena los datos del cliente y descarga el PDF para firmar.",
  },
];

const COMPARTIR = [HUB_LINK, ...SERVICE_LINKS];

export default function Herramientas() {
  const [copiado, setCopiado] = useState<string | null>(null);

  async function copiar(href: string) {
    const url = SITIO + href;
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(href);
      window.setTimeout(() => setCopiado((c) => (c === href ? null : c)), 1800);
    } catch {
      // Safari sin permiso de portapapeles: al menos se lo mostramos para copiar a mano.
      window.prompt("Copia el link:", url);
    }
  }

  return (
    <>
      <header className="mp-header">
        <div className="mp-brand">
          <Link href="/panel" className="mp-volver" aria-label="Volver a mis leads">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <h1>Herramientas</h1>
            <span className="eyebrow">Meli Rox</span>
          </div>
        </div>
      </header>

      <section className="hr-seccion">
        <h2 className="hr-titulo">Crear para un cliente</h2>
        <div className="hr-lista">
          {CREAR.map((h) => (
            <a key={h.href} href={h.href} className="hr-card">
              <div className="hr-card-top">
                <span className="hr-card-nombre">{h.titulo}</span>
                <span className={`hr-badge hr-badge--${h.produce}`}>
                  {h.produce === "link" ? "Da un link" : "Da un PDF"}
                </span>
              </div>
              <span className="hr-card-para">{h.para}</span>
              <span className="hr-card-nota">{h.nota}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="hr-seccion">
        <h2 className="hr-titulo">Páginas para compartir</h2>
        <p className="hr-sub">
          Tus páginas públicas — copia el link y mándalo a un cliente o a un lugar.
        </p>
        <div className="hr-links">
          {COMPARTIR.map((l) => (
            <div key={l.href} className="hr-link">
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="hr-link-nombre">
                {l.es}
                <span className="hr-link-url">melirox.com{l.href}</span>
              </a>
              <button
                type="button"
                className={`hr-copiar${copiado === l.href ? " is-ok" : ""}`}
                onClick={() => copiar(l.href)}
              >
                {copiado === l.href ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
