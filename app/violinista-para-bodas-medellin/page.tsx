import type { Metadata, Viewport } from "next";
import ServicePage, { F, type ServiceConfig } from "../components/ServicePage";

const PATH = "/violinista-para-bodas-medellin";

export const metadata: Metadata = {
  title: "Violinista para Bodas en Medellín — Voz y Violín Eléctrico en Vivo",
  description:
    "Meli Rox: cantante y violinista eléctrica para bodas en Medellín. Música en vivo para ceremonia, cóctel y recepción con repertorio personalizado. Más de 10 años y cientos de eventos.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://melirox.com" + PATH,
    siteName: "Meli Rox",
    title: "Violinista para Bodas en Medellín | Meli Rox",
    description: "Voz y violín eléctrico en vivo para tu boda en Medellín — ceremonia, cóctel y recepción con repertorio personalizado.",
    images: [{ url: "/Vids/posters/bodas.jpg", width: 1200, height: 630, alt: "Meli Rox — violinista para bodas en Medellín" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

const cfg: ServiceConfig = {
  path: PATH,
  waMsg: "Hola, estoy interesado/a en contratar a Meli Rox para una boda. Quisiera conocer disponibilidad y opciones.",
  headerCta: "Cotiza tu boda",
  eyebrow: "Bodas en Medellín",
  h1Pre: "Violinista para bodas ",
  h1Em: "en Medellín",
  heroImg: F + "wedding.jpg",
  heroPos: "50% 28%",
  heroSub: "Voz y violín eléctrico en vivo para ceremonia, cóctel y recepción — repertorio personalizado que convierte tu boda en un momento inolvidable.",
  ctaPrimary: "Consultar disponibilidad",
  stats: [
    { n: "+10", l: "Años en escena" },
    { n: "Cientos", l: "De bodas y eventos" },
    { n: "5 países", l: "Colombia · EE.UU. · Europa" },
    { n: "#1", l: "En La X 103.9 Medellín" },
  ],
  statementEyebrow: "Música que se recuerda",
  statementPre: "Cada boda merece una banda sonora ",
  statementEm: "que solo suceda una vez.",
  statementBody:
    "Con más de una década sobre el escenario y cientos de eventos en Colombia y el exterior, Meli Rox une voz, violín eléctrico y música original para acompañar los momentos que nunca se repiten — desde la entrada de la novia hasta el último baile de la noche.",
  momentsImg: F + "IMG_1922.JPG",
  momentsPos: "50% 30%",
  momentsTitle: "Del «sí, acepto» al primer baile.",
  moments: [
    { t: "Ceremonia", d: "La entrada de la novia y los votos, acompañados por violín en vivo. Emoción pura en el momento más importante." },
    { t: "Cóctel", d: "Voz y violín eléctrico para recibir a los invitados — elegancia y ambiente mientras empieza la celebración." },
    { t: "Recepción", d: "El primer baile y la fiesta con repertorio personalizado, banda en vivo o colaboraciones con DJs." },
  ],
  momentsCta: "Cotizar mi boda",
  video: "/Vids/bodas.mp4",
  videoPoster: "/Vids/posters/bodas.jpg",
  galleryTitle: "Momentos reales.",
  gallery: [
    { src: F + "Meli%20Rox%20wedding.jpeg", alt: "Meli Rox tocando violín en una boda en Medellín" },
    { src: F + "wedding1.jpg", alt: "Violinista en vivo durante una ceremonia de boda" },
    { src: F + "IMG_1922.JPG", alt: "Meli Rox — música en vivo para boda" },
    { src: F + "Meli%20violin%20(1).jpeg", alt: "Meli Rox con violín eléctrico" },
  ],
  faq: [
    { q: "¿Qué incluye la música en vivo para una boda?", a: "Meli Rox acompaña los tres momentos clave: ceremonia, cóctel y recepción. Voz y violín eléctrico en vivo, con repertorio personalizado desde la entrada de la novia hasta el primer baile. Se adapta a bodas íntimas o a grandes celebraciones." },
    { q: "¿En qué ciudades se presenta?", a: "Con base en Medellín, se presenta en toda Antioquia y en el resto de Colombia. También realiza bodas destino y ha tocado en escenarios de Estados Unidos, Europa y cruceros internacionales." },
    { q: "¿Puedo elegir las canciones?", a: "Sí. El repertorio se diseña contigo, incluyendo la canción de entrada, la del primer baile y los momentos especiales. Desde clásicos y crossover hasta versiones modernas con violín eléctrico." },
    { q: "¿Qué formatos hay disponibles?", a: "Desde voz y violín en formato íntimo, hasta ensambles con banda en vivo, DJs y colaboraciones para la fiesta. Cada boda se cotiza según el formato, la fecha y el lugar." },
    { q: "¿Cómo reservo y cuánto cuesta?", a: "El valor depende del formato, la fecha y la locación. Escríbenos por WhatsApp con la fecha y el lugar de tu boda y te enviamos disponibilidad y una propuesta a la medida." },
  ],
  ctaImg: F + "Meli%20Rox%20wedding.jpeg",
  ctaPos: "50% 30%",
  ctaTitlePre: "Reserva tu fecha ",
  ctaTitleEm: "antes de que se agende.",
  ctaBody: "Las fechas de temporada se reservan con meses de anticipación. Escríbenos con la fecha y el lugar de tu boda y recibe una propuesta a la medida.",
  serviceName: "Violinista y cantante para bodas en Medellín",
  serviceType: "Música en vivo para bodas",
  serviceDesc: "Voz y violín eléctrico en vivo para ceremonia, cóctel y recepción de bodas en Medellín, con repertorio personalizado.",
  breadcrumbName: "Violinista para bodas en Medellín",
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
