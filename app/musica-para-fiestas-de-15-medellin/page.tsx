import type { Metadata, Viewport } from "next";
import ServicePage, { F, type ServiceConfig } from "../components/ServicePage";

const PATH = "/musica-para-fiestas-de-15-medellin";

export const metadata: Metadata = {
  title: "Música para Fiestas de 15 en Medellín — Violinista y Show en Vivo",
  description:
    "Meli Rox: violinista eléctrica y cantante para fiestas de 15 en Medellín. Entrada especial, alas LED y canción personalizada para una quinceañera inolvidable.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://melirox.com" + PATH,
    siteName: "Meli Rox",
    title: "Música para Fiestas de 15 en Medellín | Meli Rox",
    description: "Voz, violín eléctrico y una puesta en escena a la medida para la fiesta de 15 — entrada especial, alas LED y canción personalizada.",
    images: [{ url: "/Vids/posters/quince.jpg", width: 1200, height: 630, alt: "Meli Rox — música para fiestas de 15 en Medellín" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

const cfg: ServiceConfig = {
  path: PATH,
  waMsg: "Hola, estoy interesado/a en una presentación de Meli Rox para una fiesta de 15 años. Quisiera conocer disponibilidad y formatos.",
  headerCta: "Cotiza tu fiesta",
  eyebrow: "Fiestas de 15 en Medellín",
  h1Pre: "Música para fiestas de 15 ",
  h1Em: "en Medellín",
  heroImg: F + "IMG_1922.JPG",
  heroPos: "50% 34%",
  heroSub: "Una entrada que nadie va a olvidar — voz, violín eléctrico y una puesta en escena creada para convertir la celebración en un momento verdaderamente especial.",
  ctaPrimary: "Cotizar la fiesta",
  stats: [
    { n: "+10", l: "Años en escena" },
    { n: "Cientos", l: "De celebraciones" },
    { n: "Alas LED", l: "Puesta en escena" },
    { n: "100%", l: "Personalizado" },
  ],
  statementEyebrow: "Una noche única",
  statementPre: "La entrada de tu fiesta de 15 ",
  statementEm: "merece ser inolvidable.",
  statementBody:
    "Voz, violín eléctrico y una producción pensada para el gran momento de la quinceañera. Meli Rox crea una experiencia a la medida — desde la entrada triunfal hasta la canción que hará llorar a toda la familia.",
  momentsImg: F + "Meli%20violin%20(1).jpeg",
  momentsPos: "50% 18%",
  momentsTitle: "Una puesta en escena a tu medida.",
  moments: [
    { t: "Entrada especial", d: "Una entrada triunfal con violín eléctrico en vivo que marca el inicio de la noche y deja a todos sin palabras." },
    { t: "Alas LED", d: "Impacto visual con alas LED y puesta en escena para convertir la celebración en un verdadero show." },
    { t: "Canción personalizada", d: "El momento más emotivo — una canción elegida especialmente para la quinceañera y su familia." },
  ],
  momentsCta: "Cotizar mi fiesta de 15",
  video: "/Vids/quince.mp4",
  videoPoster: "/Vids/posters/quince.jpg",
  galleryTitle: "El show en vivo.",
  gallery: [
    { src: F + "IMG_2501.jpg", alt: "Meli Rox tocando violín eléctrico en vivo" },
    { src: F + "DVR_0507.jpg", alt: "Meli Rox con violín eléctrico" },
    { src: F + "wedding1.jpg", alt: "Meli Rox violinista para celebraciones" },
    { src: F + "DSC08571.jpg", alt: "Meli Rox en una fiesta de 15 en Medellín" },
  ],
  faq: [
    { q: "¿Qué incluye el show para una fiesta de 15?", a: "Una entrada especial con violín eléctrico en vivo, puesta en escena con alas LED y una canción personalizada para la quinceañera. Los formatos se adaptan al espacio y al estilo de la fiesta." },
    { q: "¿Se puede personalizar la canción de entrada?", a: "Sí. Se elige contigo la canción de entrada y los momentos musicales de la noche, para que todo gire alrededor de la quinceañera." },
    { q: "¿En qué zonas se presenta?", a: "En Medellín, el Valle de Aburrá, Antioquia y el resto de Colombia. Consulta por presentaciones fuera de la ciudad." },
    { q: "¿Qué formatos hay disponibles?", a: "Desde violín y voz en vivo con pistas, hasta ensambles con banda o DJ para la fiesta completa. Cada evento se cotiza según el formato, la fecha y el lugar." },
    { q: "¿Cómo reservo y cuánto cuesta?", a: "El valor depende del formato, la fecha y la locación. Escríbenos por WhatsApp con los detalles de la fiesta y te enviamos disponibilidad y una propuesta a la medida." },
  ],
  ctaImg: F + "DVR_0507.jpg",
  ctaPos: "50% 18%",
  ctaTitlePre: "Haz de su fiesta de 15 ",
  ctaTitleEm: "un momento inolvidable.",
  ctaBody: "Cuéntanos la fecha y el lugar de la celebración y recibe una propuesta a la medida para la entrada, el show y la canción personalizada.",
  serviceName: "Música y violinista para fiestas de 15 en Medellín",
  serviceType: "Música para fiestas de 15 / quinceañeras",
  serviceDesc: "Voz, violín eléctrico y puesta en escena para fiestas de 15 años en Medellín — entrada especial, alas LED y canción personalizada.",
  breadcrumbName: "Música para fiestas de 15 en Medellín",
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
