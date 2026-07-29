import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

// Renders a document's HTML into a clean PDF (no browser headers/footers/URL stamp).
// The client sends the already-styled document markup; we wrap it with the same
// fonts and let headless Chrome print it.
export const runtime = "nodejs";
export const maxDuration = 60;

const CHROMIUM_PACK =
  "https://github.com/Sparticuz/chromium/releases/download/v147.0.0/chromium-v147.0.0-pack.x64.tar";
const LOCAL_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function wrap(html: string, origin: string) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<base href="${origin}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Manrope:wght@200..700&family=IBM+Plex+Mono:wght@400;500&family=Great+Vibes&display=swap" rel="stylesheet">
<style>
  :root{
    --font-cormorant:"Cormorant Garamond";
    --font-manrope:"Manrope";
    --font-mono:"IBM Plex Mono";
    --font-signature:"Great Vibes";
  }
  *{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  html,body{ margin:0; padding:0; background:#fff; font-family:"Manrope",sans-serif; }
  .paper{ box-shadow:none !important; border-radius:0 !important; margin:0 !important; max-width:none !important; }
  .no-print{ display:none !important; }
  .avoid-break{ break-inside:avoid; }
  @page{ size:A4; margin:14mm 12mm; }
</style></head><body>${html}</body></html>`;
}

export async function POST(req: Request) {
  try {
    const { html, filename } = (await req.json()) as { html?: string; filename?: string };
    if (!html || html.length < 50) {
      return NextResponse.json({ error: "Falta el contenido del documento." }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const isLocal = origin.includes("localhost") || origin.includes("127.0.0.1");

    let browser;
    if (isLocal) {
      browser = await puppeteer.launch({
        executablePath: LOCAL_CHROME,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    } else {
      const chromium = (await import("@sparticuz/chromium-min")).default;
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: { width: 1240, height: 1754 },
        executablePath: await chromium.executablePath(CHROMIUM_PACK),
        headless: true,
      });
    }

    try {
      const page = await browser.newPage();
      await page.setContent(wrap(html, origin), { waitUntil: "networkidle0", timeout: 30000 });
      await page.evaluateHandle("document.fonts.ready");
      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        displayHeaderFooter: false, // no date / title / URL / page numbers
        margin: { top: "14mm", bottom: "14mm", left: "12mm", right: "12mm" },
      });

      const safe = (filename || "documento").replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "documento";
      return new NextResponse(Buffer.from(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safe}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error desconocido";
    return NextResponse.json({ error: "No se pudo generar el PDF: " + msg }, { status: 500 });
  }
}
