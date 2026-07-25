"use client";

import { useMemo, useState } from "react";

const GOLD = "linear-gradient(135deg, #ecd9ac, #b98f4e)";
const serif = "var(--font-cormorant), serif";
const mono = "var(--font-mono), monospace";
const BASE = "https://melirox.com/propuesta/15";
const DEF_ANTES = 1500000;
const DEF_AHORA = 1000000;

const fmt = (n: number) => "$" + (isFinite(n) && n > 0 ? n.toLocaleString("es-CO") : "—");

export default function Editar() {
  const [antes, setAntes] = useState(String(DEF_ANTES));
  const [ahora, setAhora] = useState(String(DEF_AHORA));
  const [copied, setCopied] = useState(false);

  const nAntes = parseInt(antes.replace(/[^\d]/g, ""), 10);
  const nAhora = parseInt(ahora.replace(/[^\d]/g, ""), 10);

  const link = useMemo(() => {
    const params = new URLSearchParams();
    if (nAntes > 0 && nAntes !== DEF_ANTES) params.set("antes", String(nAntes));
    if (nAhora > 0 && nAhora !== DEF_AHORA) params.set("ahora", String(nAhora));
    const q = params.toString();
    return q ? `${BASE}?${q}` : BASE;
  }, [nAntes, nAhora]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0908", border: "1px solid rgba(212,180,122,.35)", borderRadius: "8px", padding: "16px 16px", color: "#f4edda", fontFamily: mono, fontSize: "18px", letterSpacing: ".04em", outline: "none" };
  const label: React.CSSProperties = { fontFamily: mono, fontSize: "11px", letterSpacing: ".22em", textTransform: "uppercase", color: "#a99a7c", display: "block", marginBottom: "8px" };

  return (
    <main style={{ minHeight: "100svh", background: "#0b0a08", color: "#f2ecdf", padding: "clamp(24px, 5vw, 60px) clamp(20px, 5vw, 48px)" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/uploads/meli-rox-logo-clean-print-transparent.webp" alt="Meli Rox" style={{ height: "70px", width: "auto", margin: "-16px 0 4px -10px" }} />
        <div style={{ fontFamily: mono, fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c" }}>Propuesta · Fiesta de 15</div>
        <h1 style={{ margin: "10px 0 6px", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 6vw, 42px)", color: "#f4edda" }}>
          Edita los <em style={{ fontStyle: "italic", background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>precios</em>.
        </h1>
        <p style={{ margin: "0 0 26px", fontWeight: 300, fontSize: "15px", lineHeight: 1.65, color: "#a99a7c" }}>
          Escribe los precios para este cliente, copia el link y envíalo por WhatsApp. El link normal (sin editar) siempre muestra {fmt(DEF_ANTES).replace("$", "$")} → {fmt(DEF_AHORA)}.
        </p>

        <div style={{ display: "grid", gap: "18px" }}>
          <div>
            <label style={label}>Tarifa regular (tachada)</label>
            <input inputMode="numeric" value={antes} onChange={(e) => setAntes(e.target.value)} style={input} />
          </div>
          <div>
            <label style={label}>Precio especial (grande, dorado)</label>
            <input inputMode="numeric" value={ahora} onChange={(e) => setAhora(e.target.value)} style={input} />
          </div>
        </div>

        {/* Live preview */}
        <div style={{ margin: "26px 0 0", border: "1px solid rgba(212,180,122,.3)", borderRadius: "10px", padding: "26px 22px", textAlign: "center", background: "radial-gradient(ellipse 120% 90% at 50% 0%, rgba(138,106,63,.16), transparent 60%), #0a0908" }}>
          <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: "18px", color: "#8a7d63" }}>
            Tarifa regular <span style={{ textDecoration: "line-through", textDecorationColor: "rgba(212,180,122,.6)" }}>{fmt(nAntes)}</span>
          </div>
          <div style={{ marginTop: "8px", fontFamily: serif, fontWeight: 300, fontSize: "clamp(44px, 10vw, 64px)", lineHeight: 1, background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {fmt(nAhora)}
          </div>
          <div style={{ marginTop: "6px", fontFamily: mono, fontSize: "10px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>Así lo verá el cliente</div>
        </div>

        <div style={{ margin: "22px 0 0", background: "#0a0908", border: "1px solid rgba(212,180,122,.22)", borderRadius: "8px", padding: "14px 16px", fontFamily: mono, fontSize: "12.5px", lineHeight: 1.6, color: "#d9ccae", wordBreak: "break-all" }}>
          {link}
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
          <button onClick={copy} style={{ flex: "1 1 auto", cursor: "pointer", border: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "17px 26px", borderRadius: "999px" }}>
            {copied ? "¡Link copiado!" : "Copiar link"}
          </button>
          <a href={link} target="_blank" style={{ flex: "0 0 auto", textDecoration: "none", fontFamily: mono, fontSize: "12px", letterSpacing: ".14em", textTransform: "uppercase", color: "#ecd9ac", border: "1px solid rgba(212,180,122,.5)", borderRadius: "999px", padding: "16px 22px" }}>
            Ver la propuesta
          </a>
        </div>
      </div>
    </main>
  );
}
