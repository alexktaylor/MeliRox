"use client";

import { useEffect, useState } from "react";

export const IG_POSTS: string[] = [
  "https://www.instagram.com/p/DaQ9Q-NJ0E1/",
  "https://www.instagram.com/p/DaHPE5LBjpj/",
  "https://www.instagram.com/p/DZn3RTQJTAF/",
  "https://www.instagram.com/p/DZJNvHfpFxn/",
  "https://www.instagram.com/p/DY-8aVxJKla/",
];

const IG_NATURAL_W = 326; // Instagram's enforced minimum embed width
const IG_IFRAME_H = 560; // height we render the embed at
const IG_VISIBLE_H = 470; // crop the bottom (likes / caption / "view on Instagram") bar

// Build the direct /embed iframe URL — no embed.js, no blockquote conversion.
const embedSrc = (permalink: string) =>
  permalink.replace(/\/?$/, "/") + "embed";

export default function InstagramStrip({ urls = IG_POSTS }: { urls?: string[] }) {
  const [vw, setVw] = useState(1200);
  const [loaded, setLoaded] = useState<boolean[]>(() => urls.map(() => false));

  useEffect(() => {
    setVw(window.innerWidth);
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  const isMobile = vw < 760;
  const N = urls.length;
  const gap = 14;
  const avail = Math.min(1560, vw - 60);
  const scale = isMobile
    ? Math.min(1, (vw * 0.8) / IG_NATURAL_W)
    : Math.max(0.5, Math.min(1, (avail - (N - 1) * gap) / (N * IG_NATURAL_W)));
  const itemW = Math.round(IG_NATURAL_W * scale);
  const itemH = Math.round(IG_VISIBLE_H * scale);

  const markLoaded = (i: number) =>
    setLoaded((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))));

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollSnapType: isMobile ? "x mandatory" : "none", padding: "2px 0 14px", scrollbarWidth: "thin", scrollbarColor: "rgba(212,180,122,.4) transparent" }}>
      <div style={{ display: "flex", gap: gap + "px", width: "max-content", margin: isMobile ? 0 : "0 auto", alignItems: "flex-start", justifyContent: isMobile ? "flex-start" : "center" }}>
        {urls.map((u, i) => (
          <div key={u} style={{ position: "relative", flex: "0 0 auto", width: itemW + "px", height: itemH + "px", scrollSnapAlign: isMobile ? "start" : "none" }}>
            {!loaded[i] && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", background: "#0e0c09", borderRadius: "6px", border: "1px solid rgba(212,180,122,.2)", pointerEvents: "none" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: "2px solid rgba(212,180,122,.25)", borderTopColor: "#ecd9ac", animation: "ig-spin 0.8s linear infinite" }} />
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".24em", textTransform: "uppercase", color: "#8a7d63" }}>Instagram</div>
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, width: IG_NATURAL_W + "px", height: IG_VISIBLE_H + "px", overflow: "hidden", borderRadius: "6px", border: "1px solid rgba(212,180,122,.2)", background: "#0e0c09", transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <iframe
                src={embedSrc(u)}
                title="Instagram"
                loading="lazy"
                scrolling="no"
                allowTransparency
                onLoad={() => markLoaded(i)}
                style={{ display: "block", width: IG_NATURAL_W + "px", height: IG_IFRAME_H + "px", border: 0, background: "#0a0908" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
