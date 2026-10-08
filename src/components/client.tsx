"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, Copy, FileText, Music, Play, Printer, X } from "lucide-react";
import { cn, mediaKind, mediaThumb } from "@/lib/format";
import { MediaPlayer } from "./media";

export function CopyButton({ text, label = "Copiar", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }
  return (
    <button type="button" onClick={copy} className={cn("btn-ghost btn-sm", className)}>
      {done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "¡Copiado!" : label}
    </button>
  );
}

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-ghost no-print">
      <Printer className="h-4 w-4" /> Imprimir / guardar PDF
    </button>
  );
}

export function ConfirmButton({
  children,
  message,
  className,
  title,
}: {
  children: ReactNode;
  message: string;
  className?: string;
  title?: string;
}) {
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** Galería con visor (lightbox) para fotos, videos de YouTube, videos subidos y audios. */
export function Gallery({ urls, title, className }: { urls: string[]; title?: string; className?: string }) {
  const list = urls.filter(Boolean);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % list.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + list.length) % list.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, list.length]);

  if (list.length === 0) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
        {list.map((url, i) => {
          const kind = mediaKind(url);
          const thumb = mediaThumb(url);
          return (
            <button
              key={url + i}
              type="button"
              onClick={() => setOpen(i)}
              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-zinc-900"
              aria-label={`Abrir elemento ${i + 1}`}
            >
              {kind === "video" ? (
                <video src={`${url}#t=0.5`} preload="metadata" muted playsInline className="h-full w-full object-cover" />
              ) : thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              ) : (
                <div className="placeholder-art grid h-full w-full place-items-center">
                  {kind === "audio" ? <Music className="h-8 w-8 text-white/60" /> : <FileText className="h-8 w-8 text-white/60" />}
                </div>
              )}
              {(kind === "video" || kind === "youtube" || kind === "vimeo") && (
                <span className="absolute inset-0 grid place-items-center bg-black/30">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/90 text-white shadow-lg">
                    <Play className="ml-0.5 h-5 w-5 fill-white" />
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Cerrar"
            onClick={() => setOpen(null)}
          />
          <div className="relative z-10 flex max-h-full w-full max-w-5xl items-center justify-center">
            <MediaPlayer key={list[open]} url={list[open]} title={title} autoPlay className="max-h-[85vh]" />
          </div>
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setOpen((open - 1 + list.length) % list.length)}
                className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setOpen((open + 1) % list.length)}
                className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                {open + 1} / {list.length}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
