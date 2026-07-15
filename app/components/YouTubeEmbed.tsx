"use client";

import { useState } from "react";

export default function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "3px", overflow: "hidden", background: "#000", border: "1px solid rgba(212,180,122,.22)" }}>
      {play ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : (
        <button onClick={() => setPlay(true)} aria-label={`Reproducir: ${title}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, padding: 0, cursor: "pointer", background: `center 30% / cover no-repeat url(${thumb})` }}>
          <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,7,6,.25), rgba(8,7,6,.55))" }} />
          <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "62px", height: "62px", borderRadius: "50%", background: "linear-gradient(135deg, #ecd9ac, #b98f4e)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 30px rgba(0,0,0,.5)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#171208" aria-hidden="true" style={{ marginLeft: "3px" }}><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
