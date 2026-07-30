"use client";

import { useEffect } from "react";

type Gtag = (...args: unknown[]) => void;

// Fires a GA4 `generate_lead` event whenever anyone clicks a WhatsApp, phone,
// or email link anywhere on the site. Mark `generate_lead` as a key event in
// GA4 and import it into Google Ads as the conversion.
export default function LeadTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      let method = "";
      if (href.includes("wa.me") || href.includes("api.whatsapp.com") || href.includes("whatsapp.com/send")) method = "whatsapp";
      else if (href.startsWith("tel:")) method = "phone";
      else if (href.startsWith("mailto:")) method = "email";
      if (!method) return;
      const gtag = (window as unknown as { gtag?: Gtag }).gtag;
      gtag?.("event", "generate_lead", {
        method,
        // Nombre propio: `page_location` es un parámetro reservado de GA4 (la URL
        // completa, que GA4 ya recoge solo). Al pisarlo con una ruta suelta se
        // ensuciaba la dimensión de página justo en los eventos que importan.
        lead_page: location.pathname,
      });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
