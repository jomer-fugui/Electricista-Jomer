import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { hasPassword, isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { SiteLogo } from "@/components/Logo";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { loginAction, setupAction } from "../actions";

export const metadata: Metadata = { title: "Acceso al panel", robots: { index: false, follow: false } };

const MESSAGES: Record<string, string> = {
  "1": "Contraseña incorrecta.",
  short: "La contraseña debe tener al menos 6 caracteres.",
  match: "Las contraseñas no coinciden.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const [setup, settings, { error }] = await Promise.all([
    hasPassword().then((h) => !h),
    getSettings(),
    searchParams,
  ]);
  const msg = error ? MESSAGES[error] : undefined;

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <SiteLogo settings={settings} className="mx-auto h-28 w-28" idPrefix="login" />
          <h1 className="mt-4 font-brand text-xl tracking-[0.2em] text-white">{settings.siteName.toUpperCase()}</h1>
          <p className="mt-1 text-sm text-zinc-400">{setup ? "Crea tu contraseña de administrador" : "Panel de administración"}</p>
        </div>
        <form action={setup ? setupAction : loginAction} className="card mt-8 space-y-4 p-6">
          {msg && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{msg}</p>}
          {setup && (
            <p className="text-sm text-zinc-400">
              Es la primera vez que entras. Elige una contraseña (mínimo 6 caracteres): la usarás para editar tu página
              cuando quieras.
            </p>
          )}
          <div>
            <label className="label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={setup ? 6 : 1}
              autoFocus
              autoComplete={setup ? "new-password" : "current-password"}
              className="input"
            />
          </div>
          {setup && (
            <div>
              <label className="label" htmlFor="confirm">
                Repite la contraseña
              </label>
              <input id="confirm" name="confirm" type="password" required minLength={6} autoComplete="new-password" className="input" />
            </div>
          )}
          <SubmitButton className="w-full" pendingLabel="Entrando…" icon={false}>
            {setup ? "Crear contraseña y entrar" : "Entrar"}
          </SubmitButton>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">
            ← Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
