"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  type Lead,
  type EstadoLead,
  type Orden,
  ESTADOS,
  ORDENES,
  ordenarLeads,
  totalProyecto,
  faltaPorCobrar,
  tieneAbono,
  formatCOP,
  formatCOPCorto,
  formatFecha,
  fechaColombia,
  hoyISO,
  estadoLabel,
  diasHasta,
  textoCuenta,
  formatSello,
  waLink,
  saludoWA,
  agruparDigitos,
} from "@/app/lib/panel/leads";
import { salir } from "@/app/actions/panel-auth";
import { guardarGastoAction } from "@/app/actions/panel-leads";
import type { Resumen } from "./page";
import LeadSheet from "./LeadSheet";
import { IconoWA } from "./IconoWA";

type FiltroEstado = "todos" | EstadoLead;

export default function Panel({
  leads,
  resumen,
}: {
  leads: Lead[];
  resumen: Resumen;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos");
  const [filtroFuente, setFiltroFuente] = useState("todas");
  const [orden, setOrden] = useState<Orden>("recientes");
  const [editando, setEditando] = useState<Lead | null>(null);
  const [creando, setCreando] = useState(false);

  const fuentes = useMemo(() => {
    const set = new Set<string>();
    for (const l of leads) if (l.fuente) set.add(l.fuente);
    return Array.from(set).sort();
  }, [leads]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const visibles = leads.filter((l) => {
      if (filtroEstado !== "todos" && l.estado !== filtroEstado) return false;
      if (filtroFuente !== "todas" && (l.fuente ?? "") !== filtroFuente) return false;
      if (!q) return true;
      const heno = [
        l.nombre, l.telefono, l.email, l.tipo_evento, l.formato,
        l.ciudad, l.lugar, l.fuente, l.notas,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return heno.includes(q);
    });
    return ordenarLeads(visibles, orden);
  }, [leads, busqueda, filtroEstado, filtroFuente, orden]);

  const conteos = useMemo(() => {
    const c: Record<string, number> = { todos: leads.length };
    for (const e of ESTADOS) c[e.value] = 0;
    for (const l of leads) c[l.estado] = (c[l.estado] ?? 0) + 1;
    return c;
  }, [leads]);

  return (
    <>
      <header className="mp-header">
        <div className="mp-brand">
          <span className="mp-mark">MR</span>
          <div>
            <h1>Mis leads</h1>
            <span className="eyebrow">Meli Rox</span>
          </div>
        </div>
        <div className="mp-acciones">
          <Link href="/panel/herramientas" className="mp-salir mp-herramientas">
            Herramientas
          </Link>
          <form action={salir}>
            <button type="submit" className="mp-salir">Salir</button>
          </form>
        </div>
      </header>

      <section className="stat-scroll" aria-label="Resumen">
        <Tarjeta
          label="Confirmado"
          valor={formatCOPCorto(resumen.totalConfirmado)}
          hint={`${resumen.confirmadosCount} evento${resumen.confirmadosCount === 1 ? "" : "s"}`}
          acento="win"
        />
        <Tarjeta
          label="En propuestas"
          valor={formatCOPCorto(resumen.enPropuestas)}
          hint={`${resumen.abiertosCount} sin cerrar`}
        />
        <Tarjeta
          label="Saldo por cobrar"
          valor={formatCOPCorto(resumen.saldoPorCobrar)}
          hint={`${formatCOPCorto(resumen.abonosRecibidos)} en abonos`}
        />
        <Tarjeta
          label="Total cotizado"
          valor={formatCOPCorto(resumen.totalCotizado)}
          hint={`${resumen.totalLeads} lead${resumen.totalLeads === 1 ? "" : "s"}`}
        />
        <Tarjeta
          label="Tasa de cierre"
          valor={resumen.tasaCierre == null ? "—" : Math.round(resumen.tasaCierre * 100) + "%"}
          hint="de los ya decididos"
        />
        <TarjetaProximo resumen={resumen} />
      </section>

      <FilaGoogle resumen={resumen} />

      <div className="mp-toolbar">
        <input
          className="mp-search"
          type="search"
          inputMode="search"
          placeholder="Buscar lead…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="mp-selects">
          <select
            value={filtroFuente}
            onChange={(e) => setFiltroFuente(e.target.value)}
            aria-label="Filtrar por fuente"
          >
            <option value="todas">Toda fuente</option>
            {fuentes.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            aria-label="Ordenar la lista"
          >
            {ORDENES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="chip-row" role="tablist" aria-label="Filtrar por estado">
        <Chip
          label="Todos"
          count={conteos.todos}
          activo={filtroEstado === "todos"}
          onClick={() => setFiltroEstado("todos")}
        />
        {ESTADOS.map((e) => (
          <Chip
            key={e.value}
            label={e.label}
            count={conteos[e.value] ?? 0}
            tono={e.value}
            activo={filtroEstado === e.value}
            onClick={() => setFiltroEstado(e.value)}
          />
        ))}
      </div>

      <div className="lead-list">
        {filtrados.length === 0 && (
          <p className="vacio">
            {leads.length === 0
              ? "Todavía no hay leads. Toca el botón + para agregar el primero."
              : "Ningún lead coincide con el filtro."}
          </p>
        )}
        {filtrados.map((l) => (
          <TarjetaLead key={l.id} lead={l} onAbrir={() => setEditando(l)} />
        ))}
      </div>

      <button className="fab" onClick={() => setCreando(true)} aria-label="Agregar lead">
        <span>+</span>
      </button>

      {(creando || editando) && (
        <LeadSheet
          lead={editando}
          onCerrar={() => {
            setCreando(false);
            setEditando(null);
          }}
        />
      )}
    </>
  );
}

/* ============================================================
   TARJETA DE LEAD
   ============================================================ */

function TarjetaLead({ lead, onAbrir }: { lead: Lead; onAbrir: () => void }) {
  const enlaceWA = waLink(lead.telefono, saludoWA(lead));
  const diasEvento = diasHasta(lead.fecha_evento);
  const diasSeguimiento = diasHasta(lead.seguimiento);
  // El seguimiento se marca cuando es hoy o ya se pasó.
  const seguimientoVence = diasSeguimiento != null && diasSeguimiento <= 0;

  const total = totalProyecto(lead);
  const falta = faltaPorCobrar(lead);
  // Con abono se muestra el desglose completo; sin abono basta el total.
  const desglose = tieneAbono(lead);
  // Fecha de contacto: se autocompleta con hoy al crear el lead, pero es editable
  // (sirve para backdatear leads que llegaron antes de registrarlos). Si por algo
  // falta, caemos al created_at real de la base.
  const agregado = lead.fecha_contacto ?? fechaColombia(lead.created_at);

  return (
    <div className="lead-card">
      <button className="lead-abrir" onClick={onAbrir}>
        {agregado && (
          <div className="lead-agregado">
            {agregado === hoyISO() ? "Agregado hoy" : `Agregado ${formatFecha(agregado)}`}
          </div>
        )}
        <div className="lead-top">
          <span className="lead-nombre">{lead.nombre}</span>
          <span className={`pill pill--${lead.estado}`}>{estadoLabel(lead.estado)}</span>
        </div>

        {(lead.tipo_evento || lead.formato) && (
          <div className="lead-evento">
            {[lead.tipo_evento, lead.formato].filter(Boolean).join(" · ")}
          </div>
        )}

        <div className="lead-meta">
          {lead.fecha_evento && (
            <span className="tag tag--fecha">
              {formatFecha(lead.fecha_evento)}
              {diasEvento != null && diasEvento >= 0 && diasEvento <= 30
                ? ` · ${textoCuenta(diasEvento)}`
                : ""}
            </span>
          )}
          {lead.ciudad && <span className="tag">{lead.ciudad}</span>}
          {lead.fuente && <span className="tag">{lead.fuente}</span>}
          {lead.google_win && <span className="tag tag--google">🏆 Google</span>}
          {seguimientoVence && (
            <span className="tag tag--urgente">
              Seguimiento {textoCuenta(diasSeguimiento).toLowerCase()}
            </span>
          )}
        </div>

        {total != null && (
          <div className="lead-plata">
            <span className="plata-total">
              {formatCOP(total)}
              <em>{lead.valor_cerrado != null ? "Total" : "Cotizado"}</em>
            </span>
            {desglose && (
              <>
                <span className="plata-abono">
                  {formatCOP(lead.abono)}
                  <em>Abonado</em>
                </span>
                <span className={falta === 0 ? "plata-pago" : "plata-falta"}>
                  {falta === 0 ? "Pagado" : formatCOP(falta)}
                  <em>{falta === 0 ? "Completo" : "Falta"}</em>
                </span>
              </>
            )}
          </div>
        )}
      </button>

      {enlaceWA ? (
        <a
          className="lead-wa"
          href={enlaceWA}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir WhatsApp con ${lead.nombre}`}
          // Evita que el toque abra también la ficha de edición.
          onClick={(e) => e.stopPropagation()}
        >
          <IconoWA />
          <span>Chat</span>
        </a>
      ) : (
        <span
          className="lead-wa lead-wa--off"
          title="Este lead no tiene número guardado"
          aria-label="Sin número de WhatsApp"
        >
          <IconoWA />
          <span>Sin nº</span>
        </span>
      )}
    </div>
  );
}

/* ============================================================
   TARJETAS DE RESUMEN
   ============================================================ */

function Tarjeta({
  label,
  valor,
  hint,
  acento,
}: {
  label: string;
  valor: string;
  hint?: string;
  acento?: "win" | "prox";
}) {
  return (
    <div className={`stat-card${acento ? " stat-card--" + acento : ""}`}>
      <span className="stat-value">{valor}</span>
      <span className="stat-label">{label}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}

function TarjetaProximo({ resumen }: { resumen: Resumen }) {
  const p = resumen.proximo;
  return (
    <div className="stat-card stat-card--prox">
      <span className="stat-value">{p ? textoCuenta(p.dias) : "—"}</span>
      <span className="stat-label">{p ? p.nombre : "Próximo evento"}</span>
      <span className="stat-hint">
        {p
          ? `${formatFecha(p.fecha)} · ${resumen.eventosProximos} en agenda`
          : "Sin eventos agendados"}
      </span>
    </div>
  );
}

/**
 * Fila de Google Ads — a lo ancho y siempre visible, porque el gasto se actualiza
 * todos los días. El número se sobrescribe tal cual lo muestra Google: no se suma
 * ni se acumula nada.
 */
function FilaGoogle({ resumen }: { resumen: Resumen }) {
  const [pendiente, iniciar] = useTransition();
  const [gasto, setGasto] = useState(
    resumen.gastoAds ? agruparDigitos(String(resumen.gastoAds)) : ""
  );
  // Se marca guardado sólo hasta que Meli vuelva a tocar el campo.
  const [guardado, setGuardado] = useState(false);

  return (
    <section className="ads-row" aria-label="Google Ads">
      <div className="ads-cifras">
        <div className="ads-roi">
          <span className="ads-roi-val">
            {resumen.roi == null ? "—" : Math.round(resumen.roi * 100) + "%"}
          </span>
          <span className="eyebrow">Retorno Google Ads</span>
        </div>
        <div className="ads-detalle">
          <span>
            Ventas <b>{formatCOPCorto(resumen.ventasGoogle)}</b>
          </span>
          <span className={resumen.neto >= 0 ? "pos" : "neg"}>
            Neto <b>{formatCOPCorto(resumen.neto)}</b>
          </span>
          <span>
            <b>{resumen.leadsGoogle}</b> leads
          </span>
        </div>
      </div>

      <form
        className="ads-form"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData();
          fd.set("gasto", gasto);
          iniciar(async () => {
            await guardarGastoAction(fd);
            setGuardado(true);
          });
        }}
      >
        <label className="eyebrow" htmlFor="ads-gasto">
          Gasto total en Google
        </label>
        <div className="ads-form-fila">
          <div className="monto-input">
            <span>$</span>
            <input
              id="ads-gasto"
              inputMode="numeric"
              placeholder="0"
              value={gasto}
              onChange={(e) => {
                setGasto(agruparDigitos(e.target.value));
                setGuardado(false);
              }}
            />
          </div>
          <button type="submit" disabled={pendiente}>
            {pendiente ? "…" : "Guardar"}
          </button>
        </div>
        <span className="ads-sello">
          {guardado
            ? "✓ Guardado"
            : resumen.gastoActualizado
              ? `Última vez: ${formatSello(resumen.gastoActualizado)}`
              : "Escríbelo como lo muestra Google"}
        </span>
      </form>
    </section>
  );
}

function Chip({
  label,
  count,
  activo,
  tono,
  onClick,
}: {
  label: string;
  count: number;
  activo: boolean;
  tono?: EstadoLead;
  onClick: () => void;
}) {
  return (
    <button
      className={`chip${activo ? " chip--active" : ""}${tono ? " chip--" + tono : ""}`}
      onClick={onClick}
      role="tab"
      aria-selected={activo}
    >
      {label} <span className="chip-count">{count}</span>
    </button>
  );
}
