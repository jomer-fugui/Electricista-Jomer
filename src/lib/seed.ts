import { db, pool } from "@/db";
import { items, settings } from "@/db/schema";
import { SEED_ITEMS } from "./seed-data";

/** Crea las tablas si no existen (respaldo por si la base es nueva). */
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "items" (
  "id" serial PRIMARY KEY NOT NULL,
  "section" varchar(64) NOT NULL,
  "category" varchar(160) DEFAULT '' NOT NULL,
  "slug" varchar(160) DEFAULT '' NOT NULL,
  "title" text DEFAULT '' NOT NULL,
  "subtitle" text DEFAULT '' NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "image_url" text DEFAULT '' NOT NULL,
  "gallery" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "video_url" text DEFAULT '' NOT NULL,
  "link_url" text DEFAULT '' NOT NULL,
  "link_label" text DEFAULT '' NOT NULL,
  "platform" varchar(40) DEFAULT '' NOT NULL,
  "price" text DEFAULT '' NOT NULL,
  "unit" text DEFAULT '' NOT NULL,
  "rating" integer DEFAULT 0 NOT NULL,
  "location" text DEFAULT '' NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "published" boolean DEFAULT true NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "items_section_idx" ON "items" USING btree ("section","sort_order");
CREATE TABLE IF NOT EXISTS "pages" (
  "key" varchar(64) PRIMARY KEY NOT NULL,
  "nav_label" text DEFAULT '' NOT NULL,
  "title" text DEFAULT '' NOT NULL,
  "intro" text DEFAULT '' NOT NULL,
  "image_url" text DEFAULT '' NOT NULL,
  "visible" boolean DEFAULT true NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "settings" (
  "key" varchar(100) PRIMARY KEY NOT NULL,
  "value" text DEFAULT '' NOT NULL
);
CREATE TABLE IF NOT EXISTS "media" (
  "id" serial PRIMARY KEY NOT NULL,
  "filename" text NOT NULL,
  "mime_type" varchar(120) NOT NULL,
  "size" integer NOT NULL,
  "data" bytea NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
`;

let seedPromise: Promise<void> | null = null;

/** Se ejecuta una sola vez: asegura las tablas y carga contenido de ejemplo. */
export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = run().catch((err) => {
      console.error("[seed] error:", err);
      seedPromise = null;
    });
  }
  return seedPromise;
}

async function run(): Promise<void> {
  await pool.query(SCHEMA_SQL);
  await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(settings)
      .values({ key: "__seeded", value: new Date().toISOString() })
      .onConflictDoNothing()
      .returning();
    if (inserted.length === 0) return;
    const counters: Record<string, number> = {};
    const rows = SEED_ITEMS.map((it) => {
      const n = counters[it.section] ?? 0;
      counters[it.section] = n + 1;
      return { ...it, sortOrder: n };
    });
    await tx.insert(items).values(rows);
  });
}
