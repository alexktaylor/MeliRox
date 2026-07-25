import Link from "next/link";
import Footer from "./Footer";
import SiteNav from "./SiteNav";
import WeddingRepertoire, { type Song } from "./WeddingRepertoire";
import MediaCarousel, { type MediaItem } from "./MediaCarousel";
import InstagramStrip from "./InstagramStrip";
import YouTubeEmbed from "./YouTubeEmbed";
import AutoVideo from "./AutoVideo";

// All of Meli's performance videos (violin-forward order) — shown in the media carousel
const ALL_VIDEOS: { videoSrc: string; poster: string; alt: string }[] = [
  { videoSrc: "/Vids/play/violin.mp4", poster: "/Vids/posters/violin.jpg", alt: "Violín eléctrico en vivo" },
  { videoSrc: "/Vids/play/conciertos.mp4", poster: "/Vids/posters/conciertos.jpg", alt: "Festival" },
  { videoSrc: "/Vids/play/bodas.mp4", poster: "/Vids/posters/bodas.jpg", alt: "Boda" },
  { videoSrc: "/Vids/play/quince.mp4", poster: "/Vids/posters/quince.jpg", alt: "Fiesta de 15" },
  { videoSrc: "/Vids/play/privados.mp4", poster: "/Vids/posters/privados.jpg", alt: "Evento privado" },
  { videoSrc: "/Vids/play/corporate.mp4", poster: "/Vids/posters/corporate.jpg", alt: "Evento corporativo" },
  { videoSrc: "/Vids/play/voz.mp4", poster: "/Vids/posters/voz.jpg", alt: "Voz en vivo" },
  { videoSrc: "/Vids/play/paradise.mp4", poster: "/Vids/posters/paradise.jpg", alt: "En vivo" },
  { videoSrc: "/Vids/play/banda.mp4", poster: "/Vids/posters/banda.jpg", alt: "Banda y DJs" },
  { videoSrc: "/Vids/play/colab.mp4", poster: "/Vids/posters/colab.jpg", alt: "Colaboración" },
];

const SITE = "https://melirox.com";
export const F = "/uploads/drive-download-20260714T181149Z-1-001/";
const GOLD = "linear-gradient(135deg, #ecd9ac, #b98f4e)";
const serif = "var(--font-cormorant), serif";

const wa = (msg: string) => "https://wa.me/573045502154?text=" + encodeURIComponent(msg);

export type ServiceConfig = {
  path: string;
  waMsg: string;
  headerCta: string;
  eyebrow: string;
  h1Pre: string;
  h1Em: string;
  heroImg: string;
  heroVideo?: string;
  heroVideoPos?: string;
  heroPos: string;
  heroSub: string;
  ctaPrimary: string;
  stats: { n: string; l: string }[];
  statementEyebrow: string;
  statementPre: string;
  statementEm: string;
  statementBody: string;
  momentsImg: string;
  momentsVideo?: string;
  momentsPos: string;
  momentsTitle: string;
  moments: { t: string; d: string }[];
  momentsCta: string;
  video: string;
  videoPoster: string;
  galleryTitle: string;
  gallery: { src: string; alt: string }[];
  faq: { q: string; a: string }[];
  ctaImg: string;
  ctaVideo?: string;
  ctaPos: string;
  ctaTitlePre: string;
  ctaTitleEm: string;
  ctaBody: string;
  serviceName: string;
  serviceType: string;
  serviceDesc: string;
  breadcrumbName: string;
  includes?: { t: string; d: string }[];
  includesNote?: string;
  packages?: { n: string; title: string; format: string; details: string[] }[];
  repertoire?: Song[];
  servicesGrid?: { href: string; label: string; sub: string; img: string; pos?: string }[];
  servicesTitle?: string;
};

