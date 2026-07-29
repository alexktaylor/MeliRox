import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // Herramientas y propuestas privadas de Meli. Todas llevan noindex por página;
    // esto evita incluso el rastreo. /propuesta cubre las propuestas de cliente
    // (que son privadas aunque se abran sin contraseña) y sus editores.
    rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/contrato", "/propuesta"] },
    sitemap: "https://melirox.com/sitemap.xml",
    host: "https://melirox.com",
  };
}
