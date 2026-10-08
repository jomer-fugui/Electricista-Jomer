import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

/** Contenido genérico de todas las secciones (servicios, productos, frases, personajes, etc.) */
export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    section: varchar("section", { length: 64 }).notNull(),
    category: varchar("category", { length: 160 }).notNull().default(""),
    slug: varchar("slug", { length: 160 }).notNull().default(""),
    title: text("title").notNull().default(""),
    subtitle: text("subtitle").notNull().default(""),
    content: text("content").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
    videoUrl: text("video_url").notNull().default(""),
    linkUrl: text("link_url").notNull().default(""),
    linkLabel: text("link_label").notNull().default(""),
    platform: varchar("platform", { length: 40 }).notNull().default(""),
    price: text("price").notNull().default(""),
    unit: text("unit").notNull().default(""),
    rating: integer("rating").notNull().default(0),
    location: text("location").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("items_section_idx").on(t.section, t.sortOrder)],
);

/** Textos editables de cada página (título, introducción, imagen, visibilidad) */
export const pages = pgTable("pages", {
  key: varchar("key", { length: 64 }).primaryKey(),
  navLabel: text("nav_label").notNull().default(""),
  title: text("title").notNull().default(""),
  intro: text("intro").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  visible: boolean("visible").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Ajustes generales del sitio (clave / valor) */
export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull().default(""),
});

/** Archivos subidos (fotos, videos, audios, PDF) */
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  mimeType: varchar("mime_type", { length: 120 }).notNull(),
  size: integer("size").notNull(),
  data: bytea("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