export function buildJsonLd(cfg: ServiceConfig) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": SITE + cfg.path + "#service",
        name: cfg.serviceName,
        serviceType: cfg.serviceType,
        description: cfg.serviceDesc,
        provider: { "@id": SITE + "/#artist" },
        areaServed: [
          { "@type": "City", name: "Medellín" },
          { "@type": "State", name: "Antioquia" },
          { "@type": "Country", name: "Colombia" },
        ],
        url: SITE + cfg.path,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
          { "@type": "ListItem", position: 2, name: cfg.breadcrumbName, item: SITE + cfg.path },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: cfg.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "VideoObject",
        name: cfg.serviceName + " — Meli Rox en vivo",
        description: cfg.serviceDesc,
        thumbnailUrl: [SITE + cfg.videoPoster],
        contentUrl: SITE + cfg.video,
        uploadDate: "2026-06-01T00:00:00-05:00",
        publisher: { "@id": SITE + "/#business" },
      },
    ],
  };
}

export default function ServicePage({ cfg }: { cfg: ServiceConfig }) {
  const WA = wa(cfg.waMsg);
  const eyebrow: React.CSSProperties = { fontFamily: "var(--font-mono), monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c" };

  // Media carousel: this page's video first, then the rest, then the page photos
  const pageVideo = ALL_VIDEOS.find((v) => v.videoSrc === cfg.video);
  const orderedVideos = pageVideo ? [pageVideo, ...ALL_VIDEOS.filter((v) => v !== pageVideo)] : ALL_VIDEOS;
  const mediaItems: MediaItem[] = [
    ...orderedVideos.map((v) => ({ src: v.poster, alt: v.alt, videoSrc: v.videoSrc })),
    ...cfg.gallery.map((g) => ({ src: g.src, alt: g.alt })),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(cfg)) }} />

      {/* Nav */}
      <SiteNav cta={cfg.headerCta} waHref={WA} />

      {/* Hero */}
      <section className="svc-hero" style={{ position: "relative", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#080706" }}>
        {cfg.heroVideo ? (
          <AutoVideo src={cfg.heroVideo} poster={cfg.heroImg} pos={cfg.heroVideoPos || cfg.heroPos} eager filter="saturate(.95) brightness(.76) contrast(1.03)" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cfg.heroImg} alt={cfg.serviceName} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: cfg.heroPos, filter: "saturate(.9) brightness(.72)" }} />
        )}
        <div className="svc-hero-fade" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "relative", width: "min(1200px, 100%)", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) clamp(48px, 8vh, 90px)" }}>
          <div style={{ ...eyebrow, color: "#e3d5b0" }}>{cfg.eyebrow}</div>
          <h1 style={{ margin: "14px 0 0", fontFamily: serif, fontWeight: 300, fontSize: "clamp(40px, 6.5vw, 82px)", lineHeight: 1.04, color: "#f9f4e4", maxWidth: "860px", textShadow: "0 2px 30px rgba(0,0,0,.7)" }}>
            {cfg.h1Pre}<em style={{ color: "#e8cf9e" }}>{cfg.h1Em}</em>
          </h1>
          <p style={{ margin: "22px 0 0", maxWidth: "620px", fontFamily: serif, fontStyle: "italic", fontSize: "clamp(20px, 2.6vw, 28px)", lineHeight: 1.4, color: "#f3ead6" }}>{cfg.heroSub}</p>
          <div style={{ marginTop: "30px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a href={WA} target="_blank" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "17px 32px", borderRadius: "999px" }}>{cfg.ctaPrimary}</a>
            <Link href="/#galeria" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(232,207,158,.6)", padding: "17px 32px", borderRadius: "999px", background: "rgba(8,7,6,.4)", backdropFilter: "blur(4px)" }}>Ver más</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#0d0b09", borderBottom: "1px solid rgba(212,180,122,.1)", padding: "clamp(40px, 5vw, 64px) clamp(20px, 5vw, 48px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "clamp(24px, 4vw, 40px)" }}>
          {cfg.stats.map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: serif, fontWeight: 300, fontSize: "clamp(36px, 4.6vw, 56px)", lineHeight: 1.05, color: "#f1e2ba" }}>{s.n}</div>
              <div style={{ marginTop: "10px", fontFamily: "var(--font-mono), monospace", fontSize: "11.5px", letterSpacing: ".18em", textTransform: "uppercase", color: "#a99a7c" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Statement */}
      <section style={{ padding: "clamp(56px, 9vw, 120px) clamp(20px, 5vw, 48px)", textAlign: "center", background: "linear-gradient(180deg, #0b0a08, #14100a 55%, #0b0a08)" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div style={eyebrow}>{cfg.statementEyebrow}</div>
          <h2 style={{ margin: "16px 0 0", fontFamily: serif, fontWeight: 300, fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.12, color: "#f4edda" }}>
            {cfg.statementPre}<em style={{ color: "#e8cf9e" }}>{cfg.statementEm}</em>
          </h2>
          <div style={{ width: "56px", height: "1px", background: "linear-gradient(90deg, transparent, #d4b47a, transparent)", margin: "28px auto" }} />
          <p style={{ margin: "0 auto", maxWidth: "640px", fontWeight: 300, fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.8, color: "#cabfa5" }}>{cfg.statementBody}</p>
        </div>
      </section>

      {/* Moments */}
      <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0b0a08" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(24px, 4vw, 44px)", alignItems: "center" }}>
            <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.18)", minHeight: "clamp(340px, 50vh, 520px)" }}>
              {cfg.momentsVideo ? (
                <AutoVideo src={cfg.momentsVideo} poster={cfg.momentsImg} pos={cfg.momentsPos} filter="saturate(.95) brightness(.9)" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={cfg.momentsImg} alt={cfg.momentsTitle} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: cfg.momentsPos, filter: "saturate(.92) brightness(.9)" }} />
              )}
            </div>
            <div>
              <div style={eyebrow}>La experiencia</div>
              <h2 style={{ margin: "12px 0 0", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.1, color: "#f4edda" }}>{cfg.momentsTitle}</h2>
              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {cfg.moments.map((m) => (
                  <div key={m.t}>
                    <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(22px, 2.6vw, 27px)", color: "#e8cf9e" }}>{m.t}</div>
                    <p style={{ margin: "8px 0 0", fontWeight: 300, fontSize: "16px", lineHeight: 1.75, color: "#cabfa5", maxWidth: "460px" }}>{m.d}</p>
                  </div>
                ))}
              </div>
              <a href={WA} target="_blank" style={{ marginTop: "32px", display: "inline-block", textDecoration: "none", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "16px 28px", borderRadius: "999px" }}>{cfg.momentsCta}</a>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid — hub links out to each service page */}
      {cfg.servicesGrid && (
        <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0d0b09", borderTop: "1px solid rgba(212,180,122,.1)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={eyebrow}>Servicios en Medellín</div>
            <h2 style={{ margin: "12px 0 clamp(28px, 4vw, 44px)", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.1, color: "#f4edda", maxWidth: "760px" }}>{cfg.servicesTitle}</h2>
            <div className="svc-services-grid" style={{ display: "grid", gap: "14px", ["--svc-cols" as string]: String(cfg.servicesGrid.length) }}>
              {cfg.servicesGrid.map((s) => (
                <Link key={s.href} href={s.href} style={{ position: "relative", display: "block", textDecoration: "none", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.2)", height: "clamp(300px, 40vw, 380px)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.label} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos || "50% 30%", filter: "saturate(.9) brightness(.72)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 35%, rgba(10,9,8,.92))" }} />
                  <div style={{ position: "absolute", left: "22px", right: "22px", bottom: "22px" }}>
                    <div style={{ fontFamily: serif, fontSize: "clamp(24px, 3vw, 30px)", color: "#f7f1e0", lineHeight: 1.1 }}>{s.label}</div>
                    <div style={{ margin: "6px 0 12px", fontWeight: 300, fontSize: "14.5px", lineHeight: 1.5, color: "#cabfa5" }}>{s.sub}</div>
                    <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", letterSpacing: ".16em", textTransform: "uppercase", color: "#ecd9ac" }}>Ver más →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Qué incluye — the concrete deliverables every booking gets */}
      {cfg.includes && (
        <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0b0a08", borderTop: "1px solid rgba(212,180,122,.1)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ ...eyebrow, textAlign: "center" }}>Qué incluye</div>
            <h2 style={{ margin: "12px 0 clamp(34px, 4.5vw, 56px)", textAlign: "center", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", color: "#f4edda" }}>
              Una experiencia <em style={{ fontStyle: "italic", background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>completa</em>.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "clamp(22px, 3vw, 36px)" }}>
              {cfg.includes.map((it, i) => (
                <div key={it.t} style={{ borderTop: "1px solid rgba(212,180,122,.4)", paddingTop: "18px" }}>
                  <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", letterSpacing: ".26em", color: "#8a7d63" }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ marginTop: "10px", fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px, 2.4vw, 26px)", color: "#f1e2ba", lineHeight: 1.2 }}>{it.t}</div>
                  <p style={{ margin: "10px 0 0", fontWeight: 300, fontSize: "14.5px", lineHeight: 1.7, color: "#bcb096" }}>{it.d}</p>
                </div>
              ))}
            </div>
            {cfg.includesNote && (
              <p style={{ margin: "clamp(26px, 3.4vw, 40px) 0 0", textAlign: "center", fontFamily: serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(16px, 1.9vw, 19px)", color: "#a99a7c" }}>{cfg.includesNote}</p>
            )}
          </div>
        </section>
      )}

      {/* Packages */}
      {cfg.packages && (
        <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0d0b09", borderTop: "1px solid rgba(212,180,122,.1)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ ...eyebrow, textAlign: "center" }}>El proceso</div>
            <h2 style={{ margin: "12px 0 clamp(30px, 4vw, 48px)", textAlign: "center", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", color: "#f4edda" }}>Paquetes a la medida.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(16px, 2.5vw, 26px)" }}>
              {cfg.packages.map((p) => (
                <div key={p.n} style={{ border: "1px solid rgba(212,180,122,.22)", borderRadius: "6px", padding: "clamp(26px, 3.4vw, 38px)", background: "radial-gradient(ellipse 100% 80% at 0% 0%, rgba(138,106,63,.15), transparent 60%), #0a0908", display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: serif, fontWeight: 300, fontSize: "clamp(46px, 6vw, 68px)", lineHeight: 1, color: "#f1e2ba" }}>{p.n}</div>
                  <div style={{ marginTop: "16px", fontFamily: serif, fontStyle: "italic", fontSize: "clamp(22px, 2.6vw, 28px)", color: "#f4edda" }}>{p.title}</div>
                  <div style={{ marginTop: "10px", fontFamily: "var(--font-mono), monospace", fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "#a99a7c", lineHeight: 1.6 }}>{p.format}</div>
                  <div style={{ marginTop: "18px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {p.details.map((d) => (
                      <span key={d} style={{ fontFamily: "var(--font-mono), monospace", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", color: "#eee3c2", background: "rgba(11,10,8,.6)", border: "1px solid rgba(212,180,122,.3)", padding: "7px 12px", borderRadius: "999px" }}>{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ margin: "clamp(24px, 3vw, 32px) 0 0", textAlign: "center", fontWeight: 300, fontSize: "15px", color: "#a99a7c" }}>Reserva con el 30%. Cada paquete se adapta a tu boda.</p>
          </div>
        </section>
      )}

      {/* Media carousel — all her videos + photos */}
      <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(138,106,63,.12), transparent 60%), #0a0908" }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={eyebrow}>Míralo en vivo</div>
          <h2 style={{ margin: "12px 0 clamp(24px, 3.4vw, 40px)", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", color: "#f4edda" }}>{cfg.galleryTitle}</h2>
          <MediaCarousel items={mediaItems} />
          <p style={{ margin: "4px 0 0", fontFamily: "var(--font-mono), monospace", fontSize: "11.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#a99a7c" }}>Desliza · toca para reproducir</p>
        </div>
      </section>

      {/* Repertoire (playlist) */}
      {cfg.repertoire && (
        <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0b0a08", borderTop: "1px solid rgba(212,180,122,.1)" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <WeddingRepertoire songs={cfg.repertoire} />
          </div>
        </section>
      )}

      {/* En televisión — credibility */}
      <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0d0b09", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ ...eyebrow, textAlign: "center" }}>En televisión</div>
          <h2 style={{ margin: "12px 0 8px", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", color: "#f4edda" }}>Vista en televisión nacional.</h2>
          <p style={{ margin: "0 auto clamp(26px, 3.4vw, 38px)", maxWidth: "560px", fontWeight: 300, fontSize: "16px", lineHeight: 1.7, color: "#cabfa5" }}>#1 en La X 103.9 · La Solar · Medellín Music Lab · Reconocimiento Premios Estela.</p>
          <YouTubeEmbed id="qIS-ePBF3ok" title="Meli Rox en vivo — Las Tres Gracias TV" />
          <div style={{ marginTop: "10px", fontFamily: "var(--font-mono), monospace", fontSize: "11px", letterSpacing: ".16em", textTransform: "uppercase", color: "#8a7d63" }}>Las Tres Gracias TV</div>
        </div>
      </section>

      {/* Instagram */}
      <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(138,106,63,.1), transparent 60%), #0b0a08", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ maxWidth: "1560px", margin: "0 auto" }}>
          <div style={{ ...eyebrow, textAlign: "center" }}>Instagram</div>
          <h2 style={{ margin: "12px 0 clamp(22px, 3vw, 34px)", textAlign: "center", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", color: "#f4edda" }}>Síguela en @meliroxoficial.</h2>
          <InstagramStrip />
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <a href="https://www.instagram.com/meliroxoficial/" target="_blank" style={{ textDecoration: "none", fontSize: "13.5px", fontWeight: 600, letterSpacing: ".06em", color: "#171208", background: GOLD, padding: "13px 26px", borderRadius: "999px" }}>Ver en Instagram</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0b0a08" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <div style={{ ...eyebrow, textAlign: "center" }}>Preguntas frecuentes</div>
          <h2 style={{ margin: "12px 0 clamp(28px, 4vw, 44px)", textAlign: "center", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", color: "#f4edda" }}>Todo lo que necesitas saber.</h2>
          <div>
            {cfg.faq.map((f) => (
              <div key={f.q} style={{ borderTop: "1px solid rgba(212,180,122,.14)", padding: "24px 4px" }}>
                <h3 style={{ margin: 0, fontFamily: serif, fontWeight: 400, fontSize: "clamp(21px, 2.6vw, 27px)", color: "#f2ecdf" }}>{f.q}</h3>
                <p style={{ margin: "12px 0 0", fontWeight: 300, fontSize: "16px", lineHeight: 1.8, color: "#cabfa5" }}>{f.a}</p>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(212,180,122,.14)" }} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ position: "relative", overflow: "hidden", padding: "clamp(64px, 10vw, 150px) clamp(20px, 5vw, 48px)", background: "#080706" }}>
        {cfg.ctaVideo ? (
          <div style={{ position: "absolute", inset: 0, opacity: 0.34 }}>
            <AutoVideo src={cfg.ctaVideo} poster={cfg.ctaImg} pos={cfg.ctaPos} filter="sepia(.35) saturate(.75) brightness(.7)" />
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={cfg.ctaImg} alt={cfg.serviceName} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: cfg.ctaPos, opacity: 0.34, filter: "sepia(.35) saturate(.75) brightness(.7)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 65% at 50% 40%, transparent, #080706 88%)" }} />
        <div style={{ position: "relative", maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontFamily: serif, fontWeight: 300, fontSize: "clamp(34px, 5.5vw, 68px)", lineHeight: 1.08, color: "#f9f4e4", textShadow: "0 2px 30px rgba(0,0,0,.8)" }}>
            {cfg.ctaTitlePre}<em style={{ color: "#e8cf9e" }}>{cfg.ctaTitleEm}</em>
          </h2>
          <p style={{ margin: "20px auto 0", maxWidth: "560px", fontWeight: 300, fontSize: "17px", lineHeight: 1.75, color: "#cabfa5" }}>{cfg.ctaBody}</p>
          <div style={{ marginTop: "34px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={WA} target="_blank" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "18px 34px", borderRadius: "999px" }}>{cfg.ctaPrimary}</a>
            <a href="tel:+573045502154" style={{ textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(232,207,158,.6)", padding: "18px 34px", borderRadius: "999px" }}>Llamar</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
