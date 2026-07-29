"use server";

import { revalidatePath } from "next/cache";
import { exigirAuth } from "@/app/lib/panel/auth";
import {
  crearLead,
  actualizarLead,
  borrarLead,
  setGastoAds,
  type LeadInput,
} from "@/app/lib/panel/db";
import { normalizarEstado, leerMonto } from "@/app/lib/panel/leads";

function txt(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s === "" ? null : s;
}

function monto(v: FormDataEntryValue | null): number | null {
  return leerMonto(v == null ? null : String(v));
}

function parsear(fd: FormData): LeadInput {
  return {
    nombre: txt(fd.get("nombre")) ?? "Sin nombre",
    telefono: txt(fd.get("telefono")),
    email: txt(fd.get("email")),
    fuente: txt(fd.get("fuente")),
    tipo_evento: txt(fd.get("tipo_evento")),
    formato: txt(fd.get("formato")),
    fecha_contacto: txt(fd.get("fecha_contacto")),
    fecha_evento: txt(fd.get("fecha_evento")),
    ciudad: txt(fd.get("ciudad")),
    lugar: txt(fd.get("lugar")),
    valor: monto(fd.get("valor")),
    valor_cerrado: monto(fd.get("valor_cerrado")),
    abono: monto(fd.get("abono")),
    seguimiento: txt(fd.get("seguimiento")),
    estado: normalizarEstado(String(fd.get("estado") ?? "nuevo")),
    google_win: fd.get("google_win") != null,
    notas: txt(fd.get("notas")),
  };
}

export async function guardarLeadAction(fd: FormData): Promise<void> {
  await exigirAuth();
  const id = txt(fd.get("id"));
  const input = parsear(fd);
  if (id) {
    await actualizarLead(id, input);
  } else {
    await crearLead(input);
  }
  revalidatePath("/panel");
}

export async function borrarLeadAction(fd: FormData): Promise<void> {
  await exigirAuth();
  const id = txt(fd.get("id"));
  if (id) {
    await borrarLead(id);
    revalidatePath("/panel");
  }
}

/**
 * Guarda el gasto total de Google Ads tal cual lo escribe Meli.
 * Sobrescribe el valor anterior — sin sumas ni acumulados.
 */
export async function guardarGastoAction(fd: FormData): Promise<void> {
  await exigirAuth();
  await setGastoAds(monto(fd.get("gasto")) ?? 0);
  revalidatePath("/panel");
}
