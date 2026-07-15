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
  packages: [
    { n: "01", title: "Acto ceremonial", format: "Dúo de voz, violín y piano (o guitarra)", details: ["Ceremonia", "Entrada y votos"] },
    { n: "02", title: "Cóctel", format: "Violín y voz", details: ["45 min", "Escoge tu música", "Pólvora fría"] },
    { n: "03", title: "Todo incluido", format: "Ceremonia + cóctel", details: ["Paquete completo", "Reserva con el 30%"] },
  ],
  repertoire: [
    { title: "Hasta mi final", artist: "Il Divo", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0e/e5/d2/0ee5d28a-794f-424a-5dbe-08e2d8319824/mzaf_5376181552421193433.plus.aac.p.m4a" },
    { title: "Perfect", artist: "Ed Sheeran", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/ba/bc/c7babc66-f598-aaa6-bcf6-307281795817/mzaf_16337361235117168274.plus.aac.p.m4a" },
    { title: "A Thousand Years", artist: "Christina Perri", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/3a/e7/8e3ae749-5e13-a9ca-fef6-61d615bc3087/mzaf_5415208554281396500.plus.aac.p.m4a" },
    { title: "Señorita", artist: "Shawn Mendes & Camila Cabello", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cf/06/d6/cf06d6fd-f7a0-2898-8363-67688df6c14f/mzaf_8234301186390421644.plus.aac.p.m4a" },
    { title: "Thinking Out Loud", artist: "Ed Sheeran", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/a5/f2/78a5f25e-ad1b-718d-82ad-b82e676c1855/mzaf_6133970271589343093.plus.aac.p.m4a" },
    { title: "All of Me", artist: "John Legend", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/94/6c/ff946ca7-e49a-fdf8-ea5b-11e6f56a0417/mzaf_17369156110722174773.plus.aac.p.m4a" },
    { title: "Love Me Like You Do", artist: "Ellie Goulding", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/55/26/f9/5526f99f-a256-81bb-6996-918db13723f8/mzaf_12880409831419607391.plus.aac.p.m4a" },
    { title: "Nella Fantasia", artist: "Il Divo", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/52/6d/ee/526deeed-5844-c269-796e-0ba2fe46e814/mzaf_10959848333413175672.plus.aac.p.m4a" },
    { title: "Creo en ti", artist: "Reik", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3e/e7/2f/3ee72f58-29d1-9c48-bb1f-6721de74db23/mzaf_13824032248174944279.plus.aac.p.m4a" },
    { title: "Ocean", artist: "KAROL G", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/eb/1d/72/eb1d7234-ed15-2d3a-c145-7cb7fa855486/mzaf_17307725212739337953.plus.aac.p.m4a" },
    { title: "Disfruto", artist: "Carla Morrison", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/55/89/f6/5589f6d7-bed1-d60d-c376-8c2da227a997/mzaf_1226023105227924942.plus.aac.p.m4a" },
    { title: "Acróstico", artist: "Shakira", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2e/a2/41/2ea241fc-1aab-549f-7519-90253984952b/mzaf_15630977518920139422.plus.aac.p.m4a" },
    { title: "Por primera vez", artist: "Camilo & Evaluna Montaner", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/6c/87/916c8747-2c0d-32d8-e66f-8dcc21439d61/mzaf_5140771430125228194.plus.aac.p.m4a" },
    { title: "La tierra del olvido", artist: "Carlos Vives", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/56/58/75/5658757a-3788-27e2-5215-942e01585a4d/mzaf_17010109186127815887.plus.aac.p.m4a" },
    { title: "Cásate conmigo", artist: "Silvestre Dangond & Nicky Jam", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2f/fe/cf/2ffecfa7-157d-1700-abf5-17c196c68157/mzaf_11842889685391172405.plus.aac.p.m4a" },
    { title: "Eres mi sueño", artist: "Fonseca", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/22/33/47/22334787-2ffd-092d-602f-51fd7f88802c/mzaf_11671728325722748664.plus.aac.p.m4a" },
    { title: "Favorito", artist: "Camilo", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/29/ca/19/29ca1939-525d-2c8e-48e8-4f7fd9427ee0/mzaf_1062712349094666712.plus.aac.p.m4a" },
  ],
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
