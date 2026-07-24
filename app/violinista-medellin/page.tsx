import type { Metadata, Viewport } from "next";
import ServicePage, { F, type ServiceConfig } from "../components/ServicePage";

const U = "/uploads/";
const PATH = "/violinista-medellin";

export const metadata: Metadata = {
  title: "Violinista Medellín — Meli Rox | Voz y Violín Eléctrico en Vivo",
  description:
    "Meli Rox, violinista eléctrica y cantante en Medellín. Música en vivo para bodas, fiestas de 15, eventos corporativos, conciertos y experiencias personalizadas. Más de 10 años y presencia en televisión.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://melirox.com" + PATH,
    siteName: "Meli Rox",
    title: "Violinista en Medellín | Meli Rox",
    description: "Voz, violín eléctrico y música original en vivo en Medellín — bodas, fiestas de 15, eventos y conciertos.",
    images: [{ url: "/Vids/posters/violin.jpg", width: 1200, height: 630, alt: "Meli Rox — violinista en Medellín" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

const cfg: ServiceConfig = {
  path: PATH,
  waMsg: "Hola, quisiera conocer las opciones y disponibilidad para contratar a Meli Rox como violinista en Medellín.",
  headerCta: "Cotiza tu evento",
  eyebrow: "Violinista · Medellín",
  h1Pre: "La violinista ",
  h1Em: "de Medellín.",
  heroImg: F + "DVR_0507.jpg",
  heroPos: "50% 18%",
  heroSub: "Voz, violín eléctrico y música original en vivo — donde la elegancia clásica se encuentra con la energía contemporánea.",
  ctaPrimary: "Consultar disponibilidad",
  stats: [
    { n: "+10", l: "Años en escena" },
    { n: "En TV", l: "Televisión nacional" },
    { n: "#1", l: "En La X 103.9" },
    { n: "5 países", l: "Colombia · EE.UU. · Europa" },
  ],
  statementEyebrow: "Una sola artista",
  statementPre: "No es solo una violinista. ",
  statementEm: "Es una experiencia.",
  statementBody:
    "Meli Rox une voz, violín eléctrico y música original en una experiencia que va de la elegancia clásica a la energía del Afro House. Cantautora y violinista de Medellín, con más de una década en escenarios de Colombia y el exterior, y presencia en radio y televisión nacional.",
  momentsImg: F + "Meli%20violin%20(1).jpeg",
  momentsPos: "50% 18%",
  momentsTitle: "Una violinista para cada momento.",
  moments: [
    { t: "Clásico y crossover", d: "De la elegancia de una ceremonia a las versiones que todos reconocen — voz y violín con repertorio personalizado." },
    { t: "Violín eléctrico y electrónica", d: "Afro House, música original y energía en vivo para encender la pista y los grandes escenarios." },
    { t: "Voz en vivo", d: "Cantante y violinista en una sola artista — una propuesta que la distingue en Medellín." },
  ],
  momentsCta: "Cotizar mi evento",
  video: "/Vids/violin.mp4",
  videoPoster: "/Vids/posters/violin.jpg",
  galleryTitle: "En vivo.",
  gallery: [
    { src: F + "IMG_2501.jpg", alt: "Meli Rox tocando violín eléctrico en un festival" },
    { src: F + "wedding1.jpg", alt: "Meli Rox violinista en un evento" },
    { src: F + "IMG_1922.JPG", alt: "Meli Rox violinista en Medellín" },
    { src: F + "DSC08345.jpg", alt: "Retrato de Meli Rox, violinista y cantante" },
  ],
  servicesTitle: "Cada evento merece su propia energía.",
  servicesGrid: [
    { href: "/violinista-para-bodas-medellin", label: "Bodas", sub: "Violinista para ceremonia, cóctel y recepción.", img: F + "wedding.jpg", pos: "50% 28%" },
    { href: "/musica-para-fiestas-de-15-medellin", label: "Fiestas de 15", sub: "Entrada especial, alas LED y canción personalizada.", img: F + "IMG_1922.JPG", pos: "50% 34%" },
    { href: "/musica-eventos-corporativos-medellin", label: "Eventos corporativos", sub: "Galas, lanzamientos y activaciones de alto impacto.", img: U + "corporate-5250.jpg", pos: "50% 30%" },
    { href: "/violinista-eventos-privados-medellin", label: "Eventos privados", sub: "Cumpleaños, aniversarios, propuestas y cenas.", img: F + "IMG_6812.JPG", pos: "50% 18%" },
    { href: "/violinista-electrica-medellin", label: "Conciertos y festivales", sub: "Violín eléctrico, Afro House y colaboraciones con DJs.", img: F + "IMG_2471.jpg", pos: "50% 30%" },
  ],
  faq: [
    { q: "¿Qué estilos toca Meli Rox?", a: "Un repertorio que va de lo clásico y el crossover (pop, baladas, versiones reconocidas) al violín eléctrico con electrónica y Afro House, además de su música original. Voz y violín en una misma presentación." },
    { q: "¿En qué zonas de Medellín se presenta?", a: "En Medellín y todo el Valle de Aburrá — El Poblado, Laureles, Envigado, Sabaneta, Rionegro — y en el resto de Antioquia y Colombia. También realiza eventos fuera de la ciudad y bodas destino." },
    { q: "¿Para qué tipo de eventos?", a: "Bodas, fiestas de 15, eventos corporativos, eventos privados, conciertos y festivales. Cada presentación se diseña a la medida de la ocasión." },
    { q: "¿Toca sola o con banda?", a: "Desde formato solista (voz y violín eléctrico) hasta ensambles con banda en vivo, DJs y artistas invitados, según el evento." },
    { q: "¿Cómo consulto disponibilidad y precios?", a: "Escríbenos por WhatsApp con la fecha, la ciudad y el tipo de evento y te enviamos disponibilidad y una propuesta a la medida." },
  ],
  ctaImg: F + "DVR_0490.jpg",
  ctaPos: "50% 20%",
  ctaTitlePre: "Lleva su música ",
  ctaTitleEm: "a tu evento.",
  ctaBody: "Cuéntanos la fecha, la ciudad y el tipo de evento y recibe una propuesta a la medida.",
  serviceName: "Violinista y cantante en Medellín — Meli Rox",
  serviceType: "Violinista y cantante para eventos",
  serviceDesc: "Voz y violín eléctrico en vivo en Medellín para bodas, fiestas de 15, eventos corporativos, conciertos y experiencias personalizadas.",
  breadcrumbName: "Violinista en Medellín",
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
