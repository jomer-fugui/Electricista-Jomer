"use client";

import { useId, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, FileText, Link2, Loader2, Music, Play, Upload, X } from "lucide-react";
import { cn, mediaKind, mediaThumb } from "@/lib/format";

type UploadResult = { url: string; id: number; mimeType: string; filename: string };

export function uploadFile(file: File, onProgress?: (p: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data as UploadResult);
        else reject(new Error(data.error || "Error al subir el archivo"));
      } catch {
        reject(new Error(xhr.status === 413 ? "El archivo es demasiado grande" : "Error al subir el archivo"));
      }
    };
    xhr.onerror = () => reject(new Error("Error de red al subir el archivo"));
    const fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
  });
}

/** Reduce fotos grandes (de celular) antes de subirlas para que la página cargue rápido. */
export async function maybeResize(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1.2 * 1024 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    const outType = file.type === "image/jpeg" ? "image/jpeg" : "image/webp";
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, outType, 0.85));
    if (!blob || blob.size >= file.size) return file;
    const ext = outType === "image/jpeg" ? "jpg" : "webp";
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${ext}`, { type: outType });
  } catch {
    return file;
  }
}

function Preview({ url, small = false }: { url: string; small?: boolean }) {
  const kind = mediaKind(url);
  const thumb = mediaThumb(url);
  if (kind === "video") {
    return <video src={url} controls={!small} muted={small} preload="metadata" className={cn("rounded-lg", small ? "h-full w-full object-cover" : "max-h-48")} />;
  }
  if (kind === "audio") {
    return small ? (
      <div className="placeholder-art grid h-full w-full place-items-center">
        <Music className="h-6 w-6 text-white/70" />
      </div>
    ) : (
      <audio src={url} controls className="w-72" />
    );
  }
  if (kind === "pdf") {
    return (
      <div className="grid h-full w-full place-items-center p-3 text-xs text-zinc-300">
        <FileText className="h-6 w-6" />
      </div>
    );
  }
  if (thumb) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumb}
        alt=""
        className={cn("rounded-lg", small ? "h-full w-full object-cover" : "max-h-40 object-contain")}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }
  return <p className="px-2 py-1 text-xs break-all text-zinc-400">{url}</p>;
}

/** Campo de imagen/video: pegar enlace o subir archivo. Controlado (value/onChange) o libre (defaultValue). */
export function MediaInput({
  name,
  value,
  defaultValue,
  onChange,
  accept = "image/*",
  placeholder,
}: {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  accept?: string;
  placeholder?: string;
}) {
  const [inner, setInner] = useState(defaultValue ?? "");
  const val = value ?? inner;
  const update = (x: string) => (onChange ? onChange(x) : setInner(x));
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputId = useId();

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    setProgress(0);
    try {
      const prepared = await maybeResize(file);
      const res = await uploadFile(prepared, setProgress);
      update(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={val}
          onChange={(e) => update(e.target.value)}
          placeholder={placeholder ?? "Pega un enlace o sube un archivo"}
          className="input"
        />
        <label
          htmlFor={inputId}
          className={cn("btn-ghost shrink-0 cursor-pointer px-3", busy && "pointer-events-none opacity-60")}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {progress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Subir
            </>
          )}
        </label>
        <input id={inputId} type="file" accept={accept} className="hidden" onChange={onFile} />
        {val && (
          <button type="button" onClick={() => update("")} className="btn-ghost shrink-0 px-3" aria-label="Quitar">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {val && (
        <div className="inline-block overflow-hidden rounded-xl border border-white/10 bg-black/40 p-2">
          <Preview url={val} />
        </div>
      )}
    </div>
  );
}

/** Galería: varias fotos/videos (subidos o enlaces de YouTube). */
export function GalleryInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputId = useId();

  async function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    setError("");
    const added: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const prepared = await maybeResize(files[i]);
        const res = await uploadFile(prepared, (p) => setProgress(Math.round(((i + p / 100) / files.length) * 100)));
        added.push(res.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      if (added.length) onChange([...value, ...added]);
      setBusy(false);
      setProgress(0);
    }
  }

  function move(i: number, d: -1 | 1) {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {value.map((u, i) => {
            const k = mediaKind(u);
            return (
              <div key={u + i} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
                <Preview url={u} small />
                {(k === "youtube" || k === "vimeo" || k === "video") && (
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    <Play className="h-6 w-6 fill-white text-white drop-shadow" />
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                  <button type="button" onClick={() => move(i, -1)} className="rounded p-1 hover:bg-white/10" aria-label="Mover a la izquierda">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                    className="rounded p-1 text-red-300 hover:bg-white/10"
                    aria-label="Quitar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} className="rounded p-1 hover:bg-white/10" aria-label="Mover a la derecha">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={inputId} className={cn("btn-ghost cursor-pointer", busy && "pointer-events-none opacity-60")}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Subiendo… {progress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Subir fotos / videos
            </>
          )}
        </label>
        <input id={inputId} type="file" multiple accept="image/*,video/*,audio/*" className="hidden" onChange={onFiles} />
        <div className="flex flex-1 gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="o pega un enlace (YouTube, imagen…)"
            className="input"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (url.trim()) {
                  onChange([...value, url.trim()]);
                  setUrl("");
                }
              }
            }}
          />
          <button
            type="button"
            className="btn-ghost shrink-0 px-3"
            onClick={() => {
              if (url.trim()) {
                onChange([...value, url.trim()]);
                setUrl("");
              }
            }}
          >
            <Link2 className="h-4 w-4" /> Agregar
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

/** Subida directa para la biblioteca de archivos. */
export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const inputId = useId();

  async function onFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setBusy(true);
    setMsg("");
    let ok = 0;
    for (let i = 0; i < files.length; i++) {
      try {
        setMsg(`Subiendo ${i + 1} de ${files.length}…`);
        await uploadFile(await maybeResize(files[i]));
        ok++;
      } catch (err) {
        setMsg(err instanceof Error ? err.message : "Error al subir");
      }
    }
    setBusy(false);
    setMsg(`${ok} archivo(s) subido(s).`);
    router.refresh();
  }

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "card flex cursor-pointer flex-col items-center gap-2 border-dashed p-8 text-center transition hover:border-accent",
        busy && "pointer-events-none opacity-70",
      )}
    >
      {busy ? <Loader2 className="h-8 w-8 animate-spin text-accent-light" /> : <Upload className="h-8 w-8 text-accent-light" />}
      <span className="font-semibold text-white">Subir archivos</span>
      <span className="text-sm text-zinc-400">Fotos, videos, audios o PDF (máx. 50 MB cada uno)</span>
      {msg && <span className="text-sm text-zinc-300">{msg}</span>}
      <input id={inputId} type="file" multiple accept="image/*,video/*,audio/*,application/pdf" className="hidden" onChange={onFiles} />
    </label>
  );
}
