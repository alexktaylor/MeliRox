import Link from "next/link";
import Footer from "./Footer";
import SiteNav from "./SiteNav";

const SITE = "https://melirox.com";
export const F = "/uploads/drive-download-20260714T181149Z-1-001/";
const GOLD = "linear-gradient(135deg, #ecd9ac, #b98f4e)";
const serif = "'Cormorant Garamond', serif";

const wa = (msg: string) => "https://wa.me/573045502154?text=" + encodeURIComponent(msg);

export type ServiceConfig = {
  path: string;
  waMsg: string;
  headerCta: string;
  eyebrow: string;
  h1Pre: string;
  h1Em: string;
  heroImg: string;
  heroPos: string;
  heroSub: string;
  ctaPrimary: string;
  stats: { n: string; l: string }[];
  statementEyebrow: string;
  statementPre: string;
  statementEm: string;
  statementBody: string;
  momentsImg: string;
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
  ctaPos: string;
  ctaTitlePre: string;
  ctaTitleEm: string;
  ctaBody: string;
  serviceName: string;
  serviceType: string;
  serviceDesc: string;
  breadcrumbName: string;
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
    ],
  };
}

export default function ServicePage({ cfg }: { cfg: ServiceConfig }) {
  const WA = wa(cfg.waMsg);
  const eyebrow: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c" };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(cfg)) }} />

      {/* Nav */}
      <SiteNav cta={cfg.headerCta} waHref={WA} />

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "clamp(560px, 82vh, 820px)", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#080706" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cfg.heroImg} alt={cfg.serviceName} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: cfg.heroPos, filter: "saturate(.9) brightness(.82)" }} />
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
              <div style={{ marginTop: "10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".18em", textTransform: "uppercase", color: "#a99a7c" }}>{s.l}</div>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cfg.momentsImg} alt={cfg.momentsTitle} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: cfg.momentsPos, filter: "saturate(.92) brightness(.9)" }} />
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

      {/* Video */}
      <section style={{ padding: "0 clamp(20px, 5vw, 48px) clamp(48px, 7vw, 100px)", background: "#0b0a08" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.2)", background: "#000" }}>
            <video src={cfg.video} poster={cfg.videoPoster} controls playsInline preload="none" style={{ display: "block", width: "100%", maxHeight: "80vh", objectFit: "contain", background: "#000" }} />
          </div>
          <p style={{ margin: "16px 0 0", textAlign: "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#a99a7c" }}>Meli Rox en vivo · toca para reproducir</p>
        </div>
      </section>

      {/* Gallery */}
      <section style={{ padding: "clamp(48px, 7vw, 100px) clamp(20px, 5vw, 48px)", background: "#0d0b09", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={eyebrow}>Galería</div>
          <h2 style={{ margin: "12px 0 clamp(28px, 4vw, 44px)", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 52px)", color: "#f4edda" }}>{cfg.galleryTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            {cfg.gallery.map((g) => (
              <div key={g.src} style={{ position: "relative", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,180,122,.16)", height: "clamp(320px, 42vw, 460px)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 28%", filter: "saturate(.9) brightness(.9)" }} />
              </div>
            ))}
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cfg.ctaImg} alt={cfg.serviceName} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: cfg.ctaPos, opacity: 0.34, filter: "sepia(.35) saturate(.75) brightness(.7)" }} />
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
