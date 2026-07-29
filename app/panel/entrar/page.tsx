import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { estaAutenticada } from "@/app/lib/panel/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar — Meli Rox",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function EntrarPage() {
  if (await estaAutenticada()) redirect("/panel");

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-mark">MR</span>
          <h1>Mis leads</h1>
          <p className="eyebrow">Meli Rox</p>
        </div>
        <LoginForm />
        <p className="login-foot">Acceso privado</p>
      </div>
    </main>
  );
}
