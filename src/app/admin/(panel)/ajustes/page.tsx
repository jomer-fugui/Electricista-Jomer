
import Link from "next/link";
import { passwordFromEnv } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { SETTINGS_GROUPS, type SettingField } from "@/lib/defaults";
import { MediaInput } from "@/components/admin/MediaInput";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { changePasswordAction, saveSettingsAction } from "../../actions";

export const dynamic = "force-dynamic";

const PW: Record<string, { ok: boolean; text: string }> = {
  ok: { ok: true, text: "Contraseña actualizada." },
  wrong: { ok: false, text: "La contraseña actual no es correcta." },
  short: { ok: false, text: "La nueva contraseña debe tener al menos 6 caracteres." },
  match: { ok: false, text: "Las contraseñas nuevas no coinciden." },
  env: { ok: false, text: "La contraseña está definida en la variable de entorno ADMIN_PASSWORD." },
};

function FieldInput({ field, value }: { field: SettingField; value: string }) {
  switch (field.type) {
    case "textarea":
      return <textarea name={field.key} defaultValue={value} rows={4} className="input" />;
    case "image":
      return <MediaInput name={field.key} defaultValue={value} accept="image/*" />;
    case "color":
      return (
        <input
          type="color"
          name={field.key}
          defaultValue={/^#[0-9a-f]{6}$/i.test(value) ? value : "#b3121f"}
          className="h-11 w-24 cursor-pointer rounded-lg border border-white/10 bg-zinc-950 p-1"
        />
      );
    default:
      return (
        <input
          type={field.type === "url" ? "url" : field.type === "email" ? "email" : field.type === "tel" ? "tel" : "text"}
          name={field.key}
          defaultValue={value}
          className="input"
        />
      );
  }
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; pw?: string }> }) {
  const [settings, { ok, pw }] = await Promise.all([getSettings(), searchParams]);
  const pwMsg = pw ? PW[pw] : undefined;
  const envPw = passwordFromEnv();

  return (
    <div className="space-y-8">
      <nav className="text-sm text-zinc-500">
        <Link href="/admin" className="hover:text-white">
          Panel
        </Link>{" "}
        / <span className="text-zinc-300">Ajustes</span>
      </nav>
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase">Ajustes del sitio</h1>
        <p className="mt-1 text-zinc-400">Logo, colores, textos de la portada, contacto, redes sociales y tiendas externas.</p>
      </div>

      {ok && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">Ajustes guardados.</div>
      )}

      <form action={saveSettingsAction} className="space-y-6">
        {SETTINGS_GROUPS.map((g) => (
          <section key={g.title} className="card space-y-5 p-6">
            <div>
              <h2 className="font-display text-xl font-bold tracking-wide text-white uppercase">{g.title}</h2>
              {g.description && <p className="text-sm text-zinc-500">{g.description}</p>}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {g.fields.map((field) => (
                <div key={field.key} className={field.type === "textarea" || field.type === "image" ? "md:col-span-2" : ""}>
                  <label className="label">{field.label}</label>
                  <FieldInput field={field} value={settings[field.key]} />
                  {field.hint && <p className="mt-1.5 text-xs text-zinc-500">{field.hint}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="sticky bottom-4 z-10 flex justify-end">
          <SubmitButton className="px-8 py-3 shadow-2xl">Guardar ajustes</SubmitButton>
        </div>
      </form>

      <section id="seguridad" className="card space-y-5 p-6">
        <div>
          <h2 className="font-display text-xl font-bold tracking-wide text-white uppercase">Seguridad</h2>
          <p className="text-sm text-zinc-500">Cambia la contraseña del panel.</p>
        </div>
        {pwMsg && (
          <div
            className={
              pwMsg.ok
                ? "rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200"
                : "rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"
            }
          >
            {pwMsg.text}
          </div>
        )}
        {envPw ? (
          <p className="text-sm text-zinc-400">La contraseña se administra con la variable de entorno ADMIN_PASSWORD.</p>
        ) : (
          <form action={changePasswordAction} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">Contraseña actual</label>
              <input type="password" name="current" required autoComplete="current-password" className="input" />
            </div>
            <div>
              <label className="label">Nueva contraseña</label>
              <input type="password" name="next" required minLength={6} autoComplete="new-password" className="input" />
            </div>
            <div>
              <label className="label">Repite la nueva</label>
              <input type="password" name="confirm" required minLength={6} autoComplete="new-password" className="input" />
            </div>
            <div className="md:col-span-3">
              <SubmitButton>Cambiar contraseña</SubmitButton>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
