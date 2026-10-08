"use client";

import { useActionState, useState, type ReactNode } from "react";
import Link from "next/link";
import { Loader2, Wand2 } from "lucide-react";
import { saveItemAction, type FormState } from "@/app/admin/actions";
import { PLATFORMS, detectPlatform } from "@/lib/platforms";
import type { FieldKey, SectionDef } from "@/lib/sections";
import { cn } from "@/lib/format";
import { GalleryInput, MediaInput } from "./MediaInput";
import { SubmitButton } from "./SubmitButton";

export type ItemValues = {
  title: string;
  subtitle: string;
  content: string;
  category: string;
  imageUrl: string;
  gallery: string[];
  videoUrl: string;
  linkUrl: string;
  linkLabel: string;
  platform: string;
  price: string;
  unit: string;
  rating: number;
  location: string;
  slug: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: ItemValues = {
  title: "",
  subtitle: "",
  content: "",
  category: "",
  imageUrl: "",
  gallery: [],
  videoUrl: "",
  linkUrl: "",
  linkLabel: "",
  platform: "",
  price: "",
  unit: "",
  rating: 0,
  location: "",
  slug: "",
  featured: false,
  published: true,
};

const FORMAT_HINT =
  "Formato: **negrita**, *cursiva*, [texto](https://enlace), “- ” para listas, “## ” para subtítulos. Deja una línea en blanco para separar párrafos.";

function Field({ label, hint, children, className }: { label?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      {label && <label className="label">{label}</label>}
      {children}
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export function ItemForm({
  section,
  item,
}: {
  section: Pick<SectionDef, "key" | "fields" | "categories" | "itemLabel" | "layout">;
  item: (ItemValues & { id: number }) | null;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(saveItemAction, null);
  const [v, setV] = useState<ItemValues>(item ? { ...EMPTY, ...item } : EMPTY);
  const [fetching, setFetching] = useState(false);
  const [autoMsg, setAutoMsg] = useState("");
  const f = section.fields;
  const has = (k: FieldKey) => Boolean(f[k]);
  const set = <K extends keyof ItemValues>(k: K, val: ItemValues[K]) => setV((p) => ({ ...p, [k]: val }));
  const longText = ["story", "custom", "poems", "songs", "characters", "devlog", "inventions"].includes(section.layout);

  async function autofill() {
    if (!v.linkUrl) return;
    setFetching(true);
    setAutoMsg("");
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(v.linkUrl)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo leer el enlace");
      setV((p) => ({
        ...p,
        title: p.title || data.title || "",
        content: has("content") ? p.content || data.description || "" : p.content,
        imageUrl: has("imageUrl") ? p.imageUrl || data.image || "" : p.imageUrl,
        price: has("price") ? p.price || data.price || "" : p.price,
        platform: has("platform") ? p.platform || data.platform || "" : p.platform,
      }));
      setAutoMsg("Listo: se completaron los campos vacíos. Revísalos antes de guardar.");
    } catch (e) {
      setAutoMsg(e instanceof Error ? e.message : "No se pudo leer el enlace.");
    } finally {
      setFetching(false);
    }
  }

  const linkBlock = has("linkUrl") && (
    <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
      <Field label={f.linkUrl}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            name="linkUrl"
            value={v.linkUrl}
            onChange={(e) => {
              const url = e.target.value;
              setV((p) => ({
                ...p,
                linkUrl: url,
                platform: has("platform") && !p.platform && /^https?:\/\//.test(url) ? detectPlatform(url) : p.platform,
              }));
            }}
            placeholder="https://…"
            className="input"
          />
          <button type="button" onClick={autofill} disabled={!v.linkUrl || fetching} className="btn-ghost shrink-0">
            {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Autocompletar
          </button>
        </div>
      </Field>
      {autoMsg && <p className="text-xs text-zinc-400">{autoMsg}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {has("platform") && (
          <Field label={f.platform}>
            <select name="platform" value={v.platform} onChange={(e) => set("platform", e.target.value)} className="input">
              <option value="">— Detectar automáticamente —</option>
              {PLATFORMS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
        )}
        {has("linkLabel") && (
          <Field label={f.linkLabel}>
            <input
              name="linkLabel"
              value={v.linkLabel}
              onChange={(e) => set("linkLabel", e.target.value)}
              placeholder="Automático"
              className="input"
            />
          </Field>
        )}
      </div>
    </div>
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="section" value={section.key} />
      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="gallery" value={JSON.stringify(v.gallery)} />
      {!has("linkUrl") && has("platform") && <input type="hidden" name="platform" value={v.platform} />}

      {state?.error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{state.error}</div>
      )}

      <section className="card space-y-5 p-6">
        <h2 className="font-display text-lg font-bold tracking-wide text-white uppercase">Información</h2>
        {section.layout === "products" && linkBlock}

        {has("title") && (
          <Field label={f.title}>
            <input name="title" value={v.title} onChange={(e) => set("title", e.target.value)} className="input" />
          </Field>
        )}
        {has("slug") && (
          <Field label={f.slug} hint="Solo letras, números y guiones. Respeta mayúsculas (ej: Contacto, MisTrabajos).">
            <div className="flex items-center overflow-hidden rounded-lg border border-white/10 bg-zinc-950/80">
              <span className="pl-3 text-sm text-zinc-500">jomerarte.com/</span>
              <input
                name="slug"
                value={v.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="w-full bg-transparent px-1 py-2.5 text-sm text-zinc-100 focus:outline-none"
              />
            </div>
          </Field>
        )}
        {has("subtitle") && (
          <Field label={f.subtitle}>
            <input name="subtitle" value={v.subtitle} onChange={(e) => set("subtitle", e.target.value)} className="input" />
          </Field>
        )}
        {has("category") && (
          <Field label={f.category}>
            <input
              name="category"
              value={v.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Escribe o elige una"
              className="input"
            />
            {section.categories && section.categories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {section.categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("category", c)}
                    className={cn("chip hover:border-white/30", v.category === c && "chip-active")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </Field>
        )}
        {has("content") && (
          <Field label={f.content} hint={FORMAT_HINT}>
            <textarea
              name="content"
              rows={longText ? 14 : 6}
              value={v.content}
              onChange={(e) => set("content", e.target.value)}
              className="input font-mono text-[13px] leading-relaxed"
            />
          </Field>
        )}

        {(has("price") || has("unit") || has("rating") || has("location")) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {has("price") && (
              <Field label={f.price}>
                <input name="price" value={v.price} onChange={(e) => set("price", e.target.value)} placeholder="$ 0" className="input" />
              </Field>
            )}
            {has("unit") && (
              <Field label={f.unit}>
                <input name="unit" value={v.unit} onChange={(e) => set("unit", e.target.value)} className="input" />
              </Field>
            )}
            {has("rating") && (
              <Field label={f.rating}>
                <select name="rating" value={v.rating} onChange={(e) => set("rating", Number(e.target.value))} className="input">
                  <option value={0}>Sin puntuación</option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {"★".repeat(n)}
                      {"☆".repeat(5 - n)} ({n})
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {has("location") && (
              <Field label={f.location}>
                <input name="location" value={v.location} onChange={(e) => set("location", e.target.value)} className="input" />
              </Field>
            )}
          </div>
        )}

        {section.layout !== "products" && linkBlock}
      </section>

      {(has("imageUrl") || has("videoUrl") || has("gallery")) && (
        <section className="card space-y-5 p-6">
          <h2 className="font-display text-lg font-bold tracking-wide text-white uppercase">Imágenes y videos</h2>
          {has("imageUrl") && (
            <Field label={f.imageUrl}>
              <MediaInput name="imageUrl" value={v.imageUrl} onChange={(x) => set("imageUrl", x)} accept="image/*" />
            </Field>
          )}
          {has("videoUrl") && (
            <Field label={f.videoUrl} hint="Pega un enlace de YouTube o Vimeo, o sube un video/audio (máx. 50 MB).">
              <MediaInput
                name="videoUrl"
                value={v.videoUrl}
                onChange={(x) => set("videoUrl", x)}
                accept="video/*,audio/*"
                placeholder="https://youtube.com/watch?v=… o sube un archivo"
              />
            </Field>
          )}
          {has("gallery") && (
            <Field label={f.gallery}>
              <GalleryInput value={v.gallery} onChange={(g) => set("gallery", g)} />
            </Field>
          )}
        </section>
      )}

      <section className="card flex flex-wrap items-center gap-6 p-6">
        <label className="flex items-center gap-2 text-sm text-zinc-200">
          <input
            type="checkbox"
            name="published"
            checked={v.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Publicado (visible en el sitio)
        </label>
        {section.key !== "custom" && (
          <label className="flex items-center gap-2 text-sm text-zinc-200">
            <input
              type="checkbox"
              name="featured"
              checked={v.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Destacado en la portada
          </label>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <SubmitButton>Guardar {section.itemLabel}</SubmitButton>
        <Link href={`/admin/s/${section.key}`} className="btn-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
