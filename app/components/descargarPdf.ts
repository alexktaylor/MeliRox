// Sends the printable document markup to /api/pdf and downloads the returned file.
// Produces a clean PDF (no browser date/URL/page-number stamps) on any device.
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
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
