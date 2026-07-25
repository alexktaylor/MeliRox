"use client";

import { useEffect, useRef, useState } from "react";

const GOLD = "linear-gradient(135deg, #ecd9ac, #b98f4e)";
const serif = "var(--font-cormorant), serif";
const mono = "var(--font-mono), monospace";
// No prefilled message — they're already chatting with Meli; the button just reopens the conversation.
const WA = "https://wa.me/573045502154";

// Autoplay muted preview in view; tap unmutes the SAME clip (instant, no reload).
function ShowVideo({ src, poster, label, sub }: { src: string; poster: string; label: string; sub: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "250px 0px", threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  const activate = () => {
    const v = ref.current;
    if (!v || active) return;
    v.muted = false;
    setActive(true);
    v.play().catch(() => {});
  };

  return (
    <div>
      <div style={{ position: "relative", aspectRatio: "9 / 16", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(212,180,122,.25)", background: "#080706" }}>
        <video ref={ref} src={src} poster={poster} playsInline preload="none" loop={!active} controls={active} onClick={activate} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", cursor: active ? "default" : "pointer" }} />
        {!active && (
          <div onClick={activate} style={{ position: "absolute", top: "12px", right: "12px", display: "flex", alignItems: "center", gap: "7px", background: "rgba(8,7,6,.62)", backdropFilter: "blur(4px)", border: "1px solid rgba(232,207,158,.55)", borderRadius: "999px", padding: "8px 13px", color: "#ecd9ac", fontFamily: mono, fontSize: "10px", letterSpacing: ".14em", textTransform: "uppercase", cursor: "pointer", zIndex: 2 }}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="#ecd9ac" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z" /></svg>
            <span>Con sonido</span>
          </div>
        )}
      </div>
      <div style={{ marginTop: "14px", fontFamily: serif, fontStyle: "italic", fontSize: "clamp(21px, 2.4vw, 25px)", color: "#f1e2ba", lineHeight: 1.2 }}>{label}</div>
      <p style={{ margin: "6px 0 0", fontWeight: 300, fontSize: "14px", lineHeight: 1.6, color: "#a99a7c" }}>{sub}</p>
    </div>
  );
}

const fmt = (n: number) => "$" + n.toLocaleString("es-CO");

export default function Propuesta15() {
  const heroRef = useRef<HTMLVideoElement>(null);
  // Prices can be overridden per-client via the link Meli generates in /propuesta/15/editar
  // (?antes=1500000&ahora=1200000). Defaults match her standard proposal.
  const [precio, setPrecio] = useState({ antes: 1500000, ahora: 1000000 });

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const antes = parseInt(q.get("antes") || "", 10);
    const ahora = parseInt(q.get("ahora") || "", 10);
    if (antes > 0 || ahora > 0) {
      setPrecio((p) => ({ antes: antes > 0 ? antes : p.antes, ahora: ahora > 0 ? ahora : p.ahora }));
    }
  }, []);

  useEffect(() => {
    const v = heroRef.current;
    if (!v) return;
    v.muted = true;
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

  const eyebrow: React.CSSProperties = { fontFamily: mono, fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c" };
  const waBtn: React.CSSProperties = { display: "inline-block", textDecoration: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#171208", background: GOLD, padding: "17px 30px", borderRadius: "999px", boxShadow: "0 10px 34px rgba(0,0,0,.5), 0 0 26px rgba(232,207,158,.22)" };

  return (
    <main style={{ background: "#0b0a08", color: "#f2ecdf", overflowX: "hidden" }}>
      {/* Mini nav */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, display: "flex", alignItems: "center", padding: "10px clamp(18px, 5vw, 44px)", background: "linear-gradient(180deg, rgba(8,7,6,.85), rgba(8,7,6,0))" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/uploads/meli-rox-logo-clean-print-transparent.webp" alt="Meli Rox" style={{ height: "64px", width: "auto", margin: "-14px 0 -14px -10px" }} />
      </header>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100svh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <video ref={heroRef} src="/Vids/bg/alas15.mp4" poster="/Vids/posters/alas15.jpg" muted loop playsInline preload="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%", filter: "saturate(.96) brightness(.92)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "72%", background: "linear-gradient(180deg, transparent 0%, rgba(8,7,6,.3) 32%, rgba(8,7,6,.66) 56%, rgba(8,7,6,.92) 80%, #0b0a08 100%)" }} />
        </div>
        <div style={{ position: "relative", width: "min(1100px, 100%)", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px) clamp(48px, 8vh, 84px)" }}>
          <div style={{ height: "44px", width: "1px", margin: "0 0 14px", background: "linear-gradient(180deg, transparent, #e8cf9e)" }} />
          <div style={eyebrow}>Propuesta musical · Fiesta de 15</div>
          <h1 style={{ margin: "14px 0 0", fontFamily: serif, fontWeight: 300, fontSize: "clamp(38px, 7.5vw, 74px)", lineHeight: 1.08, color: "#f4edda", maxWidth: "700px" }}>
            Una noche que ella recordará <em style={{ fontStyle: "italic", background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>toda la vida</em>.
          </h1>
          <p style={{ margin: "16px 0 0", maxWidth: "520px", fontWeight: 300, fontSize: "clamp(15.5px, 1.9vw, 18px)", lineHeight: 1.65, color: "#d9ccae" }}>
            Show en vivo de violín y voz con Meli Rox — la entrada, el vals y sus canciones favoritas, convertidos en un espectáculo.
          </p>
          <div style={{ marginTop: "26px" }}>
            <a href={WA} target="_blank" style={waBtn}>Confirmar por WhatsApp</a>
          </div>
        </div>
      </section>

      {/* El show */}
      <section style={{ padding: "clamp(54px, 8vw, 110px) clamp(20px, 5vw, 48px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={eyebrow}>El show</div>
          <h2 style={{ margin: "12px 0 clamp(28px, 4vw, 44px)", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4.6vw, 50px)", color: "#f4edda", lineHeight: 1.12 }}>
            Así se ve <em style={{ fontStyle: "italic", background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>en vivo</em>.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))", gap: "clamp(24px, 3.4vw, 36px)" }}>
            <ShowVideo src="/Vids/preview/salon15.mp4" poster="/Vids/posters/salon15.jpg" label="Violín en vivo" sub="Elegancia para la recepción y los momentos con la familia." />
            <ShowVideo src="/Vids/preview/quince.mp4" poster="/Vids/posters/quince.jpg" label="El toque de gala" sub="Presencia de show que transforma el salón en un escenario." />
            <ShowVideo src="/Vids/preview/alas15.mp4" poster="/Vids/posters/alas15.jpg" label="La entrada con alas LED" sub="El momento que abre la noche — luz, música y una entrada que nadie espera." />
          </div>
          <p style={{ margin: "clamp(22px, 3vw, 30px) 0 0", fontFamily: serif, fontStyle: "italic", fontWeight: 300, fontSize: "clamp(16px, 1.9vw, 19px)", color: "#a99a7c" }}>
            Toca cualquier video para escucharlo con sonido.
          </p>
        </div>
      </section>

      {/* Qué incluye */}
      <section style={{ padding: "clamp(54px, 8vw, 110px) clamp(20px, 5vw, 48px)", background: "#0d0b09", borderTop: "1px solid rgba(212,180,122,.1)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={eyebrow}>Qué incluye</div>
          <h2 style={{ margin: "12px 0 clamp(30px, 4.4vw, 52px)", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4.6vw, 50px)", color: "#f4edda", lineHeight: 1.12 }}>
            Una experiencia <em style={{ fontStyle: "italic", background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>completa</em>.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: "clamp(22px, 3vw, 36px)" }}>
            {[
              { t: "Show personalizado", d: "La entrada, el vals y sus canciones favoritas — violín, voz o ambos, al estilo de ella." },
              { t: "Formato flexible", d: "Una hora continua o dos tandas de 30 minutos, en los momentos clave de la fiesta." },
              { t: "Micrófono profesional", d: "Micrófono inalámbrico profesional incluido — nos acoplamos al sonido del salón." },
              { t: "Acompañamiento logístico", d: "Coordinación con el salón y la familia para que la sorpresa salga perfecta." },
            ].map((it, i) => (
              <div key={it.t} style={{ borderTop: "1px solid rgba(212,180,122,.4)", paddingTop: "16px" }}>
                <div style={{ fontFamily: mono, fontSize: "11px", letterSpacing: ".26em", color: "#8a7d63" }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ marginTop: "10px", fontFamily: serif, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(21px, 2.4vw, 25px)", color: "#f1e2ba", lineHeight: 1.2 }}>{it.t}</div>
                <p style={{ margin: "9px 0 0", fontWeight: 300, fontSize: "14.5px", lineHeight: 1.7, color: "#bcb096" }}>{it.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inversión */}
      <section style={{ padding: "clamp(54px, 8vw, 110px) clamp(20px, 5vw, 48px)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
          <div style={eyebrow}>La inversión</div>
          <div style={{ margin: "clamp(26px, 4vw, 40px) auto 0", border: "1px solid rgba(212,180,122,.3)", borderRadius: "10px", padding: "clamp(30px, 5vw, 48px) clamp(22px, 4vw, 44px)", background: "radial-gradient(ellipse 120% 90% at 50% 0%, rgba(138,106,63,.16), transparent 60%), #0a0908" }}>
            <div style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(19px, 2.4vw, 23px)", color: "#8a7d63" }}>
              Tarifa regular <span style={{ textDecoration: "line-through", textDecorationColor: "rgba(212,180,122,.6)" }}>{fmt(precio.antes)}</span>
            </div>
            <div style={{ marginTop: "10px", fontFamily: serif, fontWeight: 300, fontSize: "clamp(52px, 11vw, 84px)", lineHeight: 1, background: GOLD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {fmt(precio.ahora)}
            </div>
            <div style={{ marginTop: "8px", fontFamily: mono, fontSize: "11px", letterSpacing: ".24em", textTransform: "uppercase", color: "#a99a7c" }}>Precio especial · COP</div>
            <div style={{ margin: "22px auto 0", maxWidth: "380px", borderTop: "1px solid rgba(212,180,122,.18)", paddingTop: "20px", fontWeight: 300, fontSize: "15px", lineHeight: 1.7, color: "#d9ccae" }}>
              Reserva tu fecha con el <strong style={{ color: "#f1e2ba", fontWeight: 600 }}>30%</strong> y queda asegurada. El resto se paga el día del evento.
            </div>
          </div>
          <div style={{ marginTop: "clamp(28px, 4vw, 40px)" }}>
            <a href={WA} target="_blank" style={waBtn}>Confirmar por WhatsApp</a>
          </div>
          <p style={{ margin: "18px 0 0", fontWeight: 300, fontSize: "13.5px", color: "#8a7d63" }}>Sujeto a disponibilidad de fecha · Medellín y alrededores</p>
        </div>
      </section>

      {/* En fotos — swipeable strip */}
      <section style={{ padding: "0 0 clamp(54px, 8vw, 110px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 clamp(20px, 5vw, 48px)" }}>
          <div style={eyebrow}>En fotos</div>
        </div>
        <div style={{ display: "flex", gap: "14px", overflowX: "auto", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", padding: "18px clamp(20px, 5vw, 48px) 8px", scrollPaddingLeft: "clamp(20px, 5vw, 48px)" }}>
          {[
            { src: "/uploads/drive-download-20260714T181149Z-1-001/Meli%20violin%20(1).webp", alt: "Meli Rox tocando violín eléctrico en vivo" },
            { src: "/uploads/drive-download-20260714T181149Z-1-001/IMG_2501.webp", alt: "Meli Rox tocando violín en tarima" },
            { src: "/uploads/drive-download-20260714T181149Z-1-001/wedding.webp", alt: "Meli Rox con su violín en un evento elegante" },
          ].map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.src} src={p.src} alt={p.alt} loading="lazy" decoding="async" style={{ height: "clamp(320px, 52vh, 460px)", width: "auto", borderRadius: "8px", border: "1px solid rgba(212,180,122,.25)", scrollSnapAlign: "center", flex: "0 0 auto" }} />
          ))}
        </div>
      </section>

      {/* Footer mini */}
      <footer style={{ padding: "26px clamp(20px, 5vw, 48px) 40px", borderTop: "1px solid rgba(212,180,122,.12)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", flexWrap: "wrap" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/uploads/meli-rox-logo-clean-print-transparent.webp" alt="Meli Rox" style={{ height: "56px", width: "auto", margin: "-10px 0 -10px -8px" }} />
        <div style={{ fontFamily: mono, fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "#8a7d63" }}>
          <a href="https://www.instagram.com/meliroxoficial/" target="_blank" style={{ color: "#a99a7c", textDecoration: "none" }}>@meliroxoficial</a>
          <span style={{ margin: "0 10px" }}>·</span>
          <a href="tel:+573045502154" style={{ color: "#a99a7c", textDecoration: "none" }}>+57 304 550 2154</a>
        </div>
      </footer>
    </main>
  );
}
