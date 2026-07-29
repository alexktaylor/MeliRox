// Sends the printable document markup to /api/pdf and hands the result to the user.
// Produces a clean PDF (no browser date/URL/page-number stamps) on any device.
//
// Mobile (iOS/Android) ignores <a download>, so we use the native share sheet when
// available — she can send it straight to WhatsApp. Desktop downloads the file.
export async function descargarPdf(filename: string) {
  const paper = document.querySelector(".paper");
  if (!paper) throw new Error("No se encontró el documento.");

  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: paper.outerHTML, filename }),
  });

  if (!res.ok) {
    let msg = "No se pudo generar el PDF.";
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  const blob = await res.blob();
  const name = `${filename}.pdf`;
  const file = new File([blob], name, { type: "application/pdf" });

  // Native share sheet (iOS/Android) — lets her send straight to WhatsApp with a real filename.
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean };
  if (typeof nav.share === "function" && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: name });
      return "compartido";
    } catch (e) {
      // User cancelled the sheet — don't fall through to a download they didn't ask for.
      if (e instanceof Error && e.name === "AbortError") return "cancelado";
    }
  }

  // Desktop: normal download.
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "descargado";
}
