"use client";

import { useActionState } from "react";
import { entrar, type EstadoLogin } from "@/app/actions/panel-auth";

export default function LoginForm() {
  const [estado, action, pendiente] = useActionState<EstadoLogin, FormData>(
    entrar,
    undefined
  );

  return (
    <form action={action} className="login-form">
      <div className="fld">
        <label htmlFor="usuario">Usuario</label>
        <input
          id="usuario"
          name="usuario"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />
      </div>
      <div className="fld">
        <label htmlFor="clave">Contraseña</label>
        <input
          id="clave"
          name="clave"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {estado?.error && <p className="login-error">{estado.error}</p>}

      <button type="submit" className="btn-solid" disabled={pendiente}>
        {pendiente ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
