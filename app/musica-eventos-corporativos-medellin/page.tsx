import type { Metadata, Viewport } from "next";
import ServicePage, { F, type ServiceConfig } from "../components/ServicePage";

const U = "/uploads/";
const PATH = "/musica-eventos-corporativos-medellin";

export const metadata: Metadata = {
  title: "Música para Eventos Corporativos en Medellín — Violinista Eléctrica",
  description:
    "Meli Rox: violinista eléctrica y cantante para eventos corporativos en Medellín. Galas, lanzamientos, activaciones de marca y premiaciones con producción de alto impacto.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://melirox.com" + PATH,
    siteName: "Meli Rox",
    title: "Música para Eventos Corporativos en Medellín | Meli Rox",
    description: "Voz y violín eléctrico en vivo para galas, lanzamientos, activaciones y premiaciones — producción de alto impacto para hoteles y compañías.",
    images: [{ url: "/Vids/posters/corporate.jpg", width: 1200, height: 630, alt: "Meli Rox — música para eventos corporativos en Medellín" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

const cfg: ServiceConfig = {
  path: PATH,
  waMsg: "Hola, quisiera solicitar información para contratar a Meli Rox en un evento corporativo.",
  headerCta: "Cotiza tu evento",
  eyebrow: "Eventos corporativos en Medellín",
  h1Pre: "Música para eventos corporativos ",
  h1Em: "en Medellín",
  heroImg: U + "corporate-5250.jpg",
  heroPos: "50% 30%",
  heroSub: "Impacto visual con producción profesional — voz y violín eléctrico en vivo para galas, lanzamientos, activaciones de marca y premiaciones.",
  ctaPrimary: "Cotizar evento corporativo",
  stats: [
    { n: "+10", l: "Años en escena" },
    { n: "5 países", l: "Colombia · EE.UU. · Europa" },
    { n: "Galas", l: "Lanzamientos · Activaciones" },
    { n: "Alto impacto", l: "Hoteles y compañías" },
  ],
  statementEyebrow: "Presencia de marca",
  statementPre: "El impacto de tu evento ",
  statementEm: "empieza por lo que se escucha.",
  statementBody:
    "Con más de una década en escenarios de Colombia y el exterior, Meli Rox aporta elegancia, energía y producción de alto impacto a galas, lanzamientos y premiaciones — una experiencia musical a la altura de tu marca.",
  momentsImg: U + "IMG_5220.JPG.jpeg",
  momentsPos: "50% 28%",
  momentsTitle: "Producción a la altura de tu marca.",
  moments: [
    { t: "Galas y premiaciones", d: "Voz y violín eléctrico para momentos de alto perfil, con la elegancia y el impacto que la ocasión exige." },
    { t: "Lanzamientos y activaciones", d: "Presentaciones que capturan la atención y conectan la marca con su audiencia a través de la música en vivo." },
    { t: "Hoteles y compañías", d: "Formatos personalizados para eventos empresariales, cenas corporativas y celebraciones de fin de año." },
  ],
  momentsCta: "Cotizar mi evento",
  video: "/Vids/corporate.mp4",
  videoPoster: "/Vids/posters/corporate.jpg",
  galleryTitle: "En escena.",
  gallery: [
    { src: U + "corporate-5250.jpg", alt: "Meli Rox en un evento corporativo en Medellín" },
    { src: U + "IMG_5220.JPG.jpeg", alt: "Meli Rox violinista eléctrica en escenario con producción" },
    { src: F + "IMG_2501.jpg", alt: "Meli Rox tocando violín eléctrico en vivo" },
    { src: F + "IMG_2513.jpg", alt: "Meli Rox cantando en un escenario" },
  ],
  faq: [
    { q: "¿Qué tipo de eventos corporativos cubre?", a: "Galas, premiaciones, lanzamientos de producto, activaciones de marca, cenas empresariales y celebraciones de fin de año, en hoteles y compañías." },
    { q: "¿Se adapta a la imagen de la marca?", a: "Sí. El repertorio, el formato y la puesta en escena se ajustan al tono del evento y a la identidad de la empresa." },
    { q: "¿Qué formatos hay disponibles?", a: "Desde violín eléctrico y voz en vivo, hasta ensambles con banda, DJ y producción de alto impacto para grandes escenarios." },
    { q: "¿En qué ciudades se presenta?", a: "En Medellín, Antioquia y toda Colombia. Con experiencia internacional en Estados Unidos, Europa y cruceros, también atiende eventos fuera del país." },
    { q: "¿Cómo solicito una cotización?", a: "Escríbenos por WhatsApp con la fecha, la ciudad y el tipo de evento y te enviamos una propuesta a la medida con disponibilidad." },
  ],
  ctaImg: U + "IMG_5220.JPG.jpeg",
  ctaPos: "50% 28%",
  ctaTitlePre: "Un evento corporativo ",
  ctaTitleEm: "que se recuerda.",
  ctaBody: "Cuéntanos la fecha, la ciudad y el tipo de evento y recibe una propuesta a la medida con producción de alto impacto.",
  serviceName: "Música y violinista para eventos corporativos en Medellín",
  serviceType: "Música en vivo para eventos corporativos",
  serviceDesc: "Voz y violín eléctrico en vivo para galas, lanzamientos, activaciones y premiaciones corporativas en Medellín, con producción de alto impacto.",
  breadcrumbName: "Música para eventos corporativos en Medellín",
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
