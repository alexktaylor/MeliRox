"use client";

import { useEffect, useState } from "react";
import { descargarPdf } from "../components/descargarPdf";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const GOLD = "#b98f4e";
const serif = "var(--font-cormorant), serif";
const mono = "var(--font-mono), monospace";

const fmtCOP = (n: number) => (isFinite(n) && n > 0 ? "$" + n.toLocaleString("es-CO") + " COP" : "$__________ COP");
const orBlank = (s: string, w = 24) => (s.trim() ? s : "_".repeat(w));

export default function Contrato() {
  const [f, setF] = useState({
    artistaNombre: "Meli Rox",
    artistaCedula: "",
    cliente: "",
    cedula: "",
    tipo: "serenata",
    fecha: "",
    hora: "",
    duracion: "1 hora",
    formato: "violín y voz",
    lugar: "",
    ciudad: "Medellín",
    valor: "",
    reservaPct: "30",
    fechaFirma: "", // YYYY-MM-DD, defaults to today
  });
  const [pdfEstado, setPdfEstado] = useState<"" | "generando" | "error">("");
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  // Remember Meli's own details (name/cédula/deposit) between clients; default sign date = today.
  useEffect(() => {
    let saved: Record<string, string> = {};
    try { saved = JSON.parse(localStorage.getItem("meli-contrato") || "{}"); } catch {}
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setF((p) => ({ ...p, artistaNombre: saved.artistaNombre ?? p.artistaNombre, artistaCedula: saved.artistaCedula ?? p.artistaCedula, reservaPct: saved.reservaPct ?? p.reservaPct, fechaFirma: today }));
  }, []);

  // Persist just Meli's details as they change.
  useEffect(() => {
    try { localStorage.setItem("meli-contrato", JSON.stringify({ artistaNombre: f.artistaNombre, artistaCedula: f.artistaCedula, reservaPct: f.reservaPct })); } catch {}
  }, [f.artistaNombre, f.artistaCedula, f.reservaPct]);

  const valor = parseInt(f.valor.replace(/[^\d]/g, ""), 10) || 0;
  const pct = Math.min(100, Math.max(0, parseInt(f.reservaPct.replace(/[^\d]/g, ""), 10) || 0));
  const reserva = Math.round((valor * pct) / 100);
  const saldo = valor - reserva;

  // Sign date parts (parsed manually to avoid timezone drift)
  const [fy, fm, fd] = (f.fechaFirma || "").split("-").map((n) => parseInt(n, 10));
  const firmaDia = fd ? String(fd) : "____";
  const firmaMes = fm ? MESES[fm - 1] : "____________";
  const firmaAnio = fy ? String(fy) : "20__";

  const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0908", border: "1px solid rgba(212,180,122,.35)", borderRadius: "7px", padding: "11px 12px", color: "#f4edda", fontFamily: mono, fontSize: "14px", outline: "none" };
  const label: React.CSSProperties = { fontFamily: mono, fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#a99a7c", display: "block", marginBottom: "6px" };
  const field = (l: string, k: keyof typeof f, ph = "", half = false) => (
    <div style={{ flex: half ? "1 1 160px" : "1 1 100%" }}>
      <label style={label}>{l}</label>
      <input value={f[k]} onChange={(e) => set(k, e.target.value)} placeholder={ph} style={input} />
    </div>
  );

  const cl: React.CSSProperties = { margin: "0 0 14px", fontSize: "14px", lineHeight: 1.75, color: "#1c1a15", textAlign: "justify" };
  const b = (t: string) => <strong style={{ color: "#000" }}>{t}</strong>;

  return (
    <main style={{ background: "#0b0a08", minHeight: "100vh", padding: "clamp(20px,4vw,48px) clamp(14px,4vw,40px)" }}>
      <style>{`@media print {
        .no-print { display: none !important; }
        .paper { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
        main { background: #fff !important; padding: 0 !important; }
        @page { margin: 18mm 16mm; }
      }`}</style>

      {/* Editor */}
      <div className="no-print" style={{ maxWidth: "820px", margin: "0 auto 26px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/uploads/meli-rox-logo-clean-print-transparent.webp" alt="Meli Rox" style={{ height: "56px", width: "auto", margin: "-12px 0 2px -8px" }} />
        <h1 style={{ margin: "6px 0 4px", fontFamily: serif, fontWeight: 300, fontSize: "clamp(26px,5vw,36px)", color: "#f4edda" }}>Generador de <em style={{ fontStyle: "italic", color: "#ecd9ac" }}>contrato</em></h1>
        <p style={{ margin: "0 0 20px", fontWeight: 300, fontSize: "14px", color: "#a99a7c" }}>Llena los datos, revisa el contrato abajo y toca <strong style={{ color: "#ecd9ac" }}>Imprimir / Guardar PDF</strong> para enviarlo a firmar.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
          {field("Nombre del cliente", "cliente", "Ej: Laura Gómez")}
          {field("Cédula del cliente", "cedula", "Ej: 1.000.000.000", true)}
          {field("Ciudad", "ciudad", "Medellín", true)}
          {field("Tipo de evento", "tipo", "serenata / boda / cumpleaños", true)}
          {field("Formato", "formato", "violín y voz", true)}
          {field("Fecha del evento", "fecha", "Ej: 14 de febrero de 2026", true)}
          {field("Hora", "hora", "Ej: 7:00 pm", true)}
          {field("Duración", "duracion", "1 hora / 2 tandas de 30 min", true)}
          {field("Lugar / dirección", "lugar", "Ej: Cra 00 #00-00, o nombre del salón")}
          {field("Valor total (COP)", "valor", "Ej: 1000000", true)}
          {field("% de reserva", "reservaPct", "30", true)}
          <div style={{ flex: "1 1 160px" }}>
            <label style={label}>Fecha de firma</label>
            <input type="date" value={f.fechaFirma} onChange={(e) => set("fechaFirma", e.target.value)} style={input} />
          </div>
          {field("Nombre legal de la artista", "artistaNombre", "Meli Rox", true)}
          {field("Cédula de la artista", "artistaCedula", "(opcional)", true)}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            disabled={pdfEstado === "generando"}
            onClick={async () => {
              setPdfEstado("generando");
              try {
                await descargarPdf(`Contrato ${f.cliente.trim() || "Meli Rox"}`);
                setPdfEstado("");
              } catch {
                setPdfEstado("error");
              }
            }}
            style={{ cursor: pdfEstado === "generando" ? "wait" : "pointer", opacity: pdfEstado === "generando" ? 0.7 : 1, border: "none", fontSize: "14px", fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#171208", background: "linear-gradient(135deg,#ecd9ac,#b98f4e)", padding: "15px 26px", borderRadius: "999px" }}
          >
            {pdfEstado === "generando" ? "Generando PDF…" : "Descargar / Enviar PDF"}
          </button>
          <button onClick={() => window.print()} style={{ cursor: "pointer", background: "none", border: "1px solid rgba(212,180,122,.4)", color: "#ecd9ac", fontFamily: mono, fontSize: "11.5px", letterSpacing: ".12em", textTransform: "uppercase", padding: "15px 20px", borderRadius: "999px" }}>
            Imprimir
          </button>
        </div>
        {pdfEstado === "error" && (
          <div style={{ marginTop: "12px", background: "rgba(200,80,60,.12)", border: "1px solid rgba(200,80,60,.4)", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#f0c9c0" }}>
            No se pudo generar el PDF. Usa el botón <strong>Imprimir</strong> y elige “Guardar como PDF”.
          </div>
        )}
      </div>

      {/* The contract — white printable paper */}
      <div className="paper" style={{ maxWidth: "820px", margin: "0 auto", background: "#fff", color: "#1c1a15", borderRadius: "6px", boxShadow: "0 20px 70px rgba(0,0,0,.5)", padding: "clamp(28px,5vw,60px)" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid " + GOLD, paddingBottom: "16px", marginBottom: "26px" }}>
          <div style={{ fontFamily: serif, fontSize: "30px", fontWeight: 600, color: GOLD, letterSpacing: ".02em" }}>Meli Rox</div>
          <div style={{ fontFamily: mono, fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", color: "#8a7d63", marginTop: "4px" }}>Música en vivo · Medellín</div>
        </div>

        <h2 style={{ textAlign: "center", fontFamily: serif, fontWeight: 600, fontSize: "22px", margin: "0 0 24px", color: "#000", letterSpacing: ".01em" }}>
          Contrato de Prestación de Servicios Artísticos
        </h2>

        <p style={cl}>
          Entre {b(orBlank(f.artistaNombre))}, quien actúa bajo el nombre artístico de {b("Meli Rox")}
          {f.artistaCedula.trim() ? <>, identificada con cédula de ciudadanía No. {b(f.artistaCedula)}</> : null}, en adelante {b("LA ARTISTA")}; y {b(orBlank(f.cliente))}, identificado(a) con cédula de ciudadanía No. {b(orBlank(f.cedula, 14))}, en adelante {b("EL/LA CLIENTE")}; se celebra el presente contrato, regido por las siguientes cláusulas:
        </p>

        <p style={cl}>
          {b("PRIMERA — OBJETO. ")} LA ARTISTA se compromete a prestar sus servicios de música en vivo, en formato de {b(orBlank(f.formato, 14))}, para el evento tipo {b(orBlank(f.tipo, 12))} de EL/LA CLIENTE.
        </p>

        <p style={cl}>
          {b("SEGUNDA — FECHA, HORA Y LUGAR. ")} La presentación se realizará el día {b(orBlank(f.fecha, 20))}, a las {b(orBlank(f.hora, 10))}, con una duración de {b(orBlank(f.duracion, 12))}, en {b(orBlank(f.lugar, 28))}, en la ciudad de {b(orBlank(f.ciudad, 12))}.
        </p>

        <p style={cl}>
          {b("TERCERA — REPERTORIO. ")} El repertorio se acordará entre las partes con anticipación al evento. LA ARTISTA incluye micrófono profesional inalámbrico y se acopla al sonido del lugar.
        </p>

        <p style={cl}>
          {b("CUARTA — VALOR Y FORMA DE PAGO. ")} El valor total del servicio es de {b(fmtCOP(valor))}. EL/LA CLIENTE reserva la fecha mediante un abono del {b(pct + "%")}, equivalente a {b(fmtCOP(reserva))}, y cancela el saldo restante de {b(fmtCOP(saldo))} el día del evento, antes de la presentación.
        </p>

        <p style={cl}>
          {b("QUINTA — RESERVA DE LA FECHA. ")} El abono asegura y bloquea la fecha en la agenda de LA ARTISTA, quien no aceptará otros compromisos para ese día. Por esta razón, el abono {b("no es reembolsable")}.
        </p>

        <p style={cl}>
          {b("SEXTA — CANCELACIÓN. ")} Si EL/LA CLIENTE cancela el evento, el abono no será reembolsado, pues cubre la fecha reservada. Si LA ARTISTA no pudiera presentarse por motivos de fuerza mayor, reembolsará la totalidad del abono o reprogramará la fecha, según acuerdo entre las partes.
        </p>

        <p style={cl}>
          {b("SÉPTIMA — REQUISITOS DEL LUGAR. ")} EL/LA CLIENTE garantiza el acceso al lugar del evento, un punto de energía eléctrica y un espacio adecuado para la presentación.
        </p>

        <p style={cl}>
          {b("OCTAVA — USO DE IMAGEN. ")} EL/LA CLIENTE autoriza a LA ARTISTA a captar fotografías y videos durante el evento para su uso en portafolio y redes sociales. Si no lo autoriza, deberá indicarlo por escrito.
        </p>

        <p style={cl}>
          {b("NOVENA — ACUERDO. ")} El presente documento constituye el acuerdo total entre las partes y refleja lo pactado para la prestación del servicio descrito.
        </p>

        <p style={{ ...cl, marginTop: "22px" }}>
          En constancia de lo anterior, las partes firman en {b(orBlank(f.ciudad, 12))}, a los {b(firmaDia)} días del mes de {b(firmaMes)} de {b(firmaAnio)}.
        </p>

        {/* Signatures */}
        <div style={{ display: "flex", gap: "40px", marginTop: "48px", flexWrap: "wrap" }}>
          {[
            { role: "LA ARTISTA", name: f.artistaNombre || "Meli Rox", ced: f.artistaCedula, signed: true },
            { role: "EL/LA CLIENTE", name: f.cliente, ced: f.cedula, signed: false },
          ].map((s) => (
            <div key={s.role} style={{ flex: "1 1 220px" }}>
              {/* Signature sits on the line — Meli's is pre-signed in script */}
              <div style={{ height: "52px", display: "flex", alignItems: "flex-end", paddingLeft: "6px", overflow: "hidden" }}>
                {s.signed && <span style={{ fontFamily: "var(--font-signature), cursive", fontSize: "38px", lineHeight: 1, color: "#1c1a15", transform: "translateY(6px)" }}>{s.name}</span>}
              </div>
              <div style={{ borderTop: "1px solid #1c1a15", paddingTop: "8px" }}>
                <div style={{ fontFamily: mono, fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#8a7d63" }}>{s.role}</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#000", marginTop: "4px" }}>{orBlank(s.name, 20)}</div>
                <div style={{ fontSize: "13px", color: "#555", marginTop: "2px" }}>C.C. {s.ced.trim() ? s.ced : "________________"}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px", fontFamily: mono, fontSize: "10px", letterSpacing: ".16em", textTransform: "uppercase", color: "#a99a7c" }}>
          Meli Rox · +57 304 550 2154 · melirox.com
        </div>
      </div>
    </main>
  );
}
