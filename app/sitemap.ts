import type { MetadataRoute } from "next";

const SITE = "https://melirox.com";

const SERVICE_PATHS = [
  "/violinista-para-bodas-medellin",
  "/musica-para-fiestas-de-15-medellin",
  "/musica-eventos-corporativos-medellin",
  "/violinista-eventos-privados-medellin",
  "/violinista-electrica-medellin",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE, changeFrequency: "monthly", priority: 1 },
    ...SERVICE_PATHS.map((p) => ({
      url: SITE + p,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
