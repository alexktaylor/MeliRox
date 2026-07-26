// Single source of truth for the 5 event/service pages (nav dropdown, footer, etc.)
export type ServiceLink = { href: string; es: string; en: string };

export const SERVICE_LINKS: ServiceLink[] = [
  { href: "/serenata", es: "Serenatas", en: "Serenades" },
  { href: "/violinista-para-bodas-medellin", es: "Bodas", en: "Weddings" },
  { href: "/musica-para-fiestas-de-15-medellin", es: "Fiestas de 15", en: "Quinceañeras" },
  { href: "/musica-eventos-corporativos-medellin", es: "Eventos corporativos", en: "Corporate events" },
  { href: "/violinista-eventos-privados-medellin", es: "Eventos privados", en: "Private events" },
  { href: "/violinista-electrica-medellin", es: "Conciertos y festivales", en: "Concerts & festivals" },
];

export const HUB_LINK: ServiceLink = {
  href: "/violinista-medellin",
  es: "Violinista en Medellín",
  en: "Violinist in Medellín",
};
