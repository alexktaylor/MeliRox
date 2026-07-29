"use server";

import { redirect } from "next/navigation";
import {
  verificarCredenciales,
  credencialesListas,
  abrirSesion,
  cerrarSesion,
} from "@/app/lib/panel/auth";

export type EstadoLogin = { error?: string } | undefined;

export async function entrar(
  _prev: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  if (!credencialesListas()) {
    return {
      error:
        "El panel todavía no tiene contraseña configurada (PANEL_PASSWORD y SESSION_SECRET).",
    };
  }

  const usuario = String(formData.get("usuario") ?? "");
  const clave = String(formData.get("clave") ?? "");

  if (!verificarCredenciales(usuario, clave)) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  await abrirSesion();
  redirect("/panel");
}

export async function salir(): Promise<void> {
  await cerrarSesion();
  redirect("/panel/entrar");
}
