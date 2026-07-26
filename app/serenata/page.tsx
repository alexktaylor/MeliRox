import type { Metadata, Viewport } from "next";
import ServicePage, { F, type ServiceConfig } from "../components/ServicePage";

const PATH = "/serenata";

export const metadata: Metadata = {
  title: "Serenata en Medellín — Violín y Voz en Vivo | Meli Rox",
  description:
    "Serenata romántica de violín y voz en vivo en Medellín. Perfecta para propuestas de matrimonio, aniversarios y sorpresas inolvidables. Más de 10 años en escena. Cotiza por WhatsApp.",
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://melirox.com" + PATH,
    siteName: "Meli Rox",
    title: "Serenata Romántica en Medellín — Violín y Voz en Vivo | Meli Rox",
    description: "Sorprende con una serenata inolvidable de violín y voz en vivo en Medellín — propuestas, aniversarios y momentos especiales.",
    images: [{ url: "/Vids/posters/serenata.jpg", width: 1200, height: 630, alt: "Meli Rox — serenata romántica en Medellín" }],
  },
};

export const viewport: Viewport = { themeColor: "#0b0a08" };

const cfg: ServiceConfig = {
  path: PATH,
  waMsg: "Hola, vi la serenata de violín y voz de Meli Rox. Quisiera sorprender a alguien especial — ¿me cuentas disponibilidad y opciones?",
  headerCta: "Cotiza tu serenata",
  eyebrow: "Serenata en Medellín",
  h1Pre: "Serenata en Medellín ",
  h1Em: "con violín y voz",
  heroImg: "/Vids/posters/serenata.jpg",
  heroVideo: "/Vids/bg/serenata.mp4",
  heroVideoPos: "50% 30%",
  heroPos: "50% 30%",
  heroSub:
    "No es un mariachi más. Es violín y voz en vivo — íntimo, elegante y hecho para el momento exacto. La canción que le dedicas, tocada solo para ustedes.",
  ctaPrimary: "Reservar mi serenata",
  stats: [
    { n: "+10", l: "Años en escena" },
    { n: "Cientos", l: "De eventos y sorpresas" },
    { n: "5 países", l: "Colombia · EE.UU. · Europa" },
    { n: "#1", l: "En La X 103.9 Medellín" },
  ],
  statementEyebrow: "Cuando las palabras no bastan",
  statementPre: "El detalle más romántico ",
  statementEm: "no se olvida jamás.",
  statementBody:
    "Con más de una década sobre el escenario y presencia en televisión nacional, Meli Rox convierte una serenata en una experiencia: voz y violín en vivo, la canción que ustedes eligen, interpretada en el momento y el lugar perfectos. Nada de pistas grabadas — solo música real para una sorpresa que se recuerda toda la vida.",
  momentsImg: F + "wedding1.webp",
  momentsVideo: "/Vids/bg/bodas.mp4",
  momentsPos: "50% 25%",
  momentsTitle: "Para el momento perfecto.",
  moments: [
    { t: "Propuesta de matrimonio", d: "El «sí» más inolvidable, con la música tocando de fondo en el instante exacto." },
    { t: "Aniversario", d: "Recuérdale por qué la elegiste — con su canción, en vivo, solo para ustedes." },
    { t: "Cumpleaños y sorpresas", d: "Una sorpresa distinta a todo lo que espera. En casa, en un restaurante o donde quieras." },
  ],
  momentsCta: "Reservar mi serenata",
  includes: [
    { t: "La canción que elijas", d: "Escoge la canción especial — la preparamos en violín, voz o ambos, a su estilo." },
    { t: "Voz y violín en vivo", d: "Nada de pistas grabadas: todo interpretado en el momento, solo para ustedes." },
    { t: "Vamos a donde estés", d: "Casa, restaurante, mirador, el lugar de la primera cita — donde quieras la sorpresa." },
    { t: "Coordinación discreta", d: "Planeamos la sorpresa contigo en secreto para que todo salga perfecto." },
  ],
  includesNote: "Cada serenata se adapta a tu historia — cuéntanos la ocasión, la canción y el lugar.",
  video: "/Vids/violin.mp4",
  videoPoster: "/Vids/posters/violin.jpg",
  galleryTitle: "Momentos reales.",
  gallery: [
    { src: F + "wedding1.webp", alt: "Meli Rox con su violín — retrato romántico" },
    { src: F + "wedding.webp", alt: "Meli Rox violinista en un evento elegante en Medellín" },
    { src: F + "party.webp", alt: "Meli Rox en una noche elegante en Medellín" },
    { src: F + "Meli%20Rox%20wedding.webp", alt: "Meli Rox con violín en vivo" },
  ],
  faq: [
    { q: "¿Qué es una serenata con violín y voz?", a: "En vez del mariachi o trío tradicional, Meli Rox interpreta en vivo — con violín, voz o ambos — la canción que tú elijas para sorprender a alguien especial. Es una experiencia íntima y elegante, perfecta para propuestas, aniversarios y sorpresas románticas en Medellín." },
    { q: "¿Puedo elegir la canción?", a: "Sí. La serenata se arma alrededor de la canción que quieras dedicar. La preparamos con anticipación para que suene perfecta en el momento exacto." },
    { q: "¿A dónde llegan?", a: "A donde quieras la sorpresa: tu casa, un restaurante, un mirador, el lugar de la primera cita. Con base en Medellín, nos movemos por toda la ciudad y alrededores." },
    { q: "¿Con cuánta anticipación debo reservar?", a: "Entre más pronto, mejor — especialmente en fechas especiales como San Valentín, aniversarios y temporada. Escríbenos por WhatsApp con tu fecha y confirmamos disponibilidad al instante." },
    { q: "¿Cómo reservo y cuánto cuesta?", a: "El valor depende de la fecha, el lugar y el formato (violín, voz o ambos). Escríbenos por WhatsApp con los detalles y te enviamos una propuesta a la medida para tu sorpresa." },
  ],
  ctaImg: F + "wedding.webp",
  ctaVideo: "/Vids/bg/serenata.mp4",
  ctaPos: "50% 30%",
  ctaTitlePre: "Sorpréndela con algo ",
  ctaTitleEm: "que jamás olvidará.",
  ctaBody: "Cuéntanos la ocasión, la canción y el lugar — nosotros nos encargamos de que sea perfecto. Escríbenos por WhatsApp y reserva tu fecha.",
  serviceName: "Serenata romántica con violín y voz en vivo en Medellín",
  serviceType: "Serenata en vivo",
  serviceDesc: "Serenata de violín y voz en vivo en Medellín para propuestas de matrimonio, aniversarios, cumpleaños y sorpresas románticas.",
  breadcrumbName: "Serenata en Medellín",
  repertoire: [
    { title: "Perfect", artist: "Ed Sheeran", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c7/ba/bc/c7babc66-f598-aaa6-bcf6-307281795817/mzaf_16337361235117168274.plus.aac.p.m4a" },
    { title: "A Thousand Years", artist: "Christina Perri", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/3a/e7/8e3ae749-5e13-a9ca-fef6-61d615bc3087/mzaf_5415208554281396500.plus.aac.p.m4a" },
    { title: "Thinking Out Loud", artist: "Ed Sheeran", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/a5/f2/78a5f25e-ad1b-718d-82ad-b82e676c1855/mzaf_6133970271589343093.plus.aac.p.m4a" },
    { title: "All of Me", artist: "John Legend", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ff/94/6c/ff946ca7-e49a-fdf8-ea5b-11e6f56a0417/mzaf_17369156110722174773.plus.aac.p.m4a" },
    { title: "Hasta mi final", artist: "Il Divo", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/0e/e5/d2/0ee5d28a-794f-424a-5dbe-08e2d8319824/mzaf_5376181552421193433.plus.aac.p.m4a" },
    { title: "Creo en ti", artist: "Reik", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3e/e7/2f/3ee72f58-29d1-9c48-bb1f-6721de74db23/mzaf_13824032248174944279.plus.aac.p.m4a" },
    { title: "Por primera vez", artist: "Camilo & Evaluna Montaner", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/91/6c/87/916c8747-2c0d-32d8-e66f-8dcc21439d61/mzaf_5140771430125228194.plus.aac.p.m4a" },
    { title: "Nella Fantasia", artist: "Il Divo", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/52/6d/ee/526deeed-5844-c269-796e-0ba2fe46e814/mzaf_10959848333413175672.plus.aac.p.m4a" },
    { title: "Love Me Like You Do", artist: "Ellie Goulding", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/55/26/f9/5526f99f-a256-81bb-6996-918db13723f8/mzaf_12880409831419607391.plus.aac.p.m4a" },
    { title: "Eres mi sueño", artist: "Fonseca", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/22/33/47/22334787-2ffd-092d-602f-51fd7f88802c/mzaf_11671728325722748664.plus.aac.p.m4a" },
  ],
};

export default function Page() {
  return <ServicePage cfg={cfg} />;
}
