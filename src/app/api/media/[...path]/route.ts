import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";

export const dynamic = "force-dynamic";

const CHUNK = 2 * 1024 * 1024;

/** Sirve los archivos subidos (con soporte de rangos para reproducir videos). */
export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const id = Number(path?.[0]);
  if (!Number.isInteger(id) || id <= 0) return new Response("Not found", { status: 404 });

  const [meta] = await db
    .select({ mimeType: media.mimeType, size: media.size, filename: media.filename })
    .from(media)
    .where(eq(media.id, id))
    .limit(1);
  if (!meta) return new Response("Not found", { status: 404 });

  const headers: Record<string, string> = {
    "Content-Type": meta.mimeType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Content-Disposition": `inline; filename="${meta.filename}"`,
  };
  if (meta.mimeType === "image/svg+xml") {
    headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
  }

  const range = req.headers.get("range");
  const m = range ? /bytes=(\d*)-(\d*)/.exec(range) : null;
  if (m && (m[1] !== "" || m[2] !== "")) {
    let start: number;
    let end: number;
    if (m[1] === "") {
      start = Math.max(0, meta.size - Number(m[2]));
      end = meta.size - 1;
    } else {
      start = Number(m[1]);
      end = m[2] ? Math.min(Number(m[2]), meta.size - 1) : Math.min(start + CHUNK - 1, meta.size - 1);
    }
    if (start >= meta.size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${meta.size}` } });
    }
    const len = end - start + 1;
    const res = await db.execute(
      sql`select substring(${media.data} from ${start + 1}::int for ${len}::int) as chunk from ${media} where ${media.id} = ${id}`,
    );
    const chunk = res.rows[0]?.chunk as Buffer | undefined;
    if (!chunk) return new Response("Not found", { status: 404 });
    return new Response(new Uint8Array(chunk), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${start + chunk.length - 1}/${meta.size}`, "Content-Length": String(chunk.length) },
    });
  }

  const [row] = await db.select({ data: media.data }).from(media).where(eq(media.id, id)).limit(1);
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(row.data), { headers: { ...headers, "Content-Length": String(row.data.length) } });
}
