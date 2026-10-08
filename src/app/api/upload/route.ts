import { db } from "@/db";
import { media } from "@/db/schema";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX = 50 * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/ogg": "ogv",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/ogg": "ogg",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "application/pdf": "pdf",
};

function safeName(name: string, type: string): string {
  const base =
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "archivo";
  const origExt = (name.match(/\.([a-z0-9]{2,5})$/i)?.[1] ?? "").toLowerCase();
  const ext = EXT[type] || origExt || "bin";
  return `${base}.${ext}`;
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "No autorizado. Vuelve a iniciar sesión." }, { status: 401 });
  }
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "No se pudo leer el archivo." }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (file.size > MAX) {
    return Response.json(
      { error: "El archivo supera los 50 MB. Para videos largos súbelos a YouTube y pega el enlace." },
      { status: 413 },
    );
  }
  const type = file.type || "application/octet-stream";
  if (!/^(image|video|audio)\//.test(type) && type !== "application/pdf") {
    return Response.json({ error: "Tipo de archivo no permitido (solo imágenes, videos, audios o PDF)." }, { status: 415 });
  }
  const data = Buffer.from(await file.arrayBuffer());
  const filename = safeName(file.name || "archivo", type);
  const [row] = await db
    .insert(media)
    .values({ filename, mimeType: type, size: data.length, data })
    .returning({ id: media.id });
  return Response.json({ id: row.id, url: `/api/media/${row.id}/${filename}`, filename, mimeType: type });
}
