"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const U = "/uploads/";
const F = "/uploads/drive-download-20260714T181149Z-1-001/";
const PHONE = "+573045502154";
const PREVIEW_SECONDS = 50;
const BAR_COUNT = 36;
const CSS = (o: CSSProperties) => o;

function wa(msg: string) {
  return "https://wa.me/573045502154?text=" + encodeURIComponent(msg);
}

function PlayIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" style={{ display: "block", marginLeft: size * 0.08 }}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" style={{ display: "block" }}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function CategoryVideo({ src, pos, onActivate }: { src: string; pos: string; onActivate?: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const poster = src.replace("/Vids/", "/Vids/posters/").replace(".mp4", ".jpg");
  // Lazy: only load + play the preview when the section is near/in view; pause when it leaves.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "500px 0px", threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  const activate = () => {
    const v = ref.current;
    if (!v || active) return;
    v.muted = false;
    v.currentTime = 0;
    setActive(true);
    onActivate?.();
    v.play().catch(() => {});
  };
  return (
    <>
      <video ref={ref} src={src} poster={poster} playsInline preload="none" loop={!active} controls={active} onClick={activate} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: "saturate(.95) brightness(.9)", cursor: active ? "default" : "pointer" }} />
      {!active && (
        <div onClick={activate} style={{ position: "absolute", top: "14px", right: "14px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(8,7,6,.6)", backdropFilter: "blur(4px)", border: "1px solid rgba(232,207,158,.55)", borderRadius: "999px", padding: "9px 14px", color: "#ecd9ac", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer", zIndex: 3 }}>
          <svg width={13} height={13} viewBox="0 0 24 24" fill="#ecd9ac" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z" /></svg>
          <span>Toca para escuchar</span>
        </div>
      )}
    </>
  );
}

// Latest Instagram posts/reels to feature (official embed). Paste permalinks like
// "https://www.instagram.com/reel/XXXXXXXXXXX/" — the section shows a big CTA until filled.
const IG_POSTS: string[] = [
  "https://www.instagram.com/p/DaQ9Q-NJ0E1/",
  "https://www.instagram.com/p/DaHPE5LBjpj/",
  "https://www.instagram.com/p/DZn3RTQJTAF/",
  "https://www.instagram.com/p/DZJNvHfpFxn/",
  "https://www.instagram.com/p/DY-8aVxJKla/",
];

// How much of the Instagram embed's bottom chrome (View more / like-comment-share / add-comment) to crop off.
const IG_FOOTER_CROP = 172;
const IG_NATURAL_W = 326; // Instagram's enforced minimum embed width

