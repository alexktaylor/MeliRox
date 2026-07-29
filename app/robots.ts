import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // Las herramientas privadas de Meli (panel de leads, generador de contratos)
    // también llevan noindex por página; esto evita incluso el rastreo.
    rules: { userAgent: "*", allow: "/", disallow: ["/panel", "/contrato"] },
    sitemap: "https://melirox.com/sitemap.xml",
    host: "https://melirox.com",
  };
}
