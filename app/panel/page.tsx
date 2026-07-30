import { exigirAuth } from "@/app/lib/panel/auth";
import { getLeads, getGastoAds, dbConfigurada, type GastoAds } from "@/app/lib/panel/db";
import {
  type Lead,
  diasHasta,
  totalProyecto,
  faltaPorCobrar,
} from "@/app/lib/panel/leads";
import Panel from "./Panel";

export const dynamic = "force-dynamic";

export interface Resumen {
  totalLeads: number;
  /** Suma de todo lo cotizado, sin importar el estado. */
  totalCotizado: number;
  /** Suma de lo cerrado en los confirmados. */
  totalConfirmado: number;
  confirmadosCount: number;
  /** Lo que está en propuestas: cotizado de los leads que siguen abiertos. */
  enPropuestas: number;
  abiertosCount: number;
  /** Anticipos recibidos y saldo pendiente de los eventos confirmados. */
  abonosRecibidos: number;
  saldoPorCobrar: number;
  tasaCierre: number | null;
  /** Próximo evento confirmado (o abierto con fecha) desde hoy. */
  proximo: { nombre: string; fecha: string; dias: number } | null;
  eventosProximos: number;
  /** Ventas atribuidas a Google Ads y retorno sobre el gasto. */
  ventasGoogle: number;
  cierresGoogle: number;
  leadsGoogle: number;
  gastoAds: number;
  gastoActualizado: string | null;
  roi: number | null;
  neto: number;
}

function calcular(leads: Lead[], gasto: GastoAds): Resumen {
  let totalCotizado = 0;
  let totalConfirmado = 0;
  let enPropuestas = 0;
  let confirmadosCount = 0;
  let perdidosCount = 0;
  let abiertosCount = 0;
  let abonosRecibidos = 0;
  let saldoPorCobrar = 0;
  let ventasGoogle = 0;
  let leadsGoogle = 0;
  let cierresGoogle = 0;
  let eventosProximos = 0;

  let proximo: Resumen["proximo"] = null;

  for (const l of leads) {
    totalCotizado += l.valor ?? 0;

    if (l.estado === "confirmado") {
      // Si no alcanzó a escribir el valor cerrado, se asume el cotizado.
      totalConfirmado += totalProyecto(l) ?? 0;
      confirmadosCount++;
      // El retorno de Google sólo cuenta ventas CERRADAS que vinieron de Google.
      if (l.google_win) {
        ventasGoogle += totalProyecto(l) ?? 0;
        cierresGoogle++;
      }
      abonosRecibidos += l.abono ?? 0;
      saldoPorCobrar += faltaPorCobrar(l) ?? 0;
    } else if (l.estado === "perdido") {
      perdidosCount++;
    } else {
      abiertosCount++;
      enPropuestas += l.valor ?? 0;
    }

    if ((l.fuente ?? "").toLowerCase().includes("google")) leadsGoogle++;

    // Próximo evento: el más cercano de aquí en adelante que no esté perdido.
    if (l.fecha_evento && l.estado !== "perdido") {
      const dias = diasHasta(l.fecha_evento);
      if (dias != null && dias >= 0) {
        eventosProximos++;
        if (!proximo || dias < proximo.dias) {
          proximo = { nombre: l.nombre, fecha: l.fecha_evento, dias };
        }
      }
    }
  }

  const decididos = confirmadosCount + perdidosCount;

  return {
    totalLeads: leads.length,
    totalCotizado,
    totalConfirmado,
    confirmadosCount,
    enPropuestas,
    abiertosCount,
    abonosRecibidos,
    saldoPorCobrar,
    tasaCierre: decididos > 0 ? confirmadosCount / decididos : null,
    proximo,
    eventosProximos,
    ventasGoogle,
    cierresGoogle,
    leadsGoogle,
    gastoAds: gasto.total,
    gastoActualizado: gasto.actualizado,
    roi: gasto.total > 0 ? ventasGoogle / gasto.total : null,
    neto: ventasGoogle - gasto.total,
  };
}

export default async function PanelPage() {
  await exigirAuth();

  if (!dbConfigurada()) {
    return (
      <div className="aviso-setup">
        <h1>Falta conectar la base de datos</h1>
        <p>
          El panel ya está publicado, pero todavía no tiene dónde guardar los leads.
          En Vercel:
        </p>
        <ol>
          <li>
            Abre el proyecto → <strong>Storage</strong> → <strong>Create Database</strong> →{" "}
            <strong>Neon (Postgres)</strong>
          </li>
          <li>Conéctalo a este proyecto (queda con el plan gratuito)</li>
          <li>
            Vercel agrega <code>DATABASE_URL</code> solo; vuelve a desplegar y esta
            pantalla desaparece
          </li>
        </ol>
      </div>
    );
  }

  let leads: Lead[] = [];
  let gasto: GastoAds = { total: 0, actualizado: null };
  let error: string | null = null;

  try {
    [leads, gasto] = await Promise.all([getLeads(), getGastoAds()]);
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudo conectar con la base de datos.";
  }

  if (error) {
    return (
      <div className="aviso-setup">
        <h1>Error de base de datos</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <Panel leads={leads} resumen={calcular(leads, gasto)} />;
}
