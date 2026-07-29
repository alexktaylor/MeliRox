import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Lead, EstadoLead } from "./leads";
import { normalizarEstado } from "./leads";

export class DbNoConfigurada extends Error {
  constructor() {
    super("DATABASE_URL no está configurada — conecta una base Postgres en Vercel.");
    this.name = "DbNoConfigurada";
  }
}

const CONEXION =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  "";

export function dbConfigurada() {
  return CONEXION.length > 0;
}

function getSql() {
  if (!CONEXION) throw new DbNoConfigurada();
  return neon(CONEXION);
}

// El schema se crea una sola vez por instancia del servidor.
let listo: Promise<void> | null = null;
async function asegurarListo() {
  if (!listo) listo = init();
  return listo;
}

async function init() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS leads_meli (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre text NOT NULL,
      telefono text,
      email text,
      fuente text,
      tipo_evento text,
      formato text,
      fecha_contacto text,
      fecha_evento text,
      ciudad text,
      lugar text,
      valor numeric,
      valor_cerrado numeric,
      abono numeric,
      seguimiento text,
      estado text NOT NULL DEFAULT 'nuevo',
      google_win boolean NOT NULL DEFAULT false,
      notas text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS ajustes_meli (
      clave text PRIMARY KEY,
      valor text,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  // Los eventos próximos se consultan seguido; el índice mantiene la carga barata
  // cuando la lista crezca.
  await sql`CREATE INDEX IF NOT EXISTS leads_meli_evento_idx ON leads_meli (fecha_evento)`;
}

interface FilaLead {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  fuente: string | null;
  tipo_evento: string | null;
  formato: string | null;
  fecha_contacto: string | null;
  fecha_evento: string | null;
  ciudad: string | null;
  lugar: string | null;
  valor: string | null;
  valor_cerrado: string | null;
  abono: string | null;
  seguimiento: string | null;
  estado: string;
  google_win: boolean;
  notas: string | null;
}

// numeric de Postgres llega como string por el driver — se convierte acá.
const num = (v: string | null) => (v == null ? null : Number(v));

function mapear(r: FilaLead): Lead {
  return {
    id: r.id,
    nombre: r.nombre,
    telefono: r.telefono,
    email: r.email,
    fuente: r.fuente,
    tipo_evento: r.tipo_evento,
    formato: r.formato,
    fecha_contacto: r.fecha_contacto,
    fecha_evento: r.fecha_evento,
    ciudad: r.ciudad,
    lugar: r.lugar,
    valor: num(r.valor),
    valor_cerrado: num(r.valor_cerrado),
    abono: num(r.abono),
    seguimiento: r.seguimiento,
    estado: normalizarEstado(r.estado),
    google_win: r.google_win,
    notas: r.notas,
  };
}

export interface LeadInput {
  nombre: string;
  telefono: string | null;
  email: string | null;
  fuente: string | null;
  tipo_evento: string | null;
  formato: string | null;
  fecha_contacto: string | null;
  fecha_evento: string | null;
  ciudad: string | null;
  lugar: string | null;
  valor: number | null;
  valor_cerrado: number | null;
  abono: number | null;
  seguimiento: string | null;
  estado: EstadoLead;
  google_win: boolean;
  notas: string | null;
}

export async function getLeads(): Promise<Lead[]> {
  await asegurarListo();
  const sql = getSql();
  const filas = (await sql`
    SELECT * FROM leads_meli
    ORDER BY
      -- Primero lo que tiene evento próximo, luego los más recientes.
      CASE WHEN estado IN ('nuevo','cotizado','quizas') THEN 0 ELSE 1 END,
      fecha_contacto DESC NULLS LAST,
      created_at DESC
  `) as FilaLead[];
  return filas.map(mapear);
}

export async function crearLead(i: LeadInput): Promise<void> {
  await asegurarListo();
  const sql = getSql();
  await sql`
    INSERT INTO leads_meli
      (nombre, telefono, email, fuente, tipo_evento, formato, fecha_contacto, fecha_evento,
       ciudad, lugar, valor, valor_cerrado, abono, seguimiento, estado, google_win, notas)
    VALUES
      (${i.nombre}, ${i.telefono}, ${i.email}, ${i.fuente}, ${i.tipo_evento}, ${i.formato},
       ${i.fecha_contacto}, ${i.fecha_evento}, ${i.ciudad}, ${i.lugar}, ${i.valor},
       ${i.valor_cerrado}, ${i.abono}, ${i.seguimiento}, ${i.estado}, ${i.google_win}, ${i.notas})
  `;
}

export async function actualizarLead(id: string, i: LeadInput): Promise<void> {
  await asegurarListo();
  const sql = getSql();
  await sql`
    UPDATE leads_meli SET
      nombre = ${i.nombre},
      telefono = ${i.telefono},
      email = ${i.email},
      fuente = ${i.fuente},
      tipo_evento = ${i.tipo_evento},
      formato = ${i.formato},
      fecha_contacto = ${i.fecha_contacto},
      fecha_evento = ${i.fecha_evento},
      ciudad = ${i.ciudad},
      lugar = ${i.lugar},
      valor = ${i.valor},
      valor_cerrado = ${i.valor_cerrado},
      abono = ${i.abono},
      seguimiento = ${i.seguimiento},
      estado = ${i.estado},
      google_win = ${i.google_win},
      notas = ${i.notas},
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function borrarLead(id: string): Promise<void> {
  await asegurarListo();
  const sql = getSql();
  await sql`DELETE FROM leads_meli WHERE id = ${id}`;
}

/* ============================================================
   AJUSTES (clave/valor)
   ============================================================ */

async function getAjuste(clave: string): Promise<string | null> {
  await asegurarListo();
  const sql = getSql();
  const filas = await sql`SELECT valor FROM ajustes_meli WHERE clave = ${clave}`;
  return (filas[0]?.valor as string | undefined) ?? null;
}

async function setAjuste(clave: string, valor: string): Promise<void> {
  await asegurarListo();
  const sql = getSql();
  await sql`
    INSERT INTO ajustes_meli (clave, valor) VALUES (${clave}, ${valor})
    ON CONFLICT (clave) DO UPDATE SET valor = ${valor}, updated_at = now()
  `;
}

export interface GastoAds {
  total: number;
  /** Cuándo se actualizó por última vez (ISO), null si nunca. */
  actualizado: string | null;
}

/**
 * Gasto total de Google Ads — el número tal cual lo muestra Google.
 * Se sobrescribe completo en cada guardado; no se acumula nada.
 */
export async function getGastoAds(): Promise<GastoAds> {
  await asegurarListo();
  const sql = getSql();
  const filas = (await sql`
    SELECT valor, updated_at FROM ajustes_meli WHERE clave = 'gasto_ads'
  `) as { valor: string | null; updated_at: string | Date | null }[];
  const fila = filas[0];
  const n = fila?.valor == null ? NaN : Number(fila.valor);
  return {
    total: Number.isFinite(n) ? n : 0,
    // El driver puede devolver timestamptz como Date o como string según la versión;
    // se normaliza a ISO acá para que cruce al cliente siempre igual.
    actualizado: aISO(fila?.updated_at),
  };
}

function aISO(v: string | Date | null | undefined): string | null {
  if (v == null) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function setGastoAds(total: number): Promise<void> {
  await setAjuste("gasto_ads", String(total));
}
