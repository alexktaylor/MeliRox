"use client";

import { useEffect, useState, useTransition } from "react";
import {
  type Lead,
  type EstadoLead,
  ESTADOS,
  FUENTES,
  TIPOS_EVENTO,
  FORMATOS,
  agruparDigitos,
  hoyISO,
  waLink,
  waDigitos,
  saludoWA,
  formatTelefono,
} from "@/app/lib/panel/leads";
import { guardarLeadAction, borrarLeadAction } from "@/app/actions/panel-leads";
import { IconoWA, IconoTel } from "./IconoWA";

export default function LeadSheet({
  lead,
  onCerrar,
}: {
  lead: Lead | null;
  onCerrar: () => void;
}) {
  const esEdicion = lead != null;
  const [guardando, iniciarGuardado] = useTransition();
  const [borrando, iniciarBorrado] = useTransition();

  // Se mantiene en estado para que los atajos de WhatsApp/llamada usen el número
  // que Meli está escribiendo ahora, no el que estaba guardado.
  const [telefono, setTelefono] = useState(lead?.telefono ?? "");

  // Bloquea el scroll del fondo mientras la hoja está abierta.
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCerrar]);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    iniciarGuardado(async () => {
      await guardarLeadAction(fd);
      onCerrar();
    });
  }

  function borrar() {
    if (!lead) return;
    if (!window.confirm(`¿Borrar a ${lead.nombre}? No se puede deshacer.`)) return;
    const fd = new FormData();
    fd.set("id", lead.id);
    iniciarBorrado(async () => {
      await borrarLeadAction(fd);
      onCerrar();
    });
  }

  const nombreActual = lead?.nombre ?? "";
  const digitos = waDigitos(telefono);
  const enlaceWA = waLink(telefono, saludoWA({ nombre: nombreActual, tipo_evento: lead?.tipo_evento ?? null }));

  return (
    <div
      className="sheet-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="sheet" role="dialog" aria-modal="true" aria-label={esEdicion ? "Editar lead" : "Nuevo lead"}>
        <div className="sheet-grab" />
        <div className="sheet-head">
          <h2>{esEdicion ? "Editar lead" : "Nuevo lead"}</h2>
          <button className="sheet-x" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>

        {esEdicion && enlaceWA && digitos && (
          <div className="sheet-atajos">
            <a className="atajo atajo--wa" href={enlaceWA} target="_blank" rel="noopener noreferrer">
              <IconoWA />
              WhatsApp
            </a>
            <a className="atajo" href={`tel:+${digitos}`}>
              <IconoTel />
              {formatTelefono(telefono)}
            </a>
          </div>
        )}

        <form className="lead-form" onSubmit={enviar}>
          {esEdicion && <input type="hidden" name="id" value={lead.id} />}

          <Campo label="Nombre" full>
            <input
              name="nombre"
              required
              defaultValue={lead?.nombre ?? ""}
              placeholder="Nombre del cliente"
              autoCapitalize="words"
            />
          </Campo>

          <Campo label="WhatsApp">
            <input
              name="telefono"
              type="tel"
              inputMode="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="304 550 2154"
              autoComplete="tel"
            />
            <span className="monto-hint">Si no pones indicativo, se asume +57</span>
          </Campo>

          <Campo label="Correo">
            <input
              name="email"
              type="email"
              inputMode="email"
              defaultValue={lead?.email ?? ""}
              placeholder="opcional"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </Campo>

          <SelectorEstado inicial={lead?.estado ?? "nuevo"} />

          <Campo label="¿De dónde llegó?">
            {/* Sin valor por defecto: un <select> envía siempre lo que muestra, así que
                preseleccionar "Google Ads" marcaba como Google leads que nunca lo fueron
                y le inflaba la atribución a la campaña. */}
            <select name="fuente" defaultValue={lead?.fuente ?? ""}>
              <option value="">Sin especificar</option>
              {conOpcionActual(FUENTES, lead?.fuente).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Campo>

          <div className="form-sep">
            <span className="eyebrow">El evento</span>
          </div>

          <Campo label="Tipo de evento">
            {/* Tampoco se preselecciona: el tipo de evento entra en el saludo de
                WhatsApp, y por defecto "Boda" le escribía "sobre tu boda" a una
                clienta de serenata. */}
            <select name="tipo_evento" defaultValue={lead?.tipo_evento ?? ""}>
              <option value="">Sin especificar</option>
              {conOpcionActual(TIPOS_EVENTO, lead?.tipo_evento).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Formato">
            <select name="formato" defaultValue={lead?.formato ?? ""}>
              <option value="">Sin especificar</option>
              {conOpcionActual(FORMATOS, lead?.formato).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Fecha del evento">
            <input type="date" name="fecha_evento" defaultValue={lead?.fecha_evento ?? ""} />
          </Campo>

          <Campo label="Ciudad">
            <input
              name="ciudad"
              defaultValue={lead?.ciudad ?? ""}
              placeholder="Medellín"
              autoCapitalize="words"
            />
          </Campo>

          <Campo label="Lugar" full>
            <input
              name="lugar"
              defaultValue={lead?.lugar ?? ""}
              placeholder="Finca, hotel, salón…"
            />
          </Campo>

          <div className="form-sep">
            <span className="eyebrow">La plata</span>
          </div>

          <Monto name="valor" label="Cotizado" defaultValue={lead?.valor} />
          <Monto name="valor_cerrado" label="Valor cerrado" defaultValue={lead?.valor_cerrado} />
          <Monto name="abono" label="Abono recibido" defaultValue={lead?.abono} />

          <div className="form-sep">
            <span className="eyebrow">Seguimiento</span>
          </div>

          <Campo label="Primer contacto">
            <input
              type="date"
              name="fecha_contacto"
              defaultValue={lead?.fecha_contacto ?? (esEdicion ? "" : hoyISO())}
            />
          </Campo>

          <Campo label="Volver a escribir">
            <input type="date" name="seguimiento" defaultValue={lead?.seguimiento ?? ""} />
          </Campo>

          <label className="toggle full">
            <input type="checkbox" name="google_win" defaultChecked={lead?.google_win ?? false} />
            <span className="toggle-track"><span className="toggle-dot" /></span>
            <span className="toggle-label">🏆 Este se cerró gracias a Google Ads</span>
          </label>

          <Campo label="Notas" full>
            <textarea
              name="notas"
              rows={3}
              defaultValue={lead?.notas ?? ""}
              placeholder="Canciones que pidió, horarios, con quién habló, por qué se cayó…"
            />
          </Campo>

          <div className="sheet-actions">
            {esEdicion && (
              <button type="button" className="btn-danger" onClick={borrar} disabled={borrando}>
                {borrando ? "Borrando…" : "Borrar"}
              </button>
            )}
            <div className="sheet-actions-right">
              <button type="button" className="btn-ghost" onClick={onCerrar}>Cancelar</button>
              <button type="submit" className="btn-solid" disabled={guardando}>
                {guardando ? "Guardando…" : esEdicion ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Estado como botones a la vista en vez de un menú desplegable: los cinco estados
 * —incluido Perdido— se ven de una y se marcan con un toque. En un desplegable
 * "Perdido" quedaba escondido y no se encontraba.
 */
function SelectorEstado({ inicial }: { inicial: EstadoLead }) {
  const [valor, setValor] = useState<EstadoLead>(inicial);
  return (
    <div className="fld fld--full">
      <label>Estado</label>
      {/* El valor viaja en un hidden porque el formulario se envía con FormData. */}
      <input type="hidden" name="estado" value={valor} />
      <div className="estado-pills" role="radiogroup" aria-label="Estado del lead">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            type="button"
            role="radio"
            aria-checked={valor === e.value}
            className={`estado-pill estado-pill--${e.value}${valor === e.value ? " is-on" : ""}`}
            onClick={() => setValor(e.value)}
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Mantiene visible un valor viejo que ya no esté en la lista de opciones. */
function conOpcionActual(opciones: string[], actual?: string | null): string[] {
  if (actual && !opciones.includes(actual)) return [actual, ...opciones];
  return opciones;
}

function Campo({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`fld${full ? " fld--full" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function Monto({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: number | null;
}) {
  const [val, setVal] = useState(
    defaultValue != null ? agruparDigitos(String(defaultValue)) : ""
  );
  return (
    <div className="fld">
      <label>{label}</label>
      <div className="monto-input">
        <span>$</span>
        <input
          name={name}
          inputMode="numeric"
          value={val}
          onChange={(e) => setVal(agruparDigitos(e.target.value))}
          placeholder="0"
        />
      </div>
    </div>
  );
}
