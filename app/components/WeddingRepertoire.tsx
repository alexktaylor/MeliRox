"use client";

import { useRef, useState } from "react";

export type Song = { title: string; artist: string; preview: string };

export default function WeddingRepertoire({ songs }: { songs: Song[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(-1);

  const toggle = (i: number, src: string) => {
    const a = audioRef.current;
    if (!a) return;
    if (playing === i) {
      a.pause();
      setPlaying(-1);
      return;
    }
    a.src = src;
    a.currentTime = 0;
    a.play().catch(() => {});
    setPlaying(i);
  };

  const serif = "'Cormorant Garamond', serif";

  return (
    <div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: ".3em", textTransform: "uppercase", color: "#a99a7c" }}>Repertorio · Ceremonia</div>
      <h2 style={{ margin: "12px 0 0", fontFamily: serif, fontWeight: 300, fontSize: "clamp(30px, 4vw, 48px)", color: "#f4edda", lineHeight: 1.12 }}>Escucha la lista de bodas.</h2>
      <p style={{ margin: "14px 0 clamp(24px, 3vw, 32px)", fontWeight: 300, fontSize: "16px", lineHeight: 1.7, color: "#cabfa5", maxWidth: "460px" }}>
        Toca cualquier canción para escuchar un adelanto. El repertorio es 100% personalizable para tu boda.
      </p>

      <div style={{ border: "1px solid rgba(212,180,122,.2)", borderRadius: "6px", overflow: "hidden", background: "#0e0c09" }}>
        {songs.map((s, i) => {
          const active = playing === i;
          return (
            <button key={s.title + i} onClick={() => toggle(i, s.preview)} style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", textAlign: "left", padding: "14px clamp(14px, 2.4vw, 20px)", background: active ? "rgba(212,180,122,.08)" : "transparent", border: "none", borderTop: i === 0 ? "none" : "1px solid rgba(212,180,122,.1)", cursor: "pointer", transition: "background .3s" }}>
              <span style={{ flex: "0 0 auto", width: "38px", height: "38px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: active ? "linear-gradient(135deg, #ecd9ac, #b98f4e)" : "transparent", border: active ? "none" : "1px solid rgba(212,180,122,.4)", color: active ? "#171208" : "#ecd9ac" }}>
                {active ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ marginLeft: "2px" }}><path d="M8 5v14l11-7z" /></svg>
                )}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#8a7d63", width: "22px", flex: "0 0 auto" }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: serif, fontSize: "clamp(18px, 2.2vw, 22px)", color: active ? "#f7f1e0" : "#f2ecdf", lineHeight: 1.2 }}>{s.title}</span>
                <span style={{ display: "block", marginTop: "2px", fontSize: "12.5px", fontWeight: 500, letterSpacing: ".04em", color: "#a99a7c" }}>{s.artist}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p style={{ margin: "16px 0 0", fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "#8a7d63" }}>Adelantos de 30s · Canciones originales de referencia</p>
      <audio ref={audioRef} onEnded={() => setPlaying(-1)} style={{ display: "none" }} />
    </div>
  );
}
