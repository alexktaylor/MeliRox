// Tipos, constantes y formateadores del panel de Meli.
// Seguro de importar desde servidor y cliente (sin dependencias server-only).

export type EstadoLead = "nuevo" | "cotizado" | "quizas" | "confirmado" | "perdido";

export interface Lead {
  id: string;
  nombre: string;
  telefono: string | null;
  email: string | null;
  fuente: string | null;
  tipo_evento: string | null;
  formato: string | null;
  fecha_contacto: string | null; // ISO 'YYYY-MM-DD' — cuándo llegó el lead
  fecha_evento: string | null; // ISO — cuándo es el evento
  ciudad: string | null;
  lugar: string | null;
  valor: number | null; // cotizado (COP)
  valor_cerrado: number | null; // valor final acordado (COP)
  abono: number | null; // anticipo recibido (COP)
  seguimiento: string | null; // ISO — próximo follow-up
  estado: EstadoLead;
  google_win: boolean;
  notas: string | null;
  created_at?: string;
  updated_at?: string;
}

export const ESTADOS: { value: EstadoLead; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "cotizado", label: "Cotizado" },
  { value: "quizas", label: "Quizás" },
  { value: "confirmado", label: "Confirmado" },
  { value: "perdido", label: "Perdido" },
];

/** Estados que siguen vivos en el embudo (cuentan para "en propuestas"). */
export const ESTADOS_ABIERTOS: EstadoLead[] = ["nuevo", "cotizado", "quizas"];

export const FUENTES = [
  "Google Ads",
  "Instagram",
  "Sitio web",
  "Referido",
  "WhatsApp directo",
  "Otro",
];

export const TIPOS_EVENTO = [
  "Boda",
  "Fiesta de 15",
  "Corporativo",
  "Serenata",
  "Concierto",
  "Evento privado",
  "Otro",
];

export const FORMATOS = [
  "Violín y voz",
  "Solo violín",
  "Violín eléctrico",
  "Ensamble",
  "Violín + DJ",
  "Banda completa",
  "A definir",
];

export function estadoLabel(e: EstadoLead): string {
  return ESTADOS.find((x) => x.value === e)?.label ?? "Nuevo";
}

/* ============================================================
   PLATA POR LEAD — total del proyecto, abono y saldo
   ============================================================ */

/**
 * Total del proyecto: el valor cerrado si ya se acordó, si no el cotizado.
 * Una sola fuente de verdad para la tarjeta, el orden y los totales del resumen.
 */
export function totalProyecto(l: Lead): number | null {
  return l.valor_cerrado ?? l.valor;
}

/** Lo que el cliente todavía debe: total − abono. Nunca negativo. */
export function faltaPorCobrar(l: Lead): number | null {
  const total = totalProyecto(l);
  if (total == null) return null;
  return Math.max(0, total - (l.abono ?? 0));
}

/** ¿Vale la pena mostrar el desglose total / abonado / falta? */
export function tieneAbono(l: Lead): boolean {
  return (l.abono ?? 0) > 0;
}

/* ============================================================
   ORDEN DE LA LISTA
   ============================================================ */

export type Orden =
  | "recientes"
  | "falta"
  | "abono"
  | "total"
  | "evento";

export const ORDENES: { value: Orden; label: string }[] = [
  { value: "recientes", label: "Más recientes" },
  { value: "evento", label: "Evento más próximo" },
  { value: "falta", label: "Falta por cobrar" },
  { value: "abono", label: "Abono recibido" },
  { value: "total", label: "Valor más alto" },
];

/** Los nulos siempre al final, sin importar la dirección del orden. */
function cmpNum(a: number | null, b: number | null, desc = true): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return desc ? b - a : a - b;
}

export function ordenarLeads(leads: Lead[], orden: Orden): Lead[] {
  const copia = [...leads];
  switch (orden) {
    case "falta":
      return copia.sort((a, b) => cmpNum(faltaPorCobrar(a), faltaPorCobrar(b)));
    case "abono":
      return copia.sort((a, b) => cmpNum(a.abono, b.abono));
    case "total":
      return copia.sort((a, b) => cmpNum(totalProyecto(a), totalProyecto(b)));
    case "evento":
      // Los eventos que ya pasaron van al final; entre los futuros, el más cercano primero.
      return copia.sort((a, b) => {
        const da = diasHasta(a.fecha_evento);
        const db = diasHasta(b.fecha_evento);
        const futuro = (d: number | null) => (d != null && d >= 0 ? 0 : 1);
        if (futuro(da) !== futuro(db)) return futuro(da) - futuro(db);
        return cmpNum(da, db, false);
      });
    default:
      // El orden que ya trae la consulta: abiertos primero, luego por fecha de contacto.
      return copia;
  }
}

/** Convierte un texto de estado desconocido en uno válido. */
export function normalizarEstado(raw: string): EstadoLead {
  return ESTADOS.some((e) => e.value === raw) ? (raw as EstadoLead) : "nuevo";
}

