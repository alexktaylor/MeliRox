import type { Metadata, Viewport } from "next";
import ServicePage, { F, type ServiceConfig } from "../components/ServicePage";

const PATH = "/violinista-electrica-medellin";

export const metadata: Metadata = {
  title: "Violinista Eléctrica en Medellín — Conciertos, Festivales y DJs",
  description:
    "Meli Rox: violinista eléctrica y cantautora en Medellín. Violín eléctrico, voz y electrónica en vivo — Afro House, colaboraciones con DJs y grandes escenarios.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://melirox.com" + PATH,
    siteName: "Meli Rox",
    title: "Violinista Eléctrica en Medellín | Meli Rox",
    description: "Violín eléctrico, voz y electrónica en vivo — Afro House, colaboraciones con DJs y conciertos en grandes escenarios.",
    images: [{ url: "/Vids/posters/conciertos.jpg", width: 1200, height: 630, alt: "Meli Rox — violinista eléctrica en Medellín" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

const cfg: ServiceConfig = {
  path: PATH,
  waMsg: "Hola, quisiera conocer el formato de show de Meli Rox para un concierto o festival.",
  headerCta: "Cotiza un show",
  eyebrow: "Violinista eléctrica · Medellín",
  h1Pre: "Violinista eléctrica ",
  h1Em: "en Medellín",
  heroImg: F + "IMG_2501.jpg",
  heroPos: "50% 25%",
  heroSub: "Violín eléctrico, voz y electrónica en vivo — Afro House, colaboraciones con DJs y grandes escenarios.",
  ctaPrimary: "Consultar el show",
  stats: [
    { n: "+10", l: "Años en escena" },
    { n: "La Solar", l: "Medellín Music Lab" },
    { n: "#1", l: "En La X 103.9" },
    { n: "Premios Estela", l: "Reconocimiento internacional" },
  ],
  statementEyebrow: "Su sonido",
  statementPre: "La expresión clásica ",
  statementEm: "dentro de la energía moderna.",
  statementBody:
    "Meli Rox lleva el violín eléctrico a un terreno propio: voz, música original y electrónica en vivo que unen la elegancia clásica con la energía del Afro House. De La Solar al Medellín Music Lab, un show pensado para grandes escenarios.",
  momentsImg: F + "IMG_2471.jpg",
  momentsPos: "50% 25%",
  momentsTitle: "Un show para grandes escenarios.",
  moments: [
    { t: "Violín eléctrico y voz", d: "La combinación que la distingue — expresión clásica con la potencia de un show en vivo." },
    { t: "Afro House y electrónica", d: "Música original y sets en vivo que encienden la pista, con la energía del sonido contemporáneo." },
    { t: "Colaboraciones con DJs", d: "Formatos con DJs, productores y artistas invitados para festivales, clubes y activaciones." },
  ],
  momentsCta: "Consultar formato de show",
  video: "/Vids/conciertos.mp4",
  videoPoster: "/Vids/posters/conciertos.jpg",
  galleryTitle: "En vivo.",
  gallery: [
    { src: F + "IMG_2471.jpg", alt: "Meli Rox violinista eléctrica en un festival" },
    { src: F + "IMG_2501.jpg", alt: "Meli Rox tocando violín eléctrico en concierto" },
    { src: F + "DSC08415.jpg", alt: "Meli Rox en escena con violín eléctrico" },
    { src: F + "Meli%20violin%20(1).jpeg", alt: "Meli Rox con violín eléctrico" },
  ],
  faq: [
    { q: "¿Qué incluye el show para conciertos y festivales?", a: "Violín eléctrico, voz y electrónica en vivo con música original, en formatos que van desde solista hasta ensambles con banda, DJs y artistas invitados." },
    { q: "¿Qué géneros toca?", a: "Un sonido crossover que une lo clásico con lo contemporáneo — Afro House, electrónica y versiones con violín eléctrico, además de su música original." },
    { q: "¿Ha tocado en festivales y grandes escenarios?", a: "Sí. Se ha presentado en festivales como La Solar y el Medellín Music Lab, alcanzó el #1 en La X 103.9 y obtuvo reconocimiento internacional en los Premios Estela." },
    { q: "¿Colabora con DJs y productores?", a: "Sí. Realiza colaboraciones con DJs, productores y artistas invitados para festivales, clubes y activaciones de marca." },
    { q: "¿Cómo consulto disponibilidad para un evento?", a: "Escríbenos por WhatsApp con la fecha, la ciudad y el tipo de show y te enviamos el formato y una propuesta a la medida." },
  ],
  ctaImg: F + "DVR_0523.jpg",
  ctaPos: "50% 24%",
  ctaTitlePre: "Lleva su energía ",
  ctaTitleEm: "a tu escenario.",
  ctaBody: "Cuéntanos la fecha, la ciudad y el tipo de show y recibe el formato y una propuesta a la medida.",
  serviceName: "Violinista eléctrica para conciertos y festivales en Medellín",
  serviceType: "Show de violín eléctrico para conciertos y festivales",
  serviceDesc: "Violín eléctrico, voz y electrónica en vivo para conciertos, festivales y colaboraciones con DJs en Medellín y Colombia.",
  breadcrumbName: "Violinista eléctrica en Medellín",
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
