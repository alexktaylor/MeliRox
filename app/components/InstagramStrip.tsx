"use client";

import { useEffect, useRef, useState } from "react";

export const IG_POSTS: string[] = [
  "https://www.instagram.com/p/DaQ9Q-NJ0E1/",
  "https://www.instagram.com/p/DaHPE5LBjpj/",
  "https://www.instagram.com/p/DZn3RTQJTAF/",
  "https://www.instagram.com/p/DZJNvHfpFxn/",
  "https://www.instagram.com/p/DY-8aVxJKla/",
];

const IG_FOOTER_CROP = 172;
const IG_NATURAL_W = 326; // Instagram's enforced minimum embed width

export default function InstagramStrip({ urls = IG_POSTS }: { urls?: string[] }) {
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [vw, setVw] = useState(1200);

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

  useEffect(() => {
    const w = window as unknown as { instgrm?: { embeds?: { process?: () => void } } };
    const process = () => {
      try {
        w.instgrm?.embeds?.process?.();
      } catch {}
    };
    if (w.instgrm) {
      process();
    } else {
      const existing = document.getElementById("ig-embed-script") as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", process);
      } else {
        const s = document.createElement("script");
        s.id = "ig-embed-script";
        s.src = "https://www.instagram.com/embed.js";
        s.async = true;
        s.onload = process;
        document.body.appendChild(s);
      }
    }

    const observers: ResizeObserver[] = [];
    const handled = new Set<number>();
    const applyCrop = (i: number) => {
      const wrap = wrapRefs.current[i];
      const outer = outerRefs.current[i];
      if (!wrap || !outer) return;
      const iframe = wrap.querySelector("iframe") as HTMLIFrameElement | null;
      if (!iframe) return false;
      const apply = () => {
        const h = iframe.offsetHeight;
        if (h > IG_FOOTER_CROP + 120) {
          const ch = h - IG_FOOTER_CROP;
          wrap.style.height = ch + "px";
          outer.style.height = Math.round(ch * scale) + "px";
        }
      };
      apply();
      const ro = new ResizeObserver(apply);
      ro.observe(iframe);
      observers.push(ro);
      return true;
    };
    const poll = setInterval(() => {
      urls.forEach((_, i) => {
        if (!handled.has(i) && applyCrop(i)) handled.add(i);
      });
      if (handled.size >= urls.length) clearInterval(poll);
    }, 250);
    const stop = setTimeout(() => clearInterval(poll), 10000);
    return () => {
      clearInterval(poll);
      clearTimeout(stop);
      observers.forEach((o) => o.disconnect());
    };
  }, [urls, isMobile, vw, scale]);

  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollSnapType: isMobile ? "x mandatory" : "none", padding: "2px 0 14px", scrollbarWidth: "thin", scrollbarColor: "rgba(212,180,122,.4) transparent" }}>
      <div style={{ display: "flex", gap: gap + "px", width: "max-content", margin: isMobile ? 0 : "0 auto", alignItems: "flex-start", justifyContent: isMobile ? "flex-start" : "center" }}>
        {urls.map((u, i) => (
          <div key={u} ref={(el) => { outerRefs.current[i] = el; }} style={{ flex: "0 0 auto", width: itemW + "px", minHeight: Math.round(IG_NATURAL_W * 1.15 * scale) + "px", scrollSnapAlign: isMobile ? "start" : "none" }}>
            <div ref={(el) => { wrapRefs.current[i] = el; }} style={{ width: IG_NATURAL_W + "px", minHeight: Math.round(IG_NATURAL_W * 1.15) + "px", background: "#0e0c09", overflow: "hidden", borderRadius: "6px", border: "1px solid rgba(212,180,122,.2)", transform: `scale(${scale})`, transformOrigin: "top left" }}>
              <blockquote className="instagram-media" data-instgrm-permalink={u} data-instgrm-version="14" style={{ background: "#0a0908", border: 0, margin: 0, width: "100%", minWidth: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
