"use client";

import Link from "next/link";
import { useState } from "react";

const GOLD = "linear-gradient(135deg, #ecd9ac, #b98f4e)";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/#musica", label: "Música" },
  { href: "/#envivo", label: "En vivo" },
  { href: "/#experiencias", label: "Experiencias" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#contacto", label: "Contacto" },
];

export default function SiteNav({ cta, waHref }: { cta: string; waHref: string }) {
  const [open, setOpen] = useState(false);
  const navLink: React.CSSProperties = { color: "#ddd2b8", textDecoration: "none", fontSize: "13.5px", fontWeight: 500, letterSpacing: ".06em", padding: "8px 2px" };

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px", padding: "12px clamp(20px, 5vw, 48px)", background: "rgba(11,10,8,.82)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(212,180,122,.14)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flex: "0 0 auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uploads/meli-rox-logo-clean-print-transparent.png" alt="Meli Rox" style={{ height: "72px", width: "auto", margin: "-18px 0 -18px -10px" }} />
        </Link>

        <div className="svc-nav-links" style={{ alignItems: "center", gap: "clamp(14px, 2.2vw, 28px)", flexWrap: "wrap", justifyContent: "center", flex: "1 1 auto" }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} style={navLink}>{n.label}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "0 0 auto" }}>
          <Link href="/" className="svc-nav-home" style={{ textDecoration: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".16em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(212,180,122,.4)", borderRadius: "999px", padding: "10px 15px", whiteSpace: "nowrap" }}>Inicio</Link>
          <a href={waHref} target="_blank" className="svc-nav-cta" style={{ textDecoration: "none", fontSize: "12.5px", fontWeight: 600, letterSpacing: ".06em", color: "#171208", background: GOLD, padding: "11px 20px", borderRadius: "999px", whiteSpace: "nowrap" }}>{cta}</a>
          <button onClick={() => setOpen((v) => !v)} aria-label="Menú" className="svc-nav-burger" style={{ alignItems: "center", justifyContent: "center", width: "44px", height: "44px", background: "none", border: "1px solid rgba(212,180,122,.4)", borderRadius: "50%", color: "#ecd9ac", fontSize: "16px", cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
        </div>
      </header>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(8,7,6,.97)", backdropFilter: "blur(10px)", padding: "110px clamp(24px, 8vw, 48px) 40px", display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ textDecoration: "none", fontFamily: "'Cormorant Garamond', serif", fontSize: "34px", color: "#f4edda", padding: "10px 0", borderBottom: "1px solid rgba(212,180,122,.14)" }}>{n.label}</Link>
          ))}
          <a href={waHref} target="_blank" onClick={() => setOpen(false)} style={{ marginTop: "26px", textAlign: "center", textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "17px 28px", borderRadius: "999px" }}>{cta}</a>
        </div>
      )}
    </>
  );
}
