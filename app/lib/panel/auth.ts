import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const COOKIE = "mr_panel";
const MAX_AGE = 60 * 60 * 24 * 60; // 60 días — que no la saque cada semana del celular

/**
 * Secreto para firmar la cookie. En desarrollo cae a un valor fijo; en producción
 * exige SESSION_SECRET (si falta, no se puede iniciar sesión — ver credencialesListas).
 */
function secreto(): string {
  const s = process.env.SESSION_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== "production") return "melirox-dev-secret";
  return "";
}

function firmar(payload: string): string {
  return crypto.createHmac("sha256", secreto()).update(payload).digest("base64url");
}

function crearToken(): string {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = `meli.${exp}`;
  return `${payload}.${firmar(payload)}`;
}

function verificarToken(token?: string): boolean {
  if (!token || !secreto()) return false;
  const partes = token.split(".");
  if (partes.length !== 3) return false;
  const [usuario, exp, sig] = partes;
  const esperado = firmar(`${usuario}.${exp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(esperado);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  if (!Number(exp) || Number(exp) < Date.now()) return false;
  return true;
}

/**
 * ¿Están configuradas las credenciales? A diferencia del tracker de WIS, acá NO hay
 * contraseña por defecto en el código: sin variables de entorno el panel no abre.
 */
export function credencialesListas(): boolean {
  return Boolean(process.env.PANEL_PASSWORD && secreto());
}

function comparacionSegura(a: string, b: string): boolean {
  // Se hashean primero para que la comparación no filtre la longitud real.
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function verificarCredenciales(usuario: string, clave: string): boolean {
  if (!credencialesListas()) return false;
  const U = process.env.PANEL_USERNAME || "meli";
  const P = process.env.PANEL_PASSWORD as string;
  return comparacionSegura(usuario.trim().toLowerCase(), U.trim().toLowerCase()) && comparacionSegura(clave, P);
}

export async function estaAutenticada(): Promise<boolean> {
  const store = await cookies();
  return verificarToken(store.get(COOKIE)?.value);
}

export async function exigirAuth(): Promise<void> {
  if (!(await estaAutenticada())) redirect("/panel/entrar");
}

export async function abrirSesion(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, crearToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function cerrarSesion(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
