import Link from "next/link";
import type { CSSProperties } from "react";

const GOLD = "linear-gradient(135deg, #ecd9ac, #b98f4e)";
const WA =
  "https://wa.me/573045502154?text=" +
  encodeURIComponent(
    "Hola, quisiera conocer las opciones y disponibilidad para contratar a Meli Rox."
  );

const SERVICES: { href: string; es: string; en: string }[] = [
  { href: "/violinista-para-bodas-medellin", es: "Violinista para bodas", en: "Violinist for weddings" },
  { href: "/musica-para-fiestas-de-15-medellin", es: "Música para fiestas de 15", en: "Music for quinceañeras" },
  { href: "/musica-eventos-corporativos-medellin", es: "Eventos corporativos", en: "Corporate events" },
  { href: "/violinista-eventos-privados-medellin", es: "Eventos privados", en: "Private events" },
  { href: "/violinista-electrica-medellin", es: "Violinista eléctrica", en: "Electric violinist" },
];

// Official brand glyphs (simple-icons paths)
const SOCIALS: { name: string; href: string; path: string }[] = [
  { name: "Instagram", href: "https://www.instagram.com/meliroxoficial", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { name: "Spotify", href: "https://open.spotify.com/artist/0Me2xPijWmN9C9P2Vs5IGP", path: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" },
  { name: "YouTube", href: "https://www.youtube.com/@meliroxmusic", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { name: "TikTok", href: "https://www.tiktok.com/@meliroxoficial", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
  { name: "Facebook", href: "https://www.facebook.com/meliroxoficial/", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
];

const label: CSSProperties = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "11px",
  letterSpacing: ".26em",
  textTransform: "uppercase",
  color: "#8a7d63",
  marginBottom: "18px",
};
const link: CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "#cabfa5",
  fontSize: "14.5px",
  padding: "6px 0",
};

export default function Footer({ en = false }: { en?: boolean }) {
  const t = (es: string, eng: string) => (en ? eng : es);
  return (
    <footer style={{ background: "#080706", borderTop: "1px solid rgba(212,180,122,.14)", padding: "clamp(52px, 7vw, 84px) clamp(20px, 5vw, 48px) 26px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(32px, 5vw, 72px)", justifyContent: "space-between" }}>
          {/* Brand + socials (left) */}
          <div style={{ flex: "1 1 300px", maxWidth: "440px" }}>
            <Link href="/" style={{ display: "inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/uploads/meli-rox-logo-clean-print-transparent.png" alt="Meli Rox" style={{ height: "84px", width: "auto", margin: "-20px 0 -14px -14px" }} />
            </Link>
            <p style={{ margin: "4px 0 22px", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(19px, 2.4vw, 24px)", lineHeight: 1.4, color: "#cdbf9f" }}>
              {t("Voz, violín eléctrico y energía que transforma cualquier evento.", "Voice, electric violin and energy that transforms any event.")}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.href} target="_blank" aria-label={s.name} title={s.name} style={{ width: "42px", height: "42px", borderRadius: "50%", border: "1px solid rgba(212,180,122,.35)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#d4b47a", textDecoration: "none" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Servicios */}
          <div style={{ flex: "1 1 170px" }}>
            <div style={label}>{t("Servicios", "Services")}</div>
            {SERVICES.map((s) => (
              <Link key={s.href} href={s.href} style={link}>{t(s.es, s.en)}</Link>
            ))}
          </div>

          {/* Contacto */}
          <div style={{ flex: "1 1 220px" }}>
            <div style={label}>{t("Contacto", "Contact")}</div>
            <a href={WA} target="_blank" style={{ textDecoration: "none", display: "inline-block", fontSize: "13px", fontWeight: 600, letterSpacing: ".06em", color: "#171208", background: GOLD, padding: "13px 24px", borderRadius: "999px", marginBottom: "6px" }}>{t("Cotiza tu experiencia", "Book your experience")}</a>
            <a href="tel:+573045502154" style={link}>+57 304 550 2154</a>
            <a href="mailto:meliroxmusic@gmail.com" style={link}>meliroxmusic@gmail.com</a>
            <div style={{ ...label, margin: "16px 0 0" }}>Medellín · Colombia</div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap", marginTop: "clamp(38px, 5vw, 60px)", paddingTop: "22px", borderTop: "1px solid rgba(212,180,122,.1)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "#6f6450" }}>
          <span>© 2026 Meli Rox · Medellín, Colombia</span>
          <span>{t("Cantautora · Violinista eléctrica · Artista en vivo", "Singer-songwriter · Electric violinist · Live artist")}</span>
        </div>
      </div>
    </footer>
  );
}