/* ============================================================
   DINERO — pesos colombianos, agrupación es-CO ($1.500.000)
   ============================================================ */

export function formatCOP(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return "$" + Math.round(n).toLocaleString("es-CO");
}

/** Versión corta para las tarjetas de resumen: $1,5M · $450K */
export function formatCOPCorto(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.abs(n);
  const signo = n < 0 ? "-" : "";
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    // Se mantiene un decimal hasta 100M: redondear 10,75M a "11M" exagera de más.
    const txt =
      m >= 100 ? String(Math.round(m)) : m.toFixed(1).replace(".", ",").replace(",0", "");
    return `${signo}$${txt}M`;
  }
  if (abs >= 1_000) return `${signo}$${Math.round(abs / 1000)}K`;
  return `${signo}$${Math.round(abs)}`;
}

/* ============================================================
   FECHAS
   ============================================================ */

const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/** "15 jul 2026" desde un ISO 'YYYY-MM-DD' (sin Date, para evitar desfase de zona). */
export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
}

/**
 * Zona horaria fija de Colombia. Todo lo relativo a "hoy" se calcula acá y no con
 * la hora local de quien renderiza: el servidor de Vercel corre en UTC y el
 * navegador de Meli en Medellín, y si cada uno contara los días a su manera React
 * marcaría un error de hidratación (y "faltan N días" podría cambiar solo).
 */
const TZ = "America/Bogota";

/** 'YYYY-MM-DD' de hoy en Colombia — igual en el servidor y en el navegador. */
export function hoyISO(): string {
  // en-CA formatea como YYYY-MM-DD, que es justo lo que necesita <input type="date">.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Días desde hoy hasta una fecha ISO. Negativo = ya pasó.
 * Compara sólo la parte de fecha, así que no depende de la hora del día.
 */
export function diasHasta(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const [hy, hm, hd] = hoyISO().split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(hy, hm - 1, hd)) / 86_400_000);
}

/** "15 jul, 4:12 p. m." en hora de Colombia — para el sello de "última vez". */
export function formatSello(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("es-CO", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "Faltan 12 días" · "Mañana" · "Hoy" · "Hace 3 días" */
export function textoCuenta(dias: number | null): string {
  if (dias == null) return "—";
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  if (dias === -1) return "Ayer";
  if (dias > 1) return `Faltan ${dias} días`;
  return `Hace ${Math.abs(dias)} días`;
}

/* ============================================================
   TELÉFONO / WHATSAPP
   ============================================================ */

/**
 * Deja sólo los dígitos que wa.me necesita, asumiendo Colombia (+57) cuando
 * el número viene sin indicativo. Devuelve null si no parece un número usable.
 *
 *   "304 550 2154"    -> "573045502154"
 *   "+57 304 5502154" -> "573045502154"
 *   "3045502154"      -> "573045502154"
 */
export function waDigitos(telefono: string | null | undefined): string | null {
  if (!telefono) return null;
  let d = telefono.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  // Celular colombiano sin indicativo: 10 dígitos empezando en 3.
  if (d.length === 10 && d.startsWith("3")) d = "57" + d;
  // Cualquier otra cosa demasiado corta se descarta: es mejor dejar el botón apagado
  // que adivinar un indicativo y abrir el chat de un desconocido.
  if (d.length < 10 || d.length > 15) return null;
  return d;
}

/** Enlace wa.me que abre el chat directo — en el celular salta a la app. */
export function waLink(telefono: string | null | undefined, mensaje?: string): string | null {
  const d = waDigitos(telefono);
  if (!d) return null;
  const base = `https://wa.me/${d}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** Saludo por defecto al abrir el chat de un lead. */
export function saludoWA(lead: Pick<Lead, "nombre" | "tipo_evento">): string {
  const primerNombre = (lead.nombre ?? "").trim().split(/\s+/)[0] || "";
  const hola = primerNombre ? `Hola ${primerNombre}` : "Hola";
  const evento = lead.tipo_evento ? ` sobre tu ${lead.tipo_evento.toLowerCase()}` : "";
  return `${hola}, te escribo de parte de Meli Rox${evento} 🎻`;
}

/** Formato lindo para mostrar: "+57 304 550 2154" */
export function formatTelefono(telefono: string | null | undefined): string {
  const d = waDigitos(telefono);
  if (!d) return telefono?.trim() || "—";
  if (d.startsWith("57") && d.length === 12) {
    const n = d.slice(2);
    return `+57 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }
  return "+" + d;
}

/* ============================================================
   ENTRADA DE MONTOS
   ============================================================ */

/** Agrupa dígitos con puntos mientras se escribe: "1500000" -> "1.500.000" */
export function agruparDigitos(raw: string): string {
  const limpio = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!limpio) return "";
  return limpio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Lee un monto escrito por Meli ("1.500.000" o "1500000") a número. */
export function leerMonto(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const limpio = String(raw).replace(/\D/g, "");
  if (limpio === "") return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
}
