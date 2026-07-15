import type { Metadata, Viewport } from "next";
import ServicePage, { F, type ServiceConfig } from "../components/ServicePage";

const PATH = "/violinista-eventos-privados-medellin";

export const metadata: Metadata = {
  title: "Violinista para Eventos Privados en Medellín — Música en Vivo",
  description:
    "Meli Rox: violinista eléctrica y cantante para eventos privados en Medellín. Cumpleaños, aniversarios, propuestas y cenas exclusivas — una experiencia íntima y a la medida.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://melirox.com" + PATH,
    siteName: "Meli Rox",
    title: "Violinista para Eventos Privados en Medellín | Meli Rox",
    description: "Música en vivo diseñada a la medida del momento — cumpleaños, aniversarios, propuestas y cenas exclusivas en Medellín.",
    images: [{ url: "/Vids/posters/privados.jpg", width: 1200, height: 630, alt: "Meli Rox — violinista para eventos privados en Medellín" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

const cfg: ServiceConfig = {
  path: PATH,
  waMsg: "Hola, quisiera cotizar una presentación de Meli Rox para un evento privado.",
  headerCta: "Cotiza tu evento",
  eyebrow: "Eventos privados en Medellín",
  h1Pre: "Violinista para eventos privados ",
  h1Em: "en Medellín",
  heroImg: F + "IMG_6812.JPG",
  heroPos: "50% 18%",
  heroSub: "Música diseñada a la medida del momento — cumpleaños, aniversarios, propuestas y cenas exclusivas con voz y violín eléctrico en vivo.",
  ctaPrimary: "Cotizar evento privado",
  stats: [
    { n: "+10", l: "Años en escena" },
    { n: "Cientos", l: "De eventos" },
    { n: "A la medida", l: "Experiencia íntima" },
    { n: "5 países", l: "Colombia · EE.UU. · Europa" },
  ],
  statementEyebrow: "Momentos que importan",
  statementPre: "Los momentos íntimos ",
  statementEm: "también merecen su música.",
  statementBody:
    "Una propuesta de matrimonio, un aniversario, una cena especial. Meli Rox crea una experiencia íntima y personalizada con voz y violín eléctrico en vivo, para que el momento se sienta tan único como es.",
  momentsImg: F + "IMG_6812.JPG",
  momentsPos: "50% 15%",
  momentsTitle: "Una experiencia íntima y personalizada.",
  moments: [
    { t: "Cumpleaños y aniversarios", d: "Música en vivo que convierte una fecha especial en un recuerdo inolvidable." },
    { t: "Propuestas", d: "El violín en vivo en el momento exacto — la banda sonora perfecta para decir «sí»." },
    { t: "Cenas exclusivas", d: "Voz y violín eléctrico para cenas privadas, con la elegancia y la calidez que el momento merece." },
  ],
  momentsCta: "Cotizar mi evento",
  video: "/Vids/privados.mp4",
  videoPoster: "/Vids/posters/privados.jpg",
  galleryTitle: "Momentos a la medida.",
  gallery: [
    { src: F + "IMG_6812.JPG", alt: "Meli Rox en un evento privado en Medellín" },
    { src: F + "DVR_0449.jpg", alt: "Meli Rox — sesión íntima con violín" },
    { src: F + "DSC08345.jpg", alt: "Retrato de Meli Rox violinista eléctrica" },
    { src: F + "Meli%20violin%20(1).jpeg", alt: "Meli Rox con violín eléctrico" },
  ],
  faq: [
    { q: "¿Para qué tipo de eventos privados se presenta?", a: "Cumpleaños, aniversarios, propuestas de matrimonio, cenas exclusivas y celebraciones íntimas — cada una diseñada a la medida del momento." },
    { q: "¿Puedo pedir una canción especial?", a: "Sí. El repertorio se elige contigo, incluyendo esa canción que hace el momento inolvidable." },
    { q: "¿Qué formatos hay disponibles?", a: "Desde violín y voz en formato íntimo, hasta ensambles más completos según el espacio y la ocasión. Cada evento se cotiza a la medida." },
    { q: "¿En qué zonas se presenta?", a: "En Medellín, el Valle de Aburrá, Antioquia y el resto de Colombia. Consulta por presentaciones fuera de la ciudad." },
    { q: "¿Cómo reservo y cuánto cuesta?", a: "El valor depende del formato, la fecha y la locación. Escríbenos por WhatsApp con los detalles y te enviamos disponibilidad y una propuesta a la medida." },
  ],
  ctaImg: F + "DVR_0490.jpg",
  ctaPos: "50% 20%",
  ctaTitlePre: "Haz que tu momento ",
  ctaTitleEm: "suene diferente.",
  ctaBody: "Cuéntanos qué celebras, la fecha y el lugar, y recibe una propuesta íntima y a la medida.",
  serviceName: "Violinista para eventos privados en Medellín",
  serviceType: "Música en vivo para eventos privados",
  serviceDesc: "Voz y violín eléctrico en vivo para cumpleaños, aniversarios, propuestas y cenas exclusivas en Medellín — experiencia íntima y personalizada.",
  breadcrumbName: "Violinista para eventos privados en Medellín",
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
