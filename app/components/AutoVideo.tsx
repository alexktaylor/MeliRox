"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Background video that autoplays (muted, looped) ONLY while in view, and
// lazy-loads its source so pages stay fast. `eager` starts it immediately
// (for above-the-fold heroes).
export default function AutoVideo({
  src,
  poster,
  pos = "50% 50%",
  filter,
  eager = false,
}: {
  src: string;
  poster?: string;
  pos?: string;
  filter?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true; // both set so iOS reliably honours muted autoplay
    const start = () => {
      if (!v.getAttribute("src")) {
        v.setAttribute("src", src);
        v.load();
      }
      v.play().catch(() => {});
    };
    if (eager) start();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) start();
        else v.pause();
      },
      { threshold: 0.12 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, eager]);

  const style: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: pos,
    filter,
  };

  return (
    <video
      ref={(el) => { ref.current = el; if (el) { el.defaultMuted = true; el.muted = true; } }}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      aria-hidden="true"
      style={style}
    />
  );
}
