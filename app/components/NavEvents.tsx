"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { SERVICE_LINKS, HUB_LINK } from "./serviceLinks";

// Desktop hover/focus dropdown linking to the event landing pages.
export default function NavEvents({
  isEn = false,
  triggerStyle,
  align = "left",
}: {
  isEn?: boolean;
  triggerStyle?: CSSProperties;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const t = (es: string, en: string) => (isEn ? en : es);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
    >
      <Link
        href={HUB_LINK.href}
        aria-haspopup="true"
        aria-expanded={open}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", ...triggerStyle }}
      >
        {t("Eventos", "Events")}
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ transition: "transform .25s", transform: open ? "rotate(180deg)" : "none", opacity: 0.75 }} aria-hidden="true">
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          [align]: 0,
          minWidth: "248px",
          background: "rgba(14,12,9,.98)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(212,180,122,.22)",
          borderRadius: "10px",
          padding: "8px",
          boxShadow: "0 24px 60px rgba(0,0,0,.55)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transform: open ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity .2s, transform .2s, visibility .2s",
          zIndex: 60,
        }}
      >
        {SERVICE_LINKS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: "block",
              textDecoration: "none",
              color: "#ddd2b8",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: ".02em",
              padding: "11px 14px",
              borderRadius: "7px",
              whiteSpace: "nowrap",
              transition: "background .18s, color .18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,180,122,.12)"; e.currentTarget.style.color = "#f7f1e0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ddd2b8"; }}
          >
            {t(s.es, s.en)}
          </Link>
        ))}
        <div style={{ height: "1px", background: "rgba(212,180,122,.14)", margin: "6px 10px" }} />
        <Link
          href={HUB_LINK.href}
          style={{ display: "block", textDecoration: "none", color: "#ecd9ac", fontFamily: "var(--font-mono), monospace", fontSize: "11px", letterSpacing: ".16em", textTransform: "uppercase", padding: "10px 14px", borderRadius: "7px" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,180,122,.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          {t("Violinista en Medellín →", "Violinist in Medellín →")}
        </Link>
      </div>
    </div>
  );
}
