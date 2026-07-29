"use client";

import { useEffect, useState } from "react";
import { descargarPdf } from "../../components/descargarPdf";

const GOLD = "#b98f4e";
const serif = "var(--font-cormorant), serif";
const mono = "var(--font-mono), monospace";
const F = "/uploads/drive-download-20260714T181149Z-1-001/";
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const fmtCOP = (n: number) => (isFinite(n) && n > 0 ? "$" + n.toLocaleString("es-CO") : "$__________");
const orBlank = (s: string, w = 20) => (s.trim() ? s : "_".repeat(w));
const longDate = (iso: string) => {
  const [y, m, d] = (iso || "").split("-").map((n) => parseInt(n, 10));
  return y && m && d ? `${d} de ${MESES[m - 1]} de ${y}` : "";
};

// Datos de pago fijos de Meli
const PAGO = {
  banco: "Bancolombia",
  tipo: "Ahorros",
  numero: "31100043621",
  titular: "Melissa Gaviria Correa",
};

type Musico = { nombre: string; instrumento: string; credencial: string };

export default function Empresarial() {
  const [f, setF] = useState({
    cliente: "",
    empresa: "",
    evento: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    mostrarHoras: true,
    duracion: "8 horas",
    formato: "Trío de cuerdas — 2 violines y viola",
    lugar: "",
    ciudad: "Medellín",
    intro: "agradecemos su interés. A continuación presentamos la propuesta para la presentación musical en vivo, a cargo de músicos profesionales con formación académica y amplia experiencia en escenarios y eventos.",
    descansos: "Sets de 45 minutos con descansos intermedios, coordinados con la organización del evento.",
    valor: "5000000",
    usarDescuento: false,
    valorDescuento: "",
    reservaPct: "30",
    validoHasta: "",
    fechaPropuesta: "",
    notas: "",
  });
  const [pdfEstado, setPdfEstado] = useState<"" | "generando" | "error">("");
  const [musicos, setMusicos] = useState<Musico[]>([
    { nombre: "Meli Rox", instrumento: "Violín", credencial: "Cantautora y violinista · +10 años en escena · Presencia en TV nacional" },
    { nombre: "", instrumento: "Violín", credencial: "Egresado(a) de la Universidad de Antioquia · +10 años de experiencia" },
    { nombre: "", instrumento: "Viola", credencial: "Egresado(a) de la Universidad de Antioquia · +10 años de experiencia" },
  ]);

  const set = (k: string, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));
  const setM = (i: number, k: keyof Musico, v: string) =>
    setMusicos((p) => p.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)));

  // Default proposal date = today; validity = +15 days. Payment details persist locally.
  useEffect(() => {
    const d = new Date();
    const iso = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    const v = new Date(d.getTime() + 15 * 86400000);
    setF((p) => ({ ...p, fechaPropuesta: iso(d), validoHasta: iso(v) }));
  }, []);


  const valor = parseInt(f.valor.replace(/[^\d]/g, ""), 10) || 0;
  const valorDesc = parseInt(f.valorDescuento.replace(/[^\d]/g, ""), 10) || 0;
  const finalVal = f.usarDescuento && valorDesc > 0 ? valorDesc : valor;
  const deGrupo = musicos.length > 1 ? "del ensamble" : "de la artista";
  const pct = Math.min(100, Math.max(0, parseInt(f.reservaPct.replace(/[^\d]/g, ""), 10) || 0));
  const reserva = Math.round((finalVal * pct) / 100);
  const saldo = finalVal - reserva;

  const input: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0a0908", border: "1px solid rgba(212,180,122,.35)", borderRadius: "7px", padding: "10px 12px", color: "#f4edda", fontFamily: mono, fontSize: "13.5px", outline: "none" };
  const label: React.CSSProperties = { fontFamily: mono, fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", color: "#a99a7c", display: "block", marginBottom: "6px" };
  const field = (l: string, k: keyof typeof f, ph = "", basis = "1 1 100%") => (
    <div style={{ flex: basis }}>
      <label style={label}>{l}</label>
      <input value={String(f[k])} onChange={(e) => set(k, e.target.value)} placeholder={ph} style={input} />
    </div>
  );
  const dateField = (l: string, k: keyof typeof f) => (
    <div style={{ flex: "1 1 160px" }}>
      <label style={label}>{l}</label>
      <input type="date" value={String(f[k])} onChange={(e) => set(k, e.target.value)} style={input} />
    </div>
  );

  // Document styles
  const h3: React.CSSProperties = { fontFamily: mono, fontSize: "10px", letterSpacing: ".26em", textTransform: "uppercase", color: GOLD, margin: "0 0 12px", paddingBottom: "6px", borderBottom: "1px solid rgba(185,143,78,.35)" };
  const sec: React.CSSProperties = { marginTop: "30px" };
  const rowLbl: React.CSSProperties = { fontFamily: mono, fontSize: "9.5px", letterSpacing: ".16em", textTransform: "uppercase", color: "#8a7d63" };
  const rowVal: React.CSSProperties = { fontSize: "15px", color: "#000", fontWeight: 600, marginTop: "3px" };
  const body: React.CSSProperties = { fontSize: "13.5px", lineHeight: 1.75, color: "#3a352c", margin: 0 };

  const dataRow = (l: string, v: string) => (
    <div style={{ flex: "1 1 150px", minWidth: "140px" }}>
      <div style={rowLbl}>{l}</div>
      <div style={rowVal}>{v}</div>
    </div>
  );

  return (
    <main style={{ background: "#0b0a08", minHeight: "100vh", padding: "clamp(20px,4vw,48px) clamp(14px,4vw,40px)" }}>
      <style>{`@media print {
        .no-print { display: none !important; }
        .paper { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
        main { background: #fff !important; padding: 0 !important; }
        .page-break { break-before: page; }
        .avoid-break { break-inside: avoid; }
        @page { margin: 16mm 14mm; }
      }`}</style>

      {/* ---------- EDITOR ---------- */}
      <div className="no-print" style={{ maxWidth: "860px", margin: "0 auto 28px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/uploads/meli-rox-logo-clean-print-transparent.webp" alt="Meli Rox" style={{ height: "56px", width: "auto", margin: "-12px 0 2px -8px" }} />
        <h1 style={{ margin: "6px 0 4px", fontFamily: serif, fontWeight: 300, fontSize: "clamp(26px,5vw,36px)", color: "#f4edda" }}>Propuesta <em style={{ fontStyle: "italic", color: "#ecd9ac" }}>empresarial</em></h1>
        <p style={{ margin: "0 0 22px", fontWeight: 300, fontSize: "14px", color: "#a99a7c" }}>Llena los datos, revisa el documento abajo y toca <strong style={{ color: "#ecd9ac" }}>Imprimir / Guardar PDF</strong> para enviarlo.</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "13px" }}>
          {field("Cliente / contacto", "cliente", "Ej: Kadoma", "1 1 220px")}
          {field("Empresa (opcional)", "empresa", "Ej: Kadoma S.A.S.", "1 1 220px")}
          {field("Evento", "evento", "Ej: Jornada de formación empresarial", "1 1 100%")}
          {dateField("Fecha del evento", "fecha")}
          {field("Duración", "duracion", "8 horas", "1 1 140px")}
          {field("Lugar", "lugar", "Ej: Hotel · El Poblado", "1 1 200px")}
          {field("Ciudad", "ciudad", "Medellín", "1 1 140px")}
          {field("Formato", "formato", "Trío de cuerdas — 2 violines y viola", "1 1 100%")}
        </div>

        {/* Times toggle */}
        <div style={{ marginTop: "14px", display: "flex", gap: "13px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", color: "#d9ccae", cursor: "pointer", flex: "1 1 100%" }}>
            <input type="checkbox" checked={f.mostrarHoras} onChange={(e) => set("mostrarHoras", e.target.checked)} style={{ width: "17px", height: "17px", accentColor: "#b98f4e" }} />
            Incluir horas de inicio y fin <span style={{ color: "#8a7d63" }}>(desactiva si aún están por confirmar)</span>
          </label>
          {f.mostrarHoras && field("Hora inicio", "horaInicio", "Ej: 8:00 am", "1 1 150px")}
          {f.mostrarHoras && field("Hora fin", "horaFin", "Ej: 4:00 pm", "1 1 150px")}
        </div>

        <div style={{ marginTop: "13px" }}>
          <label style={label}>Descripción / presentación <span style={{ textTransform: "none", letterSpacing: 0, color: "#8a7d63" }}>— va después de “Estimado(a) [cliente]:”</span></label>
          <textarea value={f.intro} onChange={(e) => set("intro", e.target.value)} rows={4} style={{ ...input, fontFamily: "inherit", fontSize: "13.5px", resize: "vertical", lineHeight: 1.6 }} />
        </div>

        <div style={{ marginTop: "13px" }}>
          <label style={label}>Descansos / dinámica de la jornada</label>
          <textarea value={f.descansos} onChange={(e) => set("descansos", e.target.value)} rows={2} style={{ ...input, fontFamily: "inherit", fontSize: "13.5px", resize: "vertical" }} />
        </div>

        {/* Musicians */}
        <div style={{ marginTop: "24px", borderTop: "1px solid rgba(212,180,122,.2)", paddingTop: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ fontFamily: mono, fontSize: "11px", letterSpacing: ".22em", textTransform: "uppercase", color: "#ecd9ac" }}>Los músicos</div>
            <button onClick={() => setMusicos((p) => [...p, { nombre: "", instrumento: "", credencial: "" }])} style={{ cursor: "pointer", background: "rgba(212,180,122,.12)", border: "1px solid rgba(212,180,122,.45)", color: "#ecd9ac", borderRadius: "999px", padding: "8px 15px", fontFamily: mono, fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase" }}>+ Añadir músico</button>
          </div>
          {musicos.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px", alignItems: "flex-end", background: "#0d0b09", border: "1px solid rgba(212,180,122,.16)", borderRadius: "8px", padding: "12px" }}>
              <div style={{ flex: "1 1 150px" }}>
                <label style={label}>Nombre</label>
                <input value={m.nombre} onChange={(e) => setM(i, "nombre", e.target.value)} placeholder="Nombre del músico" style={input} />
              </div>
              <div style={{ flex: "1 1 110px" }}>
                <label style={label}>Instrumento</label>
                <input value={m.instrumento} onChange={(e) => setM(i, "instrumento", e.target.value)} placeholder="Violín / Viola" style={input} />
              </div>
              <div style={{ flex: "2 1 240px" }}>
                <label style={label}>Título / credencial</label>
                <input value={m.credencial} onChange={(e) => setM(i, "credencial", e.target.value)} placeholder="Egresado(a) U. de Antioquia · +10 años" style={input} />
              </div>
              {musicos.length > 1 && (
                <button onClick={() => setMusicos((p) => p.filter((_, idx) => idx !== i))} aria-label="Quitar" style={{ cursor: "pointer", background: "none", border: "1px solid rgba(212,180,122,.3)", color: "#a99a7c", borderRadius: "8px", width: "38px", height: "38px", fontSize: "16px" }}>×</button>
              )}
            </div>
          ))}
        </div>

        {/* Money */}
        <div style={{ marginTop: "22px", borderTop: "1px solid rgba(212,180,122,.2)", paddingTop: "18px", display: "flex", gap: "13px", flexWrap: "wrap" }}>
          {field("Valor total (COP)", "valor", "Ej: 5000000", "1 1 170px")}
          {field("% de reserva", "reservaPct", "30", "1 1 110px")}
          {dateField("Propuesta válida hasta", "validoHasta")}
          {dateField("Fecha de la propuesta", "fechaPropuesta")}
          <label style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "13px", color: "#d9ccae", cursor: "pointer", flex: "1 1 100%" }}>
            <input type="checkbox" checked={f.usarDescuento} onChange={(e) => set("usarDescuento", e.target.checked)} style={{ width: "17px", height: "17px", accentColor: "#b98f4e" }} />
            Ofrecer precio especial <span style={{ color: "#8a7d63" }}>(deja desactivado para no dar descuento)</span>
          </label>
          {f.usarDescuento && field("Precio especial (COP)", "valorDescuento", "Ej: 4500000", "1 1 200px")}
        </div>

        <div style={{ marginTop: "13px" }}>
          <label style={label}>Notas adicionales (opcional)</label>
          <textarea value={f.notas} onChange={(e) => set("notas", e.target.value)} rows={2} placeholder="Cualquier detalle acordado con el cliente…" style={{ ...input, fontFamily: "inherit", fontSize: "13.5px", resize: "vertical" }} />
        </div>

        <div style={{ marginTop: "22px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            disabled={pdfEstado === "generando"}
            onClick={async () => {
              setPdfEstado("generando");
              try {
                await descargarPdf(`Propuesta ${f.empresa.trim() || f.cliente.trim() || "Meli Rox"}`);
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

      {/* ---------- THE DOCUMENT ---------- */}
      <div className="paper" style={{ maxWidth: "860px", margin: "0 auto", background: "#fff", color: "#1c1a15", borderRadius: "6px", boxShadow: "0 20px 70px rgba(0,0,0,.5)", padding: "clamp(28px,5vw,58px)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px", borderBottom: "2px solid " + GOLD, paddingBottom: "18px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: serif, fontSize: "32px", fontWeight: 600, color: GOLD, lineHeight: 1 }}>Meli Rox</div>
            <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".26em", textTransform: "uppercase", color: "#8a7d63", marginTop: "5px" }}>Música en vivo · Medellín</div>
          </div>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#5a5346", lineHeight: 1.7 }}>
            <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".2em", textTransform: "uppercase", color: GOLD }}>Propuesta empresarial · Servicios musicales</div>
            {(f.empresa.trim() || f.cliente.trim()) && (
              <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#000", marginTop: "6px" }}>Preparada para {f.empresa.trim() || f.cliente.trim()}</div>
            )}
            {longDate(f.fechaPropuesta) && <div style={{ marginTop: "4px" }}>{longDate(f.fechaPropuesta)}</div>}
            {longDate(f.validoHasta) && <div>Válida hasta el {longDate(f.validoHasta)}</div>}
          </div>
        </div>

        {/* Intro + photo */}
        <div style={{ display: "flex", gap: "26px", marginTop: "28px", flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ margin: "0 0 12px", fontFamily: serif, fontWeight: 400, fontSize: "26px", color: "#000", lineHeight: 1.25 }}>
              Música en vivo{f.evento.trim() ? <> para <em style={{ fontStyle: "italic", color: GOLD }}>{f.evento}</em></> : null}
            </h2>
            <p style={{ ...body, whiteSpace: "pre-wrap" }}>
              <strong style={{ color: "#000", fontWeight: 600 }}>Estimado(a) {orBlank(f.cliente, 14)}{f.empresa.trim() ? ` — ${f.empresa}` : ""}:</strong> {f.intro}
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={F + "wedding.webp"} alt="Meli Rox — violinista" style={{ flex: "0 0 190px", width: "190px", height: "240px", objectFit: "cover", objectPosition: "50% 25%", borderRadius: "4px", border: "1px solid rgba(185,143,78,.4)" }} />
        </div>

        {/* Event details */}
        <div style={sec}>
          <div style={h3}>El evento</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 14px" }}>
            {dataRow("Evento", f.evento.trim() || "Por confirmar")}
            {dataRow("Fecha", longDate(f.fecha) || "Por confirmar")}
            {f.mostrarHoras && dataRow("Horario", f.horaInicio.trim() || f.horaFin.trim() ? `${f.horaInicio.trim() || "—"} — ${f.horaFin.trim() || "—"}` : "Por confirmar")}
            {dataRow("Duración", f.duracion.trim() || "Por confirmar")}
            {dataRow("Lugar", f.lugar.trim() || "Por confirmar")}
            {f.lugar.trim().toLowerCase() !== f.ciudad.trim().toLowerCase() && dataRow("Ciudad", f.ciudad.trim() || "Por confirmar")}
          </div>
          {f.descansos.trim() && <p style={{ ...body, marginTop: "16px", fontStyle: "italic", color: "#5a5346" }}>{f.descansos}</p>}
        </div>

        {/* Format */}
        <div style={sec}>
          <div style={h3}>El formato</div>
          <div style={{ fontFamily: serif, fontSize: "22px", color: "#000", fontWeight: 400 }}>{orBlank(f.formato, 24)}</div>
        </div>

        {/* Musicians */}
        <div className="avoid-break" style={sec}>
          <div style={h3}>Los músicos</div>
          <div style={{ display: "grid", gap: "12px" }}>
            {musicos.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "baseline", borderLeft: "2px solid " + GOLD, paddingLeft: "14px" }}>
                <div style={{ fontFamily: mono, fontSize: "10px", color: "#a99a7c", minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#000" }}>
                    {orBlank(m.nombre, 18)}
                    {m.instrumento.trim() && <span style={{ fontWeight: 400, color: GOLD, fontFamily: serif, fontSize: "17px", fontStyle: "italic" }}> · {m.instrumento}</span>}
                  </div>
                  {m.credencial.trim() && <div style={{ fontSize: "12.5px", color: "#5a5346", marginTop: "2px", lineHeight: 1.6 }}>{m.credencial}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div style={sec}>
          <div style={h3}>Qué incluye</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "14px 22px" }}>
            {[
              ["Repertorio a la medida", "Selección acordada con la organización según el tono del evento."],
              ["Músicos profesionales", "Formación académica, experiencia en escena y presentación formal."],
              ["Sonido propio", "Micrófonos y amplificación profesional; nos acoplamos al sonido del lugar."],
              ["Coordinación previa", "Cronograma, montaje y prueba de sonido coordinados con su equipo."],
            ].map(([t, d]) => (
              <div key={t}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#000" }}>{t}</div>
                <div style={{ fontSize: "12.5px", color: "#5a5346", lineHeight: 1.65, marginTop: "3px" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment */}
        <div className="avoid-break" style={{ ...sec, background: "#faf7f1", border: "1px solid rgba(185,143,78,.35)", borderRadius: "6px", padding: "24px 26px" }}>
          <div style={{ ...h3, borderBottom: "none", paddingBottom: 0, marginBottom: "14px" }}>La inversión</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", flexWrap: "wrap" }}>
            {f.usarDescuento && valorDesc > 0 && (
              <div style={{ fontFamily: serif, fontSize: "22px", fontStyle: "italic", color: "#8a7d63", textDecoration: "line-through" }}>{fmtCOP(valor)}</div>
            )}
            <div>
              <div style={{ fontFamily: serif, fontSize: "44px", lineHeight: 1, color: "#000", fontWeight: 500 }}>{fmtCOP(finalVal)}</div>
              <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".2em", textTransform: "uppercase", color: "#8a7d63", marginTop: "5px" }}>
                COP · Total {musicos.length > 1 ? `por el ensamble (${musicos.length} músicos)` : "por la presentación"} · {f.duracion.trim() || "duración a confirmar"}
              </div>
            </div>
          </div>
          <div style={{ marginTop: "18px", paddingTop: "16px", borderTop: "1px solid rgba(185,143,78,.3)", display: "flex", gap: "26px", flexWrap: "wrap" }}>
            {dataRow(`Reserva (${pct}%)`, fmtCOP(reserva))}
            {dataRow("Saldo el día del evento", fmtCOP(saldo))}
          </div>
          <p style={{ ...body, marginTop: "14px", fontSize: "12.5px" }}>
            La reserva asegura y bloquea la fecha en la agenda {deGrupo}. El saldo se cancela el día del evento, antes de la presentación.
          </p>
        </div>

        {/* Conditions */}
        <div style={sec}>
          <div style={h3}>Condiciones</div>
          <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", lineHeight: 1.8, color: "#3a352c" }}>
            <li>El abono de reserva no es reembolsable, ya que bloquea la fecha para otros compromisos.</li>
            <li>El cliente garantiza acceso al lugar, punto de energía eléctrica y un espacio cubierto y adecuado para la presentación.</li>
            <li>Para jornadas extensas se acuerdan descansos y, si aplica, hidratación y alimentación para los músicos.</li>
            <li>Cambios de fecha están sujetos a disponibilidad {deGrupo}.</li>
            <li>Esta propuesta es válida hasta la fecha indicada; después podrá requerir nueva cotización.</li>
          </ul>
          {f.notas.trim() && <p style={{ ...body, marginTop: "14px" }}><strong style={{ color: "#000" }}>Notas: </strong>{f.notas}</p>}
        </div>

        {/* Payment details — fijos */}
        <div className="avoid-break" style={sec}>
          <div style={h3}>Datos de pago</div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uploads/bancolombia.webp" alt="Bancolombia" style={{ height: "38px", width: "auto", flex: "0 0 auto" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px 14px", flex: "1 1 300px" }}>
              {dataRow("Tipo de cuenta", PAGO.tipo)}
              {dataRow("Número de cuenta", PAGO.numero)}
              {dataRow("Titular", PAGO.titular)}
            </div>
          </div>
          <p style={{ ...body, marginTop: "14px", fontSize: "12.5px" }}>
            Por favor enviar el comprobante de la transferencia al WhatsApp +57 304 550 2154 para confirmar la reserva de la fecha.
          </p>
        </div>

        {/* Sign-off */}
        <div className="avoid-break" style={{ marginTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "var(--font-signature), cursive", fontSize: "38px", color: "#1c1a15", lineHeight: 1 }}>Meli Rox</div>
            <div style={{ borderTop: "1px solid #1c1a15", marginTop: "6px", paddingTop: "6px", fontSize: "12.5px", color: "#5a5346" }}>
              Meli Rox · Dirección artística<br />+57 304 550 2154 · melirox.com
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "12.5px", color: "#5a5346", lineHeight: 1.7 }}>
            <div style={{ fontFamily: mono, fontSize: "9.5px", letterSpacing: ".2em", textTransform: "uppercase", color: GOLD }}>Para confirmar</div>
            <div style={{ marginTop: "4px" }}>Responda a este documento o escríbanos<br />por WhatsApp al +57 304 550 2154.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