function InstagramEmbeds({ urls, isMobile, vw }: { urls: string[]; isMobile: boolean; vw: number }) {
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Desktop: scale every embed down so all fit one row. Mobile: full-size swipe slider.
  const N = urls.length;
  const gap = 14;
  const avail = Math.min(1560, vw - 60);
  // Mobile: shrink so the next reel peeks (signals scroll). Desktop: scale so all fit one row.
  const scale = isMobile
    ? Math.min(1, (vw * 0.8) / IG_NATURAL_W)
    : Math.max(0.5, Math.min(1, (avail - (N - 1) * gap) / (N * IG_NATURAL_W)));
  const itemW = Math.round(IG_NATURAL_W * scale);

  useEffect(() => {
    const w = window as unknown as { instgrm?: { embeds?: { process?: () => void } } };
    const process = () => {
      try {
        w.instgrm?.embeds?.process?.();
      } catch {}
    };
    if (w.instgrm) {
      process();
    } else {
      const existing = document.getElementById("ig-embed-script") as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", process);
      } else {
        const s = document.createElement("script");
        s.id = "ig-embed-script";
        s.src = "https://www.instagram.com/embed.js";
        s.async = true;
        s.onload = process;
        document.body.appendChild(s);
      }
    }

    // Crop each embed's footer once it becomes an iframe. Keep polling so late-rendering
    // embeds are all handled (not just the first ones).
    const observers: ResizeObserver[] = [];
    const handled = new Set<number>();
    const applyCrop = (i: number) => {
      const wrap = wrapRefs.current[i];
      const outer = outerRefs.current[i];
      if (!wrap || !outer) return;
      const iframe = wrap.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return false;
      const apply = () => {
        const h = iframe.offsetHeight;
        if (h > IG_FOOTER_CROP + 120) {
          const ch = h - IG_FOOTER_CROP;
          wrap.style.height = ch + "px";
          outer.style.height = Math.round(ch * scale) + "px";
        }
      };
      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(iframe);
      observers.push(ro);
      return true;
    };
    const poll = setInterval(() => {
      urls.forEach((_, i) => {
        if (!handled.has(i) && applyCrop(i)) handled.add(i);
      });
      if (handled.size >= urls.length) clearInterval(poll);
    }, 250);
    const stop = setTimeout(() => clearInterval(poll), 10000);
    return () => {
      clearInterval(poll);
      clearTimeout(stop);
      observers.forEach((o) => o.disconnect());
    };
  }, [urls, isMobile, vw, scale]);

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollSnapType: isMobile ? "x mandatory" : "none", padding: "2px 0 14px", scrollbarWidth: "thin", scrollbarColor: "rgba(212,180,122,.4) transparent" }}>
      <div style={{ display: "flex", gap: gap + "px", width: "max-content", margin: isMobile ? 0 : "0 auto", alignItems: "flex-start", justifyContent: isMobile ? "flex-start" : "center" }}>
        {urls.map((u, i) => (
          <div key={u} ref={(el) => { outerRefs.current[i] = el; }} style={{ flex: "0 0 auto", width: itemW + "px", scrollSnapAlign: isMobile ? "start" : "none" }}>
            <div ref={(el) => { wrapRefs.current[i] = el; }} style={{ width: IG_NATURAL_W + "px", overflow: "hidden", borderRadius: "6px", border: "1px solid rgba(212,180,122,.2)", transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <blockquote className="instagram-media" data-instgrm-permalink={u} data-instgrm-version="14" style={{ background: "#0a0908", border: 0, margin: 0, width: "100%", minWidth: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Cat = {
  id: string;
  es: string;
  en: string;
  img: string;
  pos: string;
  vid?: boolean;
  vidSrc?: string;
  tone: string;
  tEs: string;
  tEn: string;
  cEs: string;
  cEn: string;
  chEs: string[];
  chEn: string[];
  ctaEs: string;
  ctaEn: string;
  mEs: string;
  mEn: string;
};

const CATS: Cat[] = [
  {
    id: "bodas",
    es: "Bodas",
    en: "Weddings",
    img: F + "IMG_1922.JPG",
    vidSrc: "/Vids/bodas.mp4",
    pos: "50% 28%",
    tone: "linear-gradient(180deg, #0b0a08, #171008 50%, #0b0a08)",
    tEs: "Música que acompaña los momentos que nunca se repiten.",
    tEn: "Music for the moments that never repeat.",
    cEs: "Ceremonia, cóctel y momentos que se quedan en la memoria. Voz y violín con repertorio personalizado, desde la entrada hasta el primer baile.",
    cEn: "Ceremony, cocktail hour and moments that stay. Voice and violin with a personalised repertoire, from the entrance to the first dance.",
    chEs: ["Ceremonia", "Cóctel", "Repertorio personalizado"],
    chEn: ["Ceremony", "Cocktail", "Custom repertoire"],
    ctaEs: "Consultar disponibilidad",
    ctaEn: "Check availability",
    mEs: "Hola, estoy interesado/a en contratar a Meli Rox para una boda. Quisiera conocer disponibilidad y opciones.",
    mEn: "Hi, I would like to book Meli Rox for a wedding. I would like to know availability and options.",
  },
  {
    id: "quince",
    es: "Fiestas de 15",
    en: "Quinceañeras",
    img: F + "DSC09018.jpg",
    pos: "50% 18%",
    vid: true,
    vidSrc: "/Vids/quince.mp4",
    tone: "linear-gradient(180deg, #0b0a08, #14120a 50%, #0b0a08)",
    tEs: "Una entrada que nadie va a olvidar.",
    tEn: "An entrance no one will forget.",
    cEs: "Voz, violín eléctrico y una puesta en escena creada para convertir la celebración en un momento verdaderamente especial.",
    cEn: "Voice, electric violin and a staging created to turn the celebration into a truly special moment.",
    chEs: ["Entrada especial", "Alas LED", "Canción personalizada"],
    chEn: ["Grand entrance", "LED wings", "Personalised song"],
    ctaEs: "Cotizar una experiencia de 15 años",
    ctaEn: "Enquire for a quinceañera",
    mEs: "Hola, estoy interesado/a en una presentación de Meli Rox para una fiesta de 15 años. Quisiera conocer disponibilidad y formatos.",
    mEn: "Hi, I am interested in a Meli Rox performance for a quinceañera. I would like to know availability and formats.",
  },
  {
    id: "privados",
    es: "Eventos privados",
    en: "Private events",
    img: F + "IMG_6812.JPG",
    vidSrc: "/Vids/privados.mp4",
    pos: "50% 33%",
    tone: "linear-gradient(180deg, #0b0a08, #12100c 50%, #0b0a08)",
    tEs: "Música diseñada a la medida del momento.",
    tEn: "Music designed around the moment.",
    cEs: "Cumpleaños, aniversarios, propuestas y cenas exclusivas — una experiencia íntima y a la medida.",
    cEn: "Birthdays, anniversaries, proposals and exclusive dinners — an intimate, tailor-made experience.",
    chEs: ["Aniversarios", "Propuestas", "Cenas exclusivas"],
    chEn: ["Anniversaries", "Proposals", "Private dinners"],
    ctaEs: "Cotizar evento privado",
    ctaEn: "Enquire for a private event",
    mEs: "Hola, quisiera cotizar una presentación de Meli Rox para un evento privado.",
    mEn: "Hi, I would like a quote for a Meli Rox performance at a private event.",
  },
  {
    id: "corporativos",
    es: "Eventos corporativos",
    en: "Corporate events",
    img: U + "corporate-5250.jpg",
    vidSrc: "/Vids/corporate.mp4",
    pos: "50% 47%",
    tone: "linear-gradient(180deg, #0b0a08, #100f0c 50%, #0b0a08)",
    tEs: "Impacto visual con producción profesional.",
    tEn: "Visual impact with professional production.",
    cEs: "Activaciones de marca, galas, lanzamientos y premiaciones con producción de alto impacto para hoteles y compañías.",
    cEn: "Brand activations, galas, launches and award nights with high-impact production for hotels and companies.",
    chEs: ["Galas", "Lanzamientos", "Activaciones"],
    chEn: ["Galas", "Launches", "Activations"],
    ctaEs: "Cotizar evento corporativo",
    ctaEn: "Enquire for a corporate event",
    mEs: "Hola, quisiera solicitar información para contratar a Meli Rox en un evento corporativo.",
    mEn: "Hi, I would like information about booking Meli Rox for a corporate event.",
  },
  {
    id: "conciertos",
    es: "Conciertos y festivales",
    en: "Concerts & festivals",
    img: F + "IMG_2501.jpg",
    vidSrc: "/Vids/conciertos.mp4",
    pos: "50% 55%",
    vid: true,
    tone: "linear-gradient(180deg, #0b0a08, #0e1010 50%, #0b0a08)",
    tEs: "Música original para grandes escenarios.",
    tEn: "Original music for big stages.",
    cEs: "Violín eléctrico, voz y electrónica en vivo — Afro House, colaboraciones con DJs y festivales.",
    cEn: "Electric violin, voice and live electronics — Afro House, DJ collaborations and festivals.",
    chEs: ["Afro House", "DJs", "Grandes escenarios"],
    chEn: ["Afro House", "DJs", "Big stages"],
    ctaEs: "Consultar show en vivo",
    ctaEn: "Enquire about the live show",
    mEs: "Hola, quisiera conocer el formato de show de Meli Rox para un concierto o festival.",
    mEn: "Hi, I would like to know about Meli Rox’s show format for a concert or festival.",
  },
];

function liveModeDefs(isEn: boolean): { id: string; name: string; img: string; pos: string; cap: string; vidSrc?: string }[] {
  return [
    {
      id: "voz",
      name: isEn ? "Live vocals" : "Voz en vivo",
      img: F + "IMG_2482.jpg",
      vidSrc: "/Vids/voz.mp4",
      pos: "50% 30%",
      cap: isEn
        ? "A voice that fills the stage — festivals, events and full productions."
        : "Una voz que llena el escenario — festivales, eventos y producciones completas.",
    },
    {
      id: "violin",
      name: isEn ? "Electric violin" : "Violín eléctrico",
      img: F + "IMG_2501.jpg",
      vidSrc: "/Vids/violin.mp4",
      pos: "50% 28%",
      cap: isEn
        ? "Classical expression inside modern, electronic energy."
        : "La expresión clásica dentro de la energía electrónica moderna.",
    },
    {
      id: "banda",
      name: isEn ? "Band & DJs" : "Banda y DJs",
      img: F + "party.jpg",
      vidSrc: "/Vids/paradise.mp4",
      pos: "50% 42%",
      cap: isEn
        ? "Live musicians and DJs on stage."
        : "Músicos en vivo y DJs en tarima.",
    },
    {
      id: "colab",
      name: isEn ? "Collaborations" : "Colaboraciones",
      img: F + "party.jpg",
      vidSrc: "/Vids/colab.mp4",
      pos: "50% 40%",
      cap: isEn
        ? "Sessions with DJs, producers and guest artists."
        : "Sesiones con DJs, productores y artistas invitados.",
    },
  ];
}

const REL_DATA = [
  {
    id: "onmyown",
    title: "On My Own",
    metaEs: "Reconocimiento Premios Estela",
    metaEn: "Premios Estela recognition",
    hi: true,
    dEs: "El tema que le dio a Meli Rox un reconocimiento internacional en los Premios Estela — voz y emoción en su forma más pura.",
    dEn: "The track that earned Meli Rox international recognition at the Premios Estela — voice and emotion at their purest.",
  },
  {
    id: "hipnosis",
    title: "Hipnosis",
    metaEs: "Sencillo",
    metaEn: "Single",
    dEs: "Un viaje hipnótico entre voz y frecuencias electrónicas.",
    dEn: "A hypnotic journey between voice and electronic frequencies.",
  },
  {
    id: "criminal",
    title: "Criminal",
    metaEs: "Sencillo",
    metaEn: "Single",
    dEs: "Energía oscura y actitud — el lado más audaz de Rox.",
    dEn: "Dark energy and attitude — Rox at her boldest.",
  },
  {
    id: "moonlight",
    title: "Moonlight",
    metaEs: "Sencillo",
    metaEn: "Single",
    dEs: "Atmósfera nocturna donde el violín respira entre luces.",
    dEn: "A nocturnal atmosphere where the violin breathes between lights.",
  },
  {
    id: "closeyourmouth",
    title: "Close Your Mouth",
    metaEs: "Sencillo",
    metaEn: "Single",
    dEs: "Ritmo directo y confianza en cada compás.",
    dEn: "Direct rhythm and confidence in every bar.",
  },
  {
    id: "time",
    title: "Time",
    metaEs: "Sencillo",
    metaEn: "Single",
    dEs: "Una reflexión melódica sobre lo que permanece.",
    dEn: "A melodic reflection on what remains.",
  },
  {
    id: "pati",
    title: "Pa Ti",
    metaEs: "Sencillo",
    metaEn: "Single",
    dEs: "Calidez latina con la firma de su violín.",
    dEn: "Latin warmth signed by her violin.",
  },
];

const CHAPTERS = [
  {
    num: "01",
    img: F + "DVR_0449.jpg",
    pos: "50% 30%",
    dir: "row",
    tEs: "La base",
    tEn: "The foundation",
    xEs: "A los 12 años comenzó con la viola en la Red de Escuelas de Música de Medellín.",
    xEn: "At 12 she began on the viola in Medellín’s Network of Music Schools.",
  },
  {
    num: "02",
    img: F + "IMG_2482.jpg",
    pos: "50% 15%",
    dir: "row-reverse",
    tEs: "La voz",
    tEn: "The voice",
    xEs: "En el coro descubrió el canto — y una nueva forma de conectarse emocionalmente con la gente.",
    xEn: "In choir she discovered singing — and a new way to connect emotionally with people.",
  },
  {
    num: "03",
    img: F + "Meli%20violin%20(1).jpeg",
    pos: "50% 48%",
    dir: "row",
    tEs: "La transformación",
    tEn: "The transformation",
    xEs: "Pasó al violín y al violín eléctrico, uniendo la expresión clásica con la música electrónica moderna.",
    xEn: "She moved to violin and electric violin, joining classical expression with modern electronic music.",
  },
  {
    num: "04",
    img: F + "DVR_0490.jpg",
    pos: "50% 20%",
    dir: "row-reverse",
    tEs: "Meli Rox",
    tEn: "Meli Rox",
    xEs: "Meli es autenticidad y emoción. Rox es coraje, confianza y libertad.",
    xEn: "Meli is authenticity and emotion. Rox is courage, confidence and freedom.",
  },
];

type Gal = {
  src: string;
  cat: string;
  es: string;
  en: string;
  h: number;
  vid?: string;
  videoSrc?: string;
};

const P = "/Vids/posters/";

const GAL: Gal[] = [
  // Videos (poster = src, plays in lightbox)
  { src: P + "conciertos.jpg", videoSrc: "/Vids/conciertos.mp4", cat: "live", es: "Festival", en: "Festival", h: 440, vid: "0:35" },
  { src: P + "voz.jpg", videoSrc: "/Vids/voz.mp4", cat: "live", es: "Voz en vivo", en: "Live vocals", h: 380, vid: "0:47" },
  { src: P + "violin.jpg", videoSrc: "/Vids/violin.mp4", cat: "live", es: "Violín eléctrico", en: "Electric violin", h: 340, vid: "0:20" },
  { src: P + "bodas.jpg", videoSrc: "/Vids/bodas.mp4", cat: "bodas", es: "Bodas", en: "Weddings", h: 400, vid: "0:30" },
  { src: P + "corporate.jpg", videoSrc: "/Vids/corporate.mp4", cat: "ev", es: "Corporativo", en: "Corporate", h: 380, vid: "0:34" },
  { src: P + "quince.jpg", videoSrc: "/Vids/quince.mp4", cat: "ev", es: "Fiesta de 15", en: "Quinceañera", h: 360, vid: "0:24" },
  { src: P + "privados.jpg", videoSrc: "/Vids/privados.mp4", cat: "ev", es: "Evento privado", en: "Private event", h: 400, vid: "0:30" },
  { src: P + "paradise.jpg", videoSrc: "/Vids/paradise.mp4", cat: "live", es: "En vivo", en: "Live", h: 340, vid: "0:28" },
  { src: P + "banda.jpg", videoSrc: "/Vids/banda.mp4", cat: "live", es: "Banda", en: "Band", h: 360, vid: "0:35" },
  { src: P + "colab.jpg", videoSrc: "/Vids/colab.mp4", cat: "live", es: "Colaboración", en: "Collaboration", h: 300, vid: "0:38" },
  // Photos
  { src: F + "wedding.jpg", cat: "bodas", es: "Bodas", en: "Weddings", h: 400 },
  { src: F + "DSC08415.jpg", cat: "live", es: "En vivo", en: "Live", h: 340 },
  { src: F + "DVR_0449.jpg", cat: "ses", es: "Sesión", en: "Session", h: 380 },
  { src: F + "IMG_2482.jpg", cat: "live", es: "En vivo", en: "Live", h: 300 },
  { src: U + "IMG_5220.JPG.jpeg", cat: "ev", es: "Eventos", en: "Events", h: 420 },
  { src: F + "DVR_0367.jpg", cat: "ses", es: "Sesión", en: "Session", h: 300 },
  { src: F + "IMG_1922.JPG", cat: "bodas", es: "Bodas", en: "Weddings", h: 380 },
  { src: F + "IMG_2501.jpg", cat: "live", es: "Festival", en: "Festival", h: 340 },
  { src: F + "DVR_0490.jpg", cat: "ses", es: "Sesión", en: "Session", h: 320 },
  { src: F + "wedding1.jpg", cat: "bodas", es: "Bodas", en: "Weddings", h: 360 },
  { src: F + "IMG_6812.JPG", cat: "ev", es: "Eventos", en: "Events", h: 300 },
  { src: F + "DSC08345.jpg", cat: "ses", es: "Sesión", en: "Session", h: 400 },
  { src: F + "party.jpg", cat: "live", es: "En vivo", en: "Live", h: 320 },
  { src: F + "Meli%20violin%20(1).jpeg", cat: "live", es: "Club", en: "Club", h: 340 },
  { src: F + "DVR_0523.jpg", cat: "ses", es: "Sesión", en: "Session", h: 300 },
];

const FDEFS = [
  { id: "all", es: "Todo", en: "All" },
  { id: "live", es: "En vivo", en: "Live" },
  { id: "bodas", es: "Bodas", en: "Weddings" },
  { id: "ev", es: "Eventos", en: "Events" },
  { id: "ses", es: "Backstage", en: "Backstage" },
];

const GOLD = "linear-gradient(135deg, #ecd9ac, #b98f4e)";

export default function Home() {
  const [lang, setLang] = useState<"es" | "en" | null>(null);
  const [cat, setCat] = useState("bodas");
  const [vidSound, setVidSound] = useState(false);
  const [mix, setMix] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [prog, setProg] = useState(0);
  const [filter, setFilter] = useState("all");
  const [openRel, setOpenRel] = useState<string | null>(null);
  const [lb, setLb] = useState<{ src?: string; videoSrc?: string; alt: string } | null>(null);
  const [liveMode, setLiveMode] = useState("voz");
  const [vw, setVw] = useState(1200);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let l: string | null = null;
    try {
      l = localStorage.getItem("mr_lang");
    } catch {}
    if (l === "en" || l === "es") setLang(l);
    setVw(window.innerWidth);
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => {
      window.removeEventListener("resize", onR);
    };
  }, []);

  const chooseLang = (l: "es" | "en") => {
    setLang(l);
    try {
      localStorage.setItem("mr_lang", l);
    } catch {}
  };

  const isEn = (lang ?? "es") === "en";
  const t = (es: string, en: string) => (isEn ? en : es);
  const isMobile = vw < 760;

  const waMain = wa(
    isEn
      ? "Hi, I would like to know the options and availability to book Meli Rox."
      : "Hola, quisiera conocer las opciones y disponibilidad para contratar a Meli Rox."
  );
  const waCollab = wa(
    isEn
      ? "Hi, I would like to talk about a possible artistic collaboration with Meli Rox."
      : "Hola, quisiera conversar sobre una posible colaboración artística con Meli Rox."
  );
  const waNotify = wa(
    isEn
      ? "Hi! Let me know when Meli Rox’s new song is released."
      : "¡Hola! Quiero que me avisen cuando salga la nueva canción de Meli Rox."
  );

  const activeCat = CATS.find((c) => c.id === cat) || CATS[0];
  const lms = liveModeDefs(isEn);
  const activeLive = lms.find((m) => m.id === liveMode) || lms[0];

  const galleryFiltered = GAL.filter((g) => filter === "all" || g.cat === filter);
  const galleryVids = galleryFiltered.filter((g) => g.videoSrc);
  const galleryPics = galleryFiltered.filter((g) => !g.videoSrc);
  const galleryItems: Gal[] = [];
  for (let i = 0; i < Math.max(galleryVids.length, galleryPics.length); i++) {
    if (galleryVids[i]) galleryItems.push(galleryVids[i]);
    if (galleryPics[i]) galleryItems.push(galleryPics[i]);
  }

  // Resting waveform shown when idle (bars react to the real song while playing)
  const restHeights = Array.from({ length: BAR_COUNT }, (_, i) =>
    Math.round(8 + 30 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)))
  );

  const mixCaption =
    mix < 35
      ? t("Cálida, íntima, emocional.", "Warm, intimate, emotional.")
      : mix > 65
      ? t("Eléctrica, audaz, imparable.", "Electric, fearless, unstoppable.")
      : t("Dos lados. Una sola artista.", "Two sides. One artist.");

  const pillWrap = "wrap";
  const pillOx = "visible";
  const fmt = (s: number) => "0:" + String(Math.round(s)).padStart(2, "0");
  const progLabel = fmt(prog * PREVIEW_SECONDS) + " / " + fmt(PREVIEW_SECONDS);

  const setupAudioGraph = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    const src = ctx.createMediaElementSource(audioRef.current);
    src.connect(analyser);
    analyser.connect(ctx.destination);
    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
    srcRef.current = src;
  };

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      setupAudioGraph();
      audioCtxRef.current?.resume();
      a.play();
      setPlaying(true);
    }
  };

  // Drive the bars from the song's live frequency data while it plays
  useEffect(() => {
    if (!playing) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      barRefs.current.forEach((el, i) => {
        if (el) el.style.height = (restHeights[i] ?? 12) + "px";
      });
      return;
    }
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const usable = Math.floor(analyser.frequencyBinCount * 0.72);
    const animate = () => {
      analyser.getByteFrequencyData(data);
      const n = barRefs.current.length;
      for (let i = 0; i < n; i++) {
        const el = barRefs.current[i];
        if (!el) continue;
        const bin = Math.min(usable - 1, Math.floor((i / n) * usable));
        const v = data[bin] / 255;
        el.style.height = (6 + v * 46).toFixed(1) + "px";
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // Close the audio context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Reset category-video sound state when switching categories
  useEffect(() => {
    setVidSound(false);
  }, [cat]);

  const pillStyle = (on: boolean): CSSProperties =>
    CSS({
      cursor: "pointer",
      whiteSpace: "nowrap",
      flex: "0 0 auto",
      fontSize: "13.5px",
      fontWeight: 600,
      letterSpacing: ".08em",
      padding: "14px 24px",
      borderRadius: "999px",
      background: on ? GOLD : "transparent",
      color: on ? "#171208" : "#ddd2b8",
      border: "1px solid " + (on ? "transparent" : "rgba(212,180,122,.35)"),
      transition: "all .3s",
      minHeight: "44px",
    });

  const navLink: CSSProperties = {
    color: "#ddd2b8",
    textDecoration: "none",
    padding: "8px 2px",
  };
  const mobileLink: CSSProperties = {
    textDecoration: "none",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "34px",
    color: "#f4edda",
    padding: "10px 0",
    borderBottom: "1px solid rgba(212,180,122,.14)",
  };

  const langToggle = (
    <div style={{ display: "flex", gap: "2px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".08em", flex: "0 0 auto" }}>
      <button onClick={() => chooseLang("es")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 8px", color: isEn ? "#a99a7c" : "#ecd9ac", borderBottom: "1px solid " + (isEn ? "transparent" : "#d4b47a") }}>ES</button>
      <button onClick={() => chooseLang("en")} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 8px", color: isEn ? "#ecd9ac" : "#a99a7c", borderBottom: "1px solid " + (isEn ? "#d4b47a" : "transparent") }}>EN</button>
    </div>
  );

  const burger = (
    <button onClick={() => setMenuOpen((v) => !v)} aria-label="Menú" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", background: "none", border: "1px solid rgba(212,180,122,.4)", borderRadius: "50%", color: "#ecd9ac", fontSize: "16px", cursor: "pointer", flex: "0 0 auto" }}>{menuOpen ? "✕" : "☰"}</button>
  );

  return (
    <>
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          padding: isMobile ? "12px clamp(20px, 6vw, 48px)" : "16px clamp(16px, 4vw, 48px)",
          background: "rgba(11,10,8,.82)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(212,180,122,.14)",
        }}
      >
        <a href="#inicio" style={{ display: "flex", alignItems: "center", textDecoration: "none", flex: "0 0 auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={U + "meli-rox-logo-clean-print-transparent.png"} alt="Meli Rox" style={{ height: isMobile ? "88px" : "78px", width: "auto", margin: isMobile ? "-24px 0 -24px -14px" : "-20px 0 -20px -14px" }} />
        </a>
        {isMobile ? (
          langToggle
        ) : (
          <div
            style={CSS({
              display: "flex",
              alignItems: "center",
              gap: "clamp(14px, 2.4vw, 30px)",
              flex: "1 1 auto",
              justifyContent: "center",
              flexWrap: "wrap",
              fontSize: "13.5px",
              fontWeight: 500,
              letterSpacing: ".06em",
            })}
          >
            <a href="#musica" style={navLink}>{t("Música", "Music")}</a>
            <a href="#envivo" style={navLink}>{t("En vivo", "Live")}</a>
            <a href="#experiencias" style={navLink}>{t("Experiencias", "Experiences")}</a>
            <a href="#historia" style={navLink}>Meli Rox</a>
            <a href="#galeria" style={navLink}>{t("Galería", "Gallery")}</a>
            <a href="#contacto" style={navLink}>{t("Contacto", "Contact")}</a>
          </div>
        )}
        {isMobile ? (
          burger
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: "0 0 auto" }}>
            {langToggle}
            <a href={waMain} target="_blank" style={{ textDecoration: "none", fontSize: "12.5px", fontWeight: 600, letterSpacing: ".06em", color: "#171208", background: GOLD, padding: "11px 18px", borderRadius: "999px", whiteSpace: "nowrap" }}>{t("Cotiza tu experiencia", "Book Meli Rox")}</a>
          </div>
        )}
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && isMobile && (
        <div style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(8,7,6,.97)", backdropFilter: "blur(10px)", padding: "110px clamp(24px, 8vw, 48px) 40px", display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
          <a href="#musica" onClick={() => setMenuOpen(false)} style={mobileLink}>{t("Música", "Music")}</a>
          <a href="#envivo" onClick={() => setMenuOpen(false)} style={mobileLink}>{t("En vivo", "Live")}</a>
          <a href="#experiencias" onClick={() => setMenuOpen(false)} style={mobileLink}>{t("Experiencias", "Experiences")}</a>
          <a href="#historia" onClick={() => setMenuOpen(false)} style={mobileLink}>Meli Rox</a>
          <a href="#galeria" onClick={() => setMenuOpen(false)} style={mobileLink}>{t("Galería", "Gallery")}</a>
          <a href="#contacto" onClick={() => setMenuOpen(false)} style={mobileLink}>{t("Contacto", "Contact")}</a>
          <a href={waMain} target="_blank" onClick={() => setMenuOpen(false)} style={{ marginTop: "26px", textAlign: "center", textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "17px 28px", borderRadius: "999px" }}>{t("Cotiza tu experiencia", "Book Meli Rox")}</a>
        </div>
      )}

      {/* HERO */}
      <header id="inicio" className="hero-fold" style={{ position: "relative", display: "flex", alignItems: isMobile ? "flex-end" : "center", overflow: "hidden", background: "#080706" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <video ref={heroVideoRef} src="/Vids/hero.mp4" poster="/Vids/hero-poster.jpg" autoPlay muted loop playsInline preload="auto" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: isMobile ? "50% 30%" : "68% 30%", filter: "saturate(.94) brightness(.9) contrast(1.03)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,7,6,.92) 0%, rgba(8,7,6,.68) 34%, rgba(8,7,6,.12) 62%, rgba(8,7,6,.42) 100%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: isMobile ? "68%" : "34%", background: isMobile ? "linear-gradient(180deg, transparent 0%, rgba(8,7,6,.28) 34%, rgba(8,7,6,.62) 58%, rgba(8,7,6,.88) 80%, rgba(8,7,6,.97) 100%)" : "linear-gradient(180deg, transparent, rgba(8,7,6,.9))" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 45% 45% at 22% 62%, rgba(212,164,90,.1), transparent 70%)" }} />
        </div>
        <div style={{ position: "relative", width: "min(1240px, 100%)", margin: "0 auto", padding: isMobile ? "0 clamp(20px, 5vw, 48px) clamp(52px, 9vh, 96px)" : "clamp(96px, 14vh, 140px) clamp(20px, 5vw, 48px) clamp(48px, 8vh, 80px)" }}>
          <div style={{ maxWidth: "580px" }}>
            <div style={{ height: isMobile ? "40px" : "52px", width: "1px", margin: "0 0 8px", background: "linear-gradient(180deg, transparent, #e8cf9e)", animation: "mrPulse 3.5s ease-in-out infinite" }} />
            {!isMobile && (
              <div style={{ width: "min(310px, 62vw)", overflow: "visible" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={U + "meli-rox-logo-clean-print-transparent.png"} alt="Meli Rox" style={{ display: "block", width: "135.9%", height: "auto", margin: "-21.5% 0 -28.6% -15.8%", maxWidth: "none" }} />
              </div>
            )}
            <div style={{ marginTop: "10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "clamp(12px, 1.5vw, 14px)", letterSpacing: ".32em", textTransform: "uppercase", color: "#e3d5b0" }}>
              {t("Cantautora · Violinista · Artista en vivo", "Singer-songwriter · Violinist · Live artist")}
            </div>
            <p style={CSS({ margin: "20px 0 0", maxWidth: "480px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px, 2.8vw, 30px)", lineHeight: 1.35, color: "#f3ead6", textWrap: "balance" })}>
              {t("Donde la elegancia clásica se encuentra con la energía moderna.", "Where classical elegance meets modern energy.")}
            </p>
            <div style={{ marginTop: "32px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <a href={waMain} target="_blank" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "17px 32px", borderRadius: "999px" }}>{t("Cotiza tu experiencia", "Book your experience")}</a>
              <a href="#envivo" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(232,207,158,.6)", padding: "17px 32px", borderRadius: "999px", background: "rgba(8,7,6,.4)", backdropFilter: "blur(4px)" }}>{t("Verla en vivo", "See her live")}</a>
            </div>
          </div>
        </div>
      </header>

      {/* STATEMENT */}
      <section style={{ position: "relative", padding: "clamp(46px, 9vw, 130px) clamp(20px, 5vw, 48px)", textAlign: "center", background: "linear-gradient(180deg, #0b0a08, #14100a 55%, #0b0a08)" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto" }}>
          <h2 style={CSS({ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(36px, 6vw, 68px)", lineHeight: 1.1, color: "#f4edda", textWrap: "pretty" })}>
            {isEn ? (<>Not just a singer.<br />Not just a violinist.</>) : (<>No es solo una cantante.<br />No es solo una violinista.</>)}
          </h2>
          <div style={{ width: "56px", height: "1px", background: "linear-gradient(90deg, transparent, #d4b47a, transparent)", margin: "30px auto" }} />
          <p style={CSS({ margin: "0 auto", maxWidth: "660px", fontWeight: 300, fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.8, color: "#cabfa5", textWrap: "pretty" })}>
            {t("Meli Rox une voz, violín eléctrico y música original en una experiencia donde la elegancia clásica se encuentra con la energía contemporánea.", "Meli Rox brings together voice, electric violin and original music in an experience where classical elegance meets contemporary energy.")}
          </p>
        </div>
      </section>

      {/* MELI / ROX */}
      <section style={{ position: "relative", padding: "0 clamp(20px, 5vw, 48px) clamp(46px, 8vw, 120px)", background: "#0b0a08" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", marginBottom: "20px" }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 400, lineHeight: 1, color: mix <= 50 ? "#ecd9ac" : "#7d7159", transition: "color .4s" }}>Meli</div>
              <div style={{ marginTop: "8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Cálida · Íntima · Emocional", "Warm · Intimate · Emotional")}</div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".26em", textTransform: "uppercase", color: "#a99a7c", textAlign: "center", paddingBottom: "10px" }}>
              {t("← Desliza la cuerda →", "← Slide the string →")}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 400, fontStyle: "italic", lineHeight: 1, color: mix > 50 ? "#ecd9ac" : "#7d7159", transition: "color .4s" }}>Rox</div>
              <div style={{ marginTop: "8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Eléctrica · Audaz · Imparable", "Electric · Fearless · Unstoppable")}</div>
            </div>
          </div>
          <div style={{ position: "relative", height: "clamp(400px, 64vh, 660px)", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.18)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={F + "wedding.jpg"} alt="Meli — cálida, íntima, emocional" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: isMobile ? "50% 20%" : "50% 30%", filter: "sepia(.26) saturate(.82) brightness(.96)", transform: `scale(${1 + mix * 0.0006})`, transition: "transform .6s" }} />
            <div style={{ position: "absolute", inset: 0, opacity: mix / 100, transition: "opacity .7s ease" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={F + "DSC08415.jpg"} alt="Rox — eléctrica, audaz, imparable" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: isMobile ? "50% 14%" : "50% 24%", filter: "saturate(1.08) brightness(.95) contrast(1.06)" }} />
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(11,10,8,.55), transparent 40%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: "20px", textAlign: "center", pointerEvents: "none" }}>
              <div style={{ display: "inline-block", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(20px, 2.4vw, 27px)", color: "#f6efdd", textShadow: "0 1px 14px rgba(0,0,0,.85)", background: "rgba(8,7,6,.35)", backdropFilter: "blur(4px)", padding: "10px 22px", borderRadius: "999px" }}>{mixCaption}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "24px" }}>
            <button onClick={() => setMix(0)} style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".08em", padding: "13px 26px", borderRadius: "999px", background: mix < 50 ? GOLD : "transparent", color: mix < 50 ? "#171208" : "#ddd2b8", border: "1px solid " + (mix < 50 ? "transparent" : "rgba(212,180,122,.35)"), transition: "all .3s", minHeight: "44px" }}>Meli</button>
            <input type="range" className="mrmix" min={0} max={100} value={mix} onChange={(e) => setMix(+e.target.value)} onMouseUp={() => setMix(mix < 50 ? 0 : 100)} onTouchEnd={() => setMix(mix < 50 ? 0 : 100)} aria-label="Meli a Rox" style={{ display: "block", flex: "1 1 auto", cursor: "ew-resize", minWidth: "120px" }} />
            <button onClick={() => setMix(100)} style={{ cursor: "pointer", fontSize: "13.5px", fontWeight: 600, fontStyle: "italic", letterSpacing: ".08em", padding: "13px 26px", borderRadius: "999px", background: mix >= 50 ? GOLD : "transparent", color: mix >= 50 ? "#171208" : "#ddd2b8", border: "1px solid " + (mix >= 50 ? "transparent" : "rgba(212,180,122,.35)"), transition: "all .3s", minHeight: "44px" }}>Rox</button>
          </div>
          <p style={{ margin: "clamp(40px, 6vw, 60px) auto 0", textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(30px, 4.6vw, 54px)", lineHeight: 1.2, color: "#f4edda" }}>
            {isEn ? (<>Meli is the artist.<br /><em style={{ color: "#e8cf9e" }}>Rox is the courage.</em></>) : (<>Meli es la artista.<br /><em style={{ color: "#e8cf9e" }}>Rox es el coraje.</em></>)}
          </p>
        </div>
      </section>

      {/* EN VIVO */}
      <section id="envivo" style={{ position: "relative", background: "#0b0a08", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ position: "relative", height: "clamp(460px, 80vh, 760px)", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={F + "IMG_2471.jpg"} alt="Meli Rox en tarima con alas iridiscentes" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%", filter: "saturate(1.02) brightness(.88)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,10,8,.5), transparent 30%, rgba(11,10,8,.96) 82%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: "clamp(30px, 6vw, 64px)", padding: "0 clamp(20px, 5vw, 48px)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#e3d5b0", textShadow: "0 1px 10px rgba(0,0,0,.8)" }}>{t("En vivo", "Live")}</div>
              <h2 style={CSS({ margin: "12px 0 0", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(38px, 6.4vw, 78px)", lineHeight: 1.04, color: "#f9f4e4", maxWidth: "820px", textWrap: "pretty", textShadow: "0 2px 30px rgba(0,0,0,.85)" })}>
                {isEn ? (<>She doesn&apos;t perform the stage.<br /><em style={{ color: "#e8cf9e" }}>She transforms it.</em></>) : (<>No interpreta el escenario.<br /><em style={{ color: "#e8cf9e" }}>Lo transforma.</em></>)}
              </h2>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(20px, 3vw, 36px) clamp(20px, 5vw, 48px) clamp(28px, 4vw, 48px)" }}>
          <div style={CSS({ display: "flex", gap: "10px", flexWrap: pillWrap as CSSProperties["flexWrap"], overflowX: pillOx as CSSProperties["overflowX"], paddingBottom: "4px" })}>
            {lms.map((m) => (
              <button key={m.id} onClick={() => setLiveMode(m.id)} style={pillStyle(m.id === liveMode)}>{m.name}</button>
            ))}
          </div>
          <div style={{ position: "relative", marginTop: "18px", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.2)", height: "clamp(320px, 52vw, 620px)" }}>
            {activeLive.vidSrc ? (
              <CategoryVideo key={liveMode} src={activeLive.vidSrc} pos={activeLive.pos} />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={activeLive.img} alt={activeLive.cap} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: activeLive.pos, filter: "saturate(.95) brightness(.9)" }} />
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(11,10,8,.85))", pointerEvents: "none" }} />
            {!activeLive.vidSrc && (
              <>
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "86px", height: "86px", borderRadius: "50%", border: "1px solid rgba(232,207,158,.75)", background: "rgba(8,7,6,.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ecd9ac", pointerEvents: "none" }}><PlayIcon size={28} color="#ecd9ac" /></div>
                <div style={{ position: "absolute", right: "16px", bottom: "18px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".16em", textTransform: "uppercase", color: "#eee3c2", background: "rgba(8,7,6,.6)", backdropFilter: "blur(4px)", padding: "7px 11px", borderRadius: "3px" }}>00:18</div>
              </>
            )}
            <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "20px", pointerEvents: "none" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".24em", textTransform: "uppercase", color: "#d9c9a4" }}>{activeLive.name}</div>
              <div style={{ marginTop: "8px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 32px)", color: "#f7f1e0", lineHeight: 1.2, textShadow: "0 1px 12px rgba(0,0,0,.8)" }}>{activeLive.cap}</div>
            </div>
          </div>
        </div>
        <div style={{ overflow: "hidden", borderTop: "1px solid rgba(212,180,122,.14)", borderBottom: "1px solid rgba(212,180,122,.14)", padding: "20px 0", whiteSpace: "nowrap" }}>
          <div style={{ display: "inline-flex", gap: "52px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", letterSpacing: ".26em", textTransform: "uppercase", color: "#cabfa5", animation: "mrDrift 32s linear infinite" }}>
            <span>{t("Voz en vivo · Violín eléctrico · Afro House · Repertorio personalizado · Colaboraciones con DJs · Banda en vivo · Alas LED · Experiencias personalizadas · ", "Live vocals · Electric violin · Afro House · Custom repertoire · DJ collaborations · Full band · LED wings · Custom experiences · ")}</span>
            <span>{t("Voz en vivo · Violín eléctrico · Afro House · Repertorio personalizado · Colaboraciones con DJs · Banda en vivo · Alas LED · Experiencias personalizadas · ", "Live vocals · Electric violin · Afro House · Custom repertoire · DJ collaborations · Full band · LED wings · Custom experiences · ")}</span>
          </div>
        </div>
      </section>

      {/* EXPERIENCIAS */}
      <section id="experiencias" style={{ position: "relative", padding: "clamp(44px, 7.5vw, 110px) clamp(20px, 5vw, 48px)", background: activeCat.tone, transition: "background 1s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Experiencias", "Experiences")}</div>
          <h2 style={CSS({ margin: "12px 0 0", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.12, color: "#f4edda", maxWidth: "760px", textWrap: "pretty" })}>{t("Cada ocasión merece su propia energía.", "Every occasion deserves its own energy.")}</h2>
          <p style={CSS({ margin: "18px 0 0", maxWidth: "640px", fontWeight: 300, fontSize: "16.5px", lineHeight: 1.75, color: "#cabfa5", textWrap: "pretty" })}>{t("Desde momentos íntimos hasta grandes escenarios, cada presentación se diseña alrededor de la emoción, el espacio y las personas que la vivirán.", "From intimate moments to grand stages, every performance is designed around the emotion, the space and the people who will live it.")}</p>
          <div style={CSS({ marginTop: "clamp(30px, 4vw, 44px)", display: isMobile ? "grid" : "flex", gridTemplateColumns: isMobile ? "1fr 1fr" : undefined, gap: "10px", flexWrap: "wrap", paddingBottom: "4px" })}>
            {CATS.map((c, i) => {
              const lastOdd = isMobile && i === CATS.length - 1 && CATS.length % 2 === 1;
              return (
                <button key={c.id} onClick={() => setCat(c.id)} style={{ ...pillStyle(c.id === cat), padding: isMobile ? "13px 10px" : "14px 24px", whiteSpace: isMobile ? "normal" : "nowrap", ...(lastOdd ? { gridColumn: "1 / -1" } : {}) }}>{t(c.es, c.en)}</button>
              );
            })}
          </div>
          <div style={{ marginTop: "26px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(24px, 4vw, 52px)", alignItems: "stretch" }}>
            <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.18)", minHeight: "clamp(340px, 52vh, 520px)" }}>
              {activeCat.vidSrc ? (
                <CategoryVideo key={activeCat.id} src={activeCat.vidSrc} pos={activeCat.pos} onActivate={() => setVidSound(true)} />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={activeCat.img} alt={t(activeCat.es, activeCat.en)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: activeCat.pos, filter: "saturate(.92) brightness(.9)", transition: "opacity .5s" }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(11,10,8,.75))", pointerEvents: "none" }} />
              {activeCat.vid && !activeCat.vidSrc && (
                <div style={{ position: "absolute", top: "14px", right: "14px", display: "flex", alignItems: "center", gap: "9px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10.5px", letterSpacing: ".16em", textTransform: "uppercase", color: "#eee3c2", background: "rgba(8,7,6,.6)", backdropFilter: "blur(4px)", padding: "8px 12px", borderRadius: "999px", pointerEvents: "none" }}>
                  <PlayIcon size={11} color="#ecd9ac" /><span>Video · 00:15</span>
                </div>
              )}
              {!vidSound && (
                <div style={{ position: "absolute", left: "18px", bottom: "16px", right: "18px", display: "flex", gap: "10px", flexWrap: "wrap", pointerEvents: "none" }}>
                  {(isEn ? activeCat.chEn : activeCat.chEs).map((ch) => (
                    <span key={ch} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#eee3c2", background: "rgba(11,10,8,.6)", border: "1px solid rgba(212,180,122,.3)", padding: "7px 12px", borderRadius: "999px", backdropFilter: "blur(4px)" }}>{ch}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(4px, 2vw, 16px) 0" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(34px, 4.8vw, 56px)", lineHeight: 1.02, color: "#f4edda" }}>{t(activeCat.es, activeCat.en)}</div>
              <div style={CSS({ marginTop: "16px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(19px, 2.2vw, 24px)", lineHeight: 1.4, color: "#e8cf9e", textWrap: "pretty" })}>{t(activeCat.tEs, activeCat.tEn)}</div>
              <div style={{ width: "44px", height: "1px", background: "#d4b47a", margin: "22px 0" }} />
              <p style={CSS({ margin: 0, fontWeight: 300, fontSize: "16.5px", lineHeight: 1.8, color: "#cabfa5", maxWidth: "480px", textWrap: "pretty" })}>{t(activeCat.cEs, activeCat.cEn)}</p>
              <div style={{ marginTop: "30px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                <a href={wa(isEn ? activeCat.mEn : activeCat.mEs)} target="_blank" style={{ textDecoration: "none", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "16px 28px", borderRadius: "999px" }}>{t(activeCat.ctaEs, activeCat.ctaEn)}</a>
                <a href={"tel:" + PHONE} style={{ textDecoration: "none", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#ddd2b8", padding: "16px 6px", borderBottom: "1px solid rgba(212,180,122,.35)" }}>{t("Llamar", "Call")}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGROS */}
      <section style={{ position: "relative", padding: "clamp(44px, 7.5vw, 110px) clamp(20px, 5vw, 48px)", background: "#0d0b09", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={CSS({ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(32px, 4.8vw, 58px)", lineHeight: 1.12, color: "#f4edda", maxWidth: "800px", textWrap: "pretty" })}>
            {isEn ? (<>Born in Medellín. <em style={{ color: "#e8cf9e" }}>Heard beyond borders.</em></>) : (<>Nacida en Medellín. <em style={{ color: "#e8cf9e" }}>Escuchada más allá de las fronteras.</em></>)}
          </h2>
          <div style={{ marginTop: "clamp(36px, 5vw, 56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "14px", alignItems: "stretch" }}>
            <div style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ border: "1px solid rgba(212,180,122,.24)", borderRadius: "4px", padding: "clamp(26px, 3.6vw, 42px)", background: "radial-gradient(ellipse 100% 90% at 0% 0%, rgba(138,106,63,.18), transparent 65%), #0a0908", flex: "1 1 auto" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(72px, 9vw, 120px)", lineHeight: 0.9, color: "#f1e2ba" }}>10+</div>
                <div style={{ marginTop: "10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Años en la música", "Years in music")}</div>
                <p style={CSS({ margin: "16px 0 0", fontWeight: 300, fontSize: "16px", lineHeight: 1.7, color: "#cabfa5", textWrap: "pretty" })}>{t("Creando, interpretando y transformando escenarios — desde la Red de Escuelas de Música de Medellín.", "Creating, performing and transforming stages — from Medellín's Network of Music Schools.")}</p>
              </div>
              <div style={{ border: "1px solid rgba(212,180,122,.24)", borderRadius: "4px", padding: "clamp(22px, 3vw, 32px)", background: "#0a0908" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Escenarios del mundo", "Stages of the world")}</div>
                <div style={{ marginTop: "14px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(21px, 2.4vw, 27px)", lineHeight: 1.55, color: "#f2ecdf" }}>Colombia · {t("Estados Unidos", "United States")} · Francia · Guatemala · España</div>
                <p style={{ margin: "12px 0 0", fontWeight: 300, fontSize: "15px", lineHeight: 1.7, color: "#cabfa5" }}>{t("Incluyendo temporadas de entretenimiento en cruceros internacionales.", "Including international cruise-ship entertainment seasons.")}</p>
              </div>
            </div>
            <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.24)", minHeight: "420px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={F + "IMG_2501.jpg"} alt="Meli Rox — violín eléctrico en festival" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%", filter: "saturate(.95) brightness(.85)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(10,9,8,.9))" }} />
              <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "20px" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#d9c9a4" }}>Festival</div>
                <div style={{ marginTop: "8px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 2.8vw, 32px)", color: "#f7f1e0", lineHeight: 1.2 }}>{t("En vivo en La Solar y el Medellín Music Lab.", "Live at La Solar and Medellín Music Lab.")}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ border: "1px solid rgba(232,207,158,.4)", borderRadius: "4px", padding: "clamp(22px, 3vw, 32px)", background: "linear-gradient(160deg, rgba(212,164,90,.16), rgba(10,9,8,0) 55%), #0a0908" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>Radio</div>
                <div style={{ marginTop: "12px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: "clamp(26px, 3vw, 36px)", lineHeight: 1.1, color: "#f1e2ba" }}>#1 <span style={{ fontSize: ".62em", fontStyle: "italic" }}>en La X 103.9</span></div>
                <p style={{ margin: "10px 0 0", fontWeight: 300, fontSize: "15px", lineHeight: 1.7, color: "#cabfa5" }}>&quot;Paradise 42&quot; — Mak Negron ft. Meli Rox.</p>
              </div>
              <div style={{ border: "1px solid rgba(212,180,122,.24)", borderRadius: "4px", padding: "clamp(22px, 3vw, 32px)", background: "#0a0908", flex: "1 1 auto" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Premio", "Award")}</div>
                <div style={{ marginTop: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(21px, 2.4vw, 27px)", lineHeight: 1.35, color: "#f2ecdf" }}>{t("Reconocimiento internacional Premios Estela por «On My Own».", "International Premios Estela recognition for “On My Own”.")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MUSICA */}
      <section id="musica" style={{ position: "relative", padding: "clamp(44px, 7.5vw, 110px) clamp(20px, 5vw, 48px)", background: "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(138,106,63,.14), transparent 60%), #0a0908", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Música original", "Original music")}</div>
          <h2 style={CSS({ margin: "12px 0 0", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(34px, 5vw, 60px)", color: "#f4edda", maxWidth: "700px", lineHeight: 1.12, textWrap: "pretty" })}>{t("De las cuerdas a las frecuencias.", "From strings to frequencies.")}</h2>
          <div style={{ marginTop: "clamp(36px, 5vw, 60px)", border: "1px solid rgba(212,180,122,.26)", borderRadius: "4px", overflow: "hidden", background: "#0e0c09", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div style={{ padding: "clamp(28px, 4vw, 48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Lanzamiento destacado", "Featured release")}</div>
              <div style={{ marginTop: "20px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(40px, 5.6vw, 72px)", lineHeight: 0.95, color: "#f7f1e0" }}>#1 <span style={{ fontSize: ".5em", fontStyle: "italic", color: "#e8cf9e", letterSpacing: ".02em" }}>en La X 103.9</span></div>
              <div style={{ marginTop: "22px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 3.6vw, 44px)", fontWeight: 400, color: "#f4edda", lineHeight: 1 }}>Paradise 42</div>
              <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: 500, letterSpacing: ".1em", textTransform: "uppercase", color: "#b6aa8f" }}>Mak Negron ft. Meli Rox · Exceder Records</div>
              <p style={CSS({ margin: "18px 0 0", fontWeight: 300, fontSize: "16px", lineHeight: 1.75, color: "#cabfa5", maxWidth: "440px", textWrap: "pretty" })}>{t("La colaboración que llegó al primer lugar de Las 20 de La X Medellín — la frecuencia de Meli Rox sonando en toda la ciudad.", "The collaboration that reached #1 on Las 20 de La X Medellín — the Meli Rox frequency playing across the city.")}</p>
              <div style={{ marginTop: "26px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <a href="https://open.spotify.com/artist/0Me2xPijWmN9C9P2Vs5IGP" target="_blank" style={{ textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "13px 24px", borderRadius: "999px" }}>Spotify</a>
                <a href="https://www.youtube.com/@meliroxmusic" target="_blank" style={{ textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(212,180,122,.5)", padding: "13px 24px", borderRadius: "999px" }}>YouTube</a>
              </div>
            </div>
            <div style={{ position: "relative", minHeight: "380px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={F + "DSC08345.jpg"} alt="Meli Rox — retrato de escenario" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%", filter: "saturate(.92) brightness(.95)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #0e0c09, transparent 30%)" }} />
              <figure style={{ margin: 0, position: "absolute", right: "18px", bottom: "18px", width: "min(190px, 42%)", border: "1px solid rgba(232,207,158,.5)", borderRadius: "3px", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,.6)", cursor: "zoom-in" }} onClick={() => setLb({ src: U + "lax_proof-1784055218158.jpeg", alt: "Paradise 42 — Puesto #1, Las 20 de La X" })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={U + "lax_proof-1784055218158.jpeg"} alt="Paradise 42 — Puesto #1, Las 20 de La X" style={{ display: "block", width: "100%", height: "auto" }} />
                <figcaption style={{ padding: "8px 10px", background: "rgba(11,10,8,.92)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10.5px", letterSpacing: ".14em", textTransform: "uppercase", color: "#e3d5b0" }}>{t("Anuncio oficial · La X", "Official proof · La X")}</figcaption>
              </figure>
            </div>
          </div>
          <div style={{ marginTop: "clamp(36px, 5vw, 56px)" }}>
            {REL_DATA.map((r, i) => {
              const open = openRel === r.id;
              return (
                <div key={r.id} style={{ borderTop: "1px solid rgba(212,180,122,.14)", background: open ? "rgba(212,180,122,.07)" : "transparent", transition: "background .5s" }}>
                  <button onClick={() => setOpenRel(open ? null : r.id)} style={{ display: "flex", alignItems: "baseline", gap: "clamp(14px, 3vw, 30px)", width: "100%", textAlign: "left", padding: "20px 10px", background: "none", border: "none", cursor: "pointer", color: "#f2ecdf" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#a99a7c", width: "30px", flex: "0 0 auto" }}>{"0" + (i + 1)}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 3.6vw, 40px)", fontWeight: 400, lineHeight: 1.05, flex: "1 1 auto", color: "inherit" }}>{r.title}</span>
                    <span style={{ fontSize: "12.5px", fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: r.hi ? "#e8cf9e" : "#a99a7c", flex: "0 1 auto", textAlign: "right" }}>{isEn ? r.metaEn : r.metaEs}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "15px", color: "#d4b47a", flex: "0 0 auto", transform: `rotate(${open ? 45 : 0}deg)`, transition: "transform .3s", display: "inline-block" }}>＋</span>
                  </button>
                  {open && (
                    <div style={{ padding: "0 10px 26px 56px", display: "flex", gap: "26px", alignItems: "center", flexWrap: "wrap" }}>
                      <p style={CSS({ margin: 0, flex: "1 1 280px", fontWeight: 300, fontSize: "15.5px", lineHeight: 1.75, color: "#cabfa5", maxWidth: "520px", textWrap: "pretty" })}>{isEn ? r.dEn : r.dEs}</p>
                      <div style={{ display: "flex", gap: "12px", flex: "0 0 auto" }}>
                        <a href="https://open.spotify.com/artist/0Me2xPijWmN9C9P2Vs5IGP" target="_blank" style={{ textDecoration: "none", fontSize: "12.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(212,180,122,.5)", padding: "11px 20px", borderRadius: "999px" }}>Spotify</a>
                        <a href="https://www.youtube.com/@meliroxmusic" target="_blank" style={{ textDecoration: "none", fontSize: "12.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#a99a7c", padding: "11px 6px", borderBottom: "1px solid rgba(212,180,122,.3)" }}>YouTube</a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid rgba(212,180,122,.14)" }} />
          </div>
        </div>
      </section>

      {/* AUDIO TEASER */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(48px, 9vw, 150px) clamp(20px, 5vw, 48px)", background: "#0a0807" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={F + "DVR_0523.jpg"} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 24%", opacity: 0.5, filter: "sepia(.4) saturate(.7) brightness(.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,8,7,.8), rgba(10,8,7,.35) 40%, rgba(10,8,7,.92))" }} />
        <div style={{ position: "relative", maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#d9c9a4", animation: "mrPulse 4s ease-in-out infinite" }}>{t("Más allá del escenario", "Beyond the stage")}</div>
          <h2 style={CSS({ margin: "16px 0 0", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(36px, 5.6vw, 64px)", lineHeight: 1.1, color: "#f7f1e0", textWrap: "pretty", textShadow: "0 2px 24px rgba(0,0,0,.7)" })}>{t("El sonido original de Meli Rox.", "The original sound of Meli Rox.")}</h2>
          <div style={{ margin: "clamp(36px, 5vw, 52px) auto 0", maxWidth: "600px", background: "rgba(10,8,7,.55)", border: "1px solid rgba(212,180,122,.28)", borderRadius: "6px", padding: "clamp(22px, 3.4vw, 34px)", backdropFilter: "blur(8px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
              <button onClick={toggleAudio} aria-label={playing ? "Pausar adelanto" : "Escuchar adelanto"} style={{ flex: "0 0 auto", width: "76px", height: "76px", borderRadius: "50%", cursor: "pointer", background: GOLD, border: "none", color: "#171208", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 36px rgba(232,207,158,.3)" }}>{playing ? <PauseIcon size={24} color="#171208" /> : <PlayIcon size={24} color="#171208" />}</button>
              <div style={{ flex: "1 1 auto" }}>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "2px", height: "52px" }}>
                  {restHeights.map((h, i) => (
                    <div key={i} ref={(el) => { barRefs.current[i] = el; }} style={{ flex: "1 1 auto", height: h + "px", background: "linear-gradient(180deg, #f1e2ba, #a07c46)", borderRadius: "1px", transition: "height .08s linear" }} />
                  ))}
                </div>
                <div style={{ position: "relative", height: "2px", background: "rgba(212,180,122,.3)", marginTop: "12px", borderRadius: "2px" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.round(prog * 100) + "%", background: "#ecd9ac", boxShadow: "0 0 12px rgba(232,207,158,.9)", borderRadius: "2px" }} />
                </div>
                <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".16em", color: "#a99a7c" }}>
                  <span>{t("Adelanto", "Preview")}</span>
                  <span>{progLabel}</span>
                </div>
              </div>
            </div>
            <div style={CSS({ marginTop: "24px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(19px, 2.4vw, 25px)", color: "#f3ead6", lineHeight: 1.5, textWrap: "pretty" })}>{t("Canciones, colaboraciones y una identidad que existe más allá del escenario.", "Songs, collaborations and an identity that exists beyond the stage.")}</div>
            <div style={{ marginTop: "18px", display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".2em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Nueva canción · muy pronto", "New song · coming soon")}</span>
              <a href={waNotify} target="_blank" style={{ textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: ".08em", color: "#ecd9ac", borderBottom: "1px solid rgba(212,180,122,.5)", paddingBottom: "3px", display: "inline-flex", alignItems: "center", gap: "5px" }}>{t("Avísame cuando salga", "Notify me when it drops")}<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ecd9ac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17L17 7M17 7H8M17 7V16" /></svg></a>
            </div>
            <audio ref={audioRef} src={U + "audio_preview-1784054734635.mp3"} preload="none" onTimeUpdate={(e) => { const a = e.currentTarget; const cur = a.currentTime; setProg(Math.min(cur / PREVIEW_SECONDS, 1)); if (cur >= PREVIEW_SECONDS) { a.pause(); a.currentTime = 0; setPlaying(false); setProg(0); } }} onEnded={() => { setPlaying(false); setProg(0); }} style={{ display: "none" }} />
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section id="historia" style={{ position: "relative", padding: "clamp(44px, 7.5vw, 110px) clamp(20px, 5vw, 48px)", background: "linear-gradient(180deg, #0b0a08, #110e09 50%, #0b0a08)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c", textAlign: "center" }}>{t("La historia", "The story")}</div>
          <h2 style={{ margin: "12px 0 0", textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(34px, 5vw, 60px)", color: "#f4edda", lineHeight: 1.12 }}>
            {isEn ? (<>Viola. Voice. Violin. <em style={{ color: "#e8cf9e" }}>Meli Rox.</em></>) : (<>Viola. Voz. Violín. <em style={{ color: "#e8cf9e" }}>Meli Rox.</em></>)}
          </h2>
          <div style={{ position: "relative", marginTop: isMobile ? "28px" : "clamp(40px, 6vw, 64px)" }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "linear-gradient(180deg, transparent, rgba(232,207,158,.55) 12%, rgba(232,207,158,.55) 88%, transparent)", display: isMobile ? "none" : "block" }} />
            {CHAPTERS.map((c) => (
              <div key={c.num} style={CSS({ position: "relative", display: "flex", gap: isMobile ? "16px" : "clamp(24px, 5vw, 60px)", alignItems: isMobile ? "stretch" : "center", flexDirection: (isMobile ? "column" : c.dir) as CSSProperties["flexDirection"], padding: isMobile ? "0 0 30px" : "clamp(22px, 3.4vw, 40px) 0", flexWrap: "wrap", width: "100%", maxWidth: "100%" })}>
                <div style={{ position: "absolute", left: "50%", transform: "translate(-50%, 0)", width: "9px", height: "9px", borderRadius: "50%", background: "#e8cf9e", boxShadow: "0 0 16px rgba(232,207,158,.8)", display: isMobile ? "none" : "block" }} />
                <div style={{ flex: isMobile ? "0 0 auto" : "1 1 300px", minWidth: isMobile ? "0" : "260px", width: "100%" }}>
                  <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.2)", height: "clamp(200px, 30vw, 320px)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt={t(c.tEs, c.tEn)} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: c.pos, filter: "saturate(.85) brightness(.88)" }} />
                  </div>
                </div>
                <div style={{ flex: isMobile ? "0 0 auto" : "1 1 300px", minWidth: isMobile ? "0" : "260px", width: isMobile ? "100%" : undefined }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#d4b47a" }}>{c.num}</div>
                  <div style={{ marginTop: "10px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 500, color: "#f2ecdf" }}>{t(c.tEs, c.tEn)}</div>
                  <p style={CSS({ margin: "12px 0 0", fontWeight: 300, fontSize: "16px", lineHeight: 1.75, color: "#cabfa5", maxWidth: "400px", textWrap: "pretty" })}>{t(c.xEs, c.xEn)}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={CSS({ margin: "clamp(36px, 5vw, 56px) auto 0", textAlign: "center", maxWidth: "720px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(24px, 3.4vw, 36px)", lineHeight: 1.45, color: "#f3ead6", textWrap: "pretty" })}>
            {isEn ? (<>&quot;Today, her voice and her violin speak one language: <em style={{ color: "#e8cf9e" }}>emotion, energy and freedom</em>.&quot;</>) : (<>«Hoy, su voz y su violín existen en un mismo lenguaje: <em style={{ color: "#e8cf9e" }}>emoción, energía y libertad</em>.»</>)}
          </p>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" style={{ position: "relative", padding: "clamp(44px, 7.5vw, 110px) 0 clamp(48px, 6vw, 72px)", background: "#0b0a08", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(34px, 5vw, 60px)", color: "#f4edda" }}>{t("Galería", "Gallery")}</h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {FDEFS.map((f) => {
              const on = f.id === filter;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{ cursor: "pointer", fontSize: "12.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", padding: "11px 18px", borderRadius: "999px", background: on ? "rgba(212,180,122,.18)" : "transparent", color: on ? "#ecd9ac" : "#a99a7c", border: "1px solid " + (on ? "rgba(232,207,158,.6)" : "rgba(212,180,122,.22)"), transition: "all .3s" }}>{t(f.es, f.en)}</button>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: "clamp(26px, 4vw, 40px)", overflowX: "auto", padding: "4px clamp(20px, 5vw, 48px) 18px", scrollbarWidth: "thin", scrollbarColor: "rgba(212,180,122,.4) transparent", scrollSnapType: "x proximity" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", width: "max-content" }}>
            {galleryItems.map((g) => {
              const alt = "Meli Rox — " + t(g.es, g.en);
              const h = isMobile ? Math.round(g.h * 0.72) : g.h;
              return (
                <figure key={g.src} onClick={() => setLb(g.videoSrc ? { videoSrc: g.videoSrc, alt } : { src: g.src, alt })} style={{ margin: 0, position: "relative", flex: "0 0 auto", overflow: "hidden", borderRadius: "3px", border: "1px solid rgba(212,180,122,.16)", cursor: g.videoSrc ? "pointer" : "zoom-in", scrollSnapAlign: "start" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src} alt={alt} loading="lazy" style={{ display: "block", height: h + "px", width: "auto", maxWidth: "80vw", objectFit: "cover", filter: "saturate(.88) brightness(.9)", transition: "transform .8s, filter .5s" }} />
                  {g.vid && (
                    <>
                      <div style={{ position: "absolute", inset: 0, background: "rgba(8,7,6,.28)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                        <div style={{ width: "54px", height: "54px", borderRadius: "50%", border: "1px solid rgba(232,207,158,.8)", background: "rgba(8,7,6,.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ecd9ac" }}><PlayIcon size={18} color="#ecd9ac" /></div>
                      </div>
                      <div style={{ position: "absolute", right: "10px", bottom: "10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".14em", color: "#eee3c2", background: "rgba(8,7,6,.65)", padding: "5px 8px", borderRadius: "3px", pointerEvents: "none" }}>{g.vid}</div>
                    </>
                  )}
                  <figcaption style={{ position: "absolute", left: "12px", bottom: "10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#eee3c2", textShadow: "0 1px 8px rgba(0,0,0,.9)" }}>{t(g.es, g.en)}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>
        <div style={{ maxWidth: "1200px", margin: "8px auto 0", padding: "0 clamp(20px, 5vw, 48px)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Desliza para explorar · toca para ampliar →", "Scroll to explore · tap to enlarge →")}</div>
      </section>

      {/* SIGUE LA ENERGIA */}
      <section style={{ position: "relative", padding: "clamp(40px, 7vw, 96px) clamp(20px, 5vw, 48px)", background: "linear-gradient(180deg, #0b0a08, #100d09)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Instagram profile header */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <a href="https://www.instagram.com/meliroxoficial/" target="_blank" style={{ flex: "0 0 auto", width: "64px", height: "64px", borderRadius: "50%", display: "block", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={U + "MeliIGThumb.jpg"} alt="Meli Rox" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            </a>
            <div style={{ flex: "1 1 auto", minWidth: "160px" }}>
              <a href="https://www.instagram.com/meliroxoficial/" target="_blank" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(26px, 3.4vw, 34px)", color: "#f4edda", lineHeight: 1 }}>@meliroxoficial{/* eslint-disable-next-line @next/next/no-img-element */}<img src={U + "Instagramtickv3.png"} alt="Verificado" style={{ width: "0.66em", height: "0.66em", display: "inline-block" }} /></a>
              <div style={{ marginTop: "5px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".14em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Cantautora & Violinista · Medellín", "Singer-songwriter & Violinist · Medellín")}</div>
            </div>
            <a href="https://www.instagram.com/meliroxoficial/" target="_blank" style={{ textDecoration: "none", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".06em", color: "#171208", background: GOLD, padding: "12px 24px", borderRadius: "999px", whiteSpace: "nowrap" }}>{t("Seguir", "Follow")}</a>
          </div>

          <div style={{ marginTop: "clamp(20px, 3vw, 30px)", width: isMobile ? "auto" : "min(1600px, calc(100vw - 40px))", marginLeft: isMobile ? undefined : "50%", transform: isMobile ? undefined : "translateX(-50%)" }}>
            <InstagramEmbeds urls={IG_POSTS} isMobile={isMobile} vw={vw} />
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Desliza para ver más →", "Swipe for more →")}</div>

          <div style={{ marginTop: "clamp(24px, 3.4vw, 36px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            {[
              { href: "https://open.spotify.com/artist/0Me2xPijWmN9C9P2Vs5IGP", img: F + "DVR_0449.jpg", pos: "50% 30%", label: "Spotify", title: t("Escucha su música", "Hear her music"), handle: "Meli Rox →" },
              { href: "https://www.youtube.com/@meliroxmusic", img: F + "IMG_2513.jpg", pos: "50% 18%", label: "YouTube", title: t("Videos y presentaciones", "Videos & performances"), handle: "@meliroxmusic →" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" style={{ position: "relative", display: "block", textDecoration: "none", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.22)", height: "200px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos, filter: "saturate(.85) brightness(.62)", transition: "transform .8s" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(10,9,8,.92))" }} />
                <div style={{ position: "absolute", left: "20px", right: "20px", bottom: "18px" }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".24em", textTransform: "uppercase", color: "#d9c9a4" }}>{s.label}</div>
                  <div style={{ marginTop: "6px", fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#f7f1e0" }}>{s.title}</div>
                  <div style={{ marginTop: "6px", fontSize: "13px", fontWeight: 600, color: "#d4b47a" }}>{s.handle}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ position: "relative", overflow: "hidden", padding: "clamp(52px, 10vw, 170px) clamp(20px, 5vw, 48px)", background: "#080706" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={F + "DVR_0490.jpg"} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", opacity: 0.38, filter: "sepia(.4) saturate(.72) brightness(.68)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 65% at 50% 40%, transparent, #080706 88%)" }} />
        <div style={{ position: "relative", maxWidth: "940px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={CSS({ margin: 0, fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: "clamp(38px, 6.4vw, 80px)", lineHeight: 1.06, color: "#f9f4e4", textWrap: "pretty", textShadow: "0 2px 30px rgba(0,0,0,.8)" })}>
            {isEn ? (<>Make the moment <em style={{ color: "#e8cf9e" }}>sound different.</em></>) : (<>Haz que el momento <em style={{ color: "#e8cf9e" }}>suene diferente.</em></>)}
          </h2>
          <div style={{ marginTop: "clamp(38px, 5vw, 56px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", textAlign: "left" }}>
            <div style={{ border: "1px solid rgba(232,207,158,.55)", borderRadius: "4px", padding: "clamp(26px, 3.6vw, 40px)", background: "linear-gradient(160deg, rgba(212,164,90,.16), rgba(13,11,9,0) 50%), rgba(13,11,9,.9)", backdropFilter: "blur(6px)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".24em", textTransform: "uppercase", color: "#d9c9a4" }}>{t("Eventos y celebraciones", "Events & celebrations")}</div>
              <div style={{ marginTop: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(23px, 2.6vw, 28px)", color: "#f4edda", lineHeight: 1.3 }}>{t("Bodas, fiestas de 15, eventos privados y corporativos.", "Weddings, quinceañeras, private and corporate events.")}</div>
              <a href={waMain} target="_blank" style={{ marginTop: "24px", display: "inline-block", textDecoration: "none", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "15px 26px", borderRadius: "999px" }}>{t("Consultar disponibilidad", "Check availability")}</a>
            </div>
            <div style={{ border: "1px solid rgba(212,180,122,.28)", borderRadius: "4px", padding: "clamp(26px, 3.6vw, 40px)", background: "rgba(13,11,9,.85)", backdropFilter: "blur(6px)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>{t("Artista y colaboraciones", "Artist & collaborations")}</div>
              <div style={{ marginTop: "12px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(23px, 2.6vw, 28px)", color: "#f4edda", lineHeight: 1.3 }}>{t("Festivales, venues, DJs, productores, prensa y management.", "Festivals, venues, DJs, producers, press and management.")}</div>
              <div style={{ marginTop: "24px", display: "flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
                <a href={waCollab} target="_blank" style={{ display: "inline-block", textDecoration: "none", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(212,180,122,.55)", padding: "15px 26px", borderRadius: "999px" }}>{t("Proponer colaboración", "Propose a collaboration")}</a>
                <a href="mailto:meliroxmusic@gmail.com" style={{ fontSize: "14px", fontWeight: 500, color: "#ddd2b8", textDecoration: "none", borderBottom: "1px solid rgba(212,180,122,.4)", paddingBottom: "2px" }}>meliroxmusic@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "26px clamp(20px, 5vw, 48px)", background: "#080706", borderTop: "1px solid rgba(212,180,122,.12)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={U + "meli-rox-logo-clean-print-transparent.png"} alt="Meli Rox" style={{ height: "64px", width: "auto", opacity: 0.9, margin: "-16px 0 -16px -12px" }} />
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "#7d7159" }}>© 2026 Meli Rox · Medellín, Colombia</div>
      </footer>

      {/* LIGHTBOX */}
      {lb && (
        <div onClick={() => setLb(null)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(8,7,6,.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px, 4vw, 48px)", cursor: "zoom-out" }}>
          {lb.videoSrc ? (
            <video src={lb.videoSrc} controls autoPlay playsInline onClick={(e) => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "92vh", borderRadius: "4px", border: "1px solid rgba(212,180,122,.3)", boxShadow: "0 30px 90px rgba(0,0,0,.7)", background: "#000" }} />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={lb.src} alt={lb.alt} style={{ maxWidth: "100%", maxHeight: "92vh", borderRadius: "4px", border: "1px solid rgba(212,180,122,.3)", boxShadow: "0 30px 90px rgba(0,0,0,.7)" }} />
          )}
          <button onClick={() => setLb(null)} aria-label="Cerrar" style={{ position: "absolute", top: "18px", right: "22px", width: "46px", height: "46px", borderRadius: "50%", background: "rgba(212,180,122,.12)", border: "1px solid rgba(212,180,122,.4)", color: "#ecd9ac", fontSize: "20px", cursor: "pointer" }}>×</button>
        </div>
      )}

      {/* WHATSAPP FAB */}
      <a href={waMain} target="_blank" aria-label="WhatsApp" style={{ position: "fixed", right: "22px", bottom: "22px", zIndex: 60, width: "58px", height: "58px", borderRadius: "50%", background: GOLD, display: isMobile ? "none" : "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0 8px 30px rgba(0,0,0,.55), 0 0 24px rgba(232,207,158,.25)", transition: "transform .3s" }}>
        <svg width="27" height="27" viewBox="0 0 24 24" fill="#171208"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z" /></svg>
      </a>
    </>
  );
}
