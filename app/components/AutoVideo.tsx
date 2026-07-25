"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

// Background video that autoplays (muted, looped) while in view. A still image sits
// BEHIND it and is always visible, so there's never a black box during load, page
// navigation, or iOS Low Power Mode (which blocks autoplay) — the video just fades
// in on top once it's actually playing. `eager` starts it immediately (heroes).
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
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // set in JS so iOS honours muted autoplay
    // Phones load a tiny ~1MB version so playback starts fast on mobile.
    const realSrc = window.innerWidth < 760 ? src.replace(".mp4", "-mobile.mp4") : src;
    const start = () => {
      if (!v.getAttribute("src")) {
        v.setAttribute("src", realSrc);
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

  const layer: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: pos,
    filter,
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {poster && <img src={poster} alt="" aria-hidden="true" loading={eager ? "eager" : "lazy"} decoding="async" style={layer} />}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload={eager ? "metadata" : "none"}
        aria-hidden="true"
        onPlaying={() => setPlaying(true)}
        style={{ ...layer, opacity: playing ? 1 : 0, transition: "opacity .5s ease" }}
      />
    </>
  );
}
