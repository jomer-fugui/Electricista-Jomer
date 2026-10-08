import Link from "next/link";
import { desc } from "drizzle-orm";
import { FileText, Music, Trash2 } from "lucide-react";
import { db } from "@/db";
import { media } from "@/db/schema";
import { formatDate } from "@/lib/format";
import { ConfirmButton, CopyButton } from "@/components/client";
import { MediaUploader } from "@/components/admin/MediaInput";
import { deleteMediaAction } from "../../actions";

export const dynamic = "force-dynamic";

function size(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function MediaPage() {
  const rows = await db
    .select({ id: media.id, filename: media.filename, mimeType: media.mimeType, size: media.size, createdAt: media.createdAt })
    .from(media)
    .orderBy(desc(media.createdAt))
    .limit(500);

  return (
    <div className="space-y-8">
      <nav className="text-sm text-zinc-500">
        <Link href="/admin" className="hover:text-white">
          Panel
        </Link>{" "}
        / <span className="text-zinc-300">Archivos</span>
      </nav>
      <div>
        <h1 className="font-display text-3xl font-bold text-white uppercase">Archivos subidos</h1>
        <p className="mt-1 text-zinc-400">
          Todas tus fotos, videos y audios. Copia el enlace de cualquier archivo para usarlo en cualquier sección.
        </p>
      </div>

      <MediaUploader />

      {rows.length === 0 ? (
        <p className="text-center text-zinc-500">Todavía no subiste archivos.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((m) => {
            const url = `/api/media/${m.id}/${m.filename}`;
            return (
              <div key={m.id} className="card overflow-hidden">
                <a href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square bg-zinc-950">
                  {m.mimeType.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={m.filename} loading="lazy" className="h-full w-full object-cover" />
                  ) : m.mimeType.startsWith("video/") ? (
                    <video src={`${url}#t=0.5`} preload="metadata" muted className="h-full w-full object-cover" />
                  ) : (
                    <div className="placeholder-art grid h-full w-full place-items-center">
                      {m.mimeType.startsWith("audio/") ? (
                        <Music className="h-10 w-10 text-white/60" />
                      ) : (
                        <FileText className="h-10 w-10 text-white/60" />
                      )}
                    </div>
                  )}
                </a>
                <div className="space-y-2 p-3">
                  <p className="truncate text-sm font-medium text-white" title={m.filename}>
                    {m.filename}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {size(m.size)} · {formatDate(m.createdAt)}
                  </p>
                  <div className="flex gap-2">
                    <CopyButton text={url} label="Copiar enlace" className="flex-1" />
                    <form action={deleteMediaAction}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmButton
                        message="¿Eliminar este archivo? Si lo usas en alguna sección dejará de verse."
                        className="btn-ghost btn-sm text-red-300 hover:bg-red-500/20"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </ConfirmButton>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
