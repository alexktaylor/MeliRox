"use client";

import { useState } from "react";

export type MediaItem = { src: string; alt: string; videoSrc?: string };

export default function MediaCarousel({ items }: { items: MediaItem[] }) {
  const [lb, setLb] = useState<{ src?: string; videoSrc?: string; alt: string } | null>(null);

  return (
    <>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", padding: "4px 0 16px", scrollbarWidth: "thin", scrollbarColor: "rgba(212,180,122,.4) transparent", scrollSnapType: "x proximity" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center", width: "max-content" }}>
          {items.map((m, i) => (
            <figure
              key={m.src + i}
              onClick={() => setLb(m.videoSrc ? { videoSrc: m.videoSrc, alt: m.alt } : { src: m.src, alt: m.alt })}
              style={{ margin: 0, position: "relative", flex: "0 0 auto", overflow: "hidden", borderRadius: "4px", border: "1px solid rgba(212,180,122,.18)", cursor: "pointer", scrollSnapAlign: "start", height: "clamp(320px, 52vw, 460px)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.src} alt={m.alt} loading="lazy" style={{ display: "block", height: "100%", width: "auto", maxWidth: "86vw", objectFit: "cover", filter: "saturate(.92) brightness(.9)" }} />
              {m.videoSrc && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(8,7,6,.22)", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "linear-gradient(135deg, #ecd9ac, #b98f4e)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 26px rgba(0,0,0,.5)" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#171208" aria-hidden="true" style={{ marginLeft: "3px" }}><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              )}
              <figcaption style={{ position: "absolute", left: "12px", bottom: "10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10.5px", letterSpacing: ".18em", textTransform: "uppercase", color: "#eee3c2", textShadow: "0 1px 8px rgba(0,0,0,.9)", pointerEvents: "none" }}>{m.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>

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
    </>
  );
}
