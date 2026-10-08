import { cache } from "react";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { items, pages, settings } from "@/db/schema";
import { DEFAULT_SETTINGS, type Settings } from "./defaults";
import { ALL_PAGE_DEFS } from "./sections";
import { normalizePath } from "./sections";
import { ensureSeeded } from "./seed";

export type Item = typeof items.$inferSelect;

export type PageText = {
  key: string;
  navLabel: string;
  title: string;
  intro: string;
  imageUrl: string;
  visible: boolean;
};

export const getSettings = cache(async (): Promise<Settings> => {
  const out: Settings = { ...DEFAULT_SETTINGS };
  try {
    await ensureSeeded();
    const rows = await db.select().from(settings);
    for (const row of rows) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_SETTINGS, row.key)) {
        (out as Record<string, string>)[row.key] = row.value;
      }
    }
  } catch (err) {
    console.error("[settings]", err);
  }
  return out;
});

export const getPageTexts = cache(async (): Promise<Record<string, PageText>> => {
  const map: Record<string, PageText> = {};
  for (const def of ALL_PAGE_DEFS) {
    map[def.key] = {
      key: def.key,
      navLabel: def.navLabel,
      title: def.title,
      intro: def.intro,
      imageUrl: def.image ?? "",
      visible: true,
    };
  }
  try {
    await ensureSeeded();
    const rows = await db.select().from(pages);
    for (const r of rows) {
      const base = map[r.key];
      if (!base) continue;
      map[r.key] = {
        key: r.key,
        navLabel: r.navLabel || base.navLabel,
        title: r.title || base.title,
        intro: r.intro,
        imageUrl: r.imageUrl,
        visible: r.visible,
      };
    }
  } catch (err) {
    console.error("[pages]", err);
  }
  return map;
});

export async function getItems(
  section: string,
  opts: { all?: boolean; limit?: number } = {},
): Promise<Item[]> {
  await ensureSeeded();
  const conds = [eq(items.section, section)];
  if (!opts.all) conds.push(eq(items.published, true));
  const q = db
    .select()
    .from(items)
    .where(and(...conds))
    .orderBy(asc(items.sortOrder), desc(items.createdAt))
    .$dynamic();
  return opts.limit ? q.limit(opts.limit) : q;
}

export async function getItem(id: number): Promise<Item | undefined> {
  if (!Number.isInteger(id) || id <= 0) return undefined;
  await ensureSeeded();
  const rows = await db.select().from(items).where(eq(items.id, id)).limit(1);
  return rows[0];
}

export async function getFeatured(limit = 8): Promise<Item[]> {
  await ensureSeeded();
  return db
    .select()
    .from(items)
    .where(and(eq(items.featured, true), eq(items.published, true)))
    .orderBy(asc(items.sortOrder), desc(items.updatedAt))
    .limit(limit);
}

export async function getRandomItem(section: string): Promise<Item | undefined> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(items)
    .where(and(eq(items.section, section), eq(items.published, true)))
    .orderBy(sql`random()`)
    .limit(1);
  return rows[0];
}

export const getCustomPages = cache(async (): Promise<Item[]> => {
  try {
    return await getItems("custom");
  } catch (err) {
    console.error("[custom pages]", err);
    return [];
  }
});

export async function getCustomPageBySlug(slug: string): Promise<Item | undefined> {
  const list = await getCustomPages();
  const target = normalizePath("/" + slug);
  return list.find((p) => p.slug && normalizePath("/" + p.slug) === target);
}

export async function getSectionCounts(): Promise<Record<string, number>> {
  await ensureSeeded();
  const rows = await db
    .select({ section: items.section, count: sql<number>`count(*)::int` })
    .from(items)
    .groupBy(items.section);
  const out: Record<string, number> = {};
  for (const r of rows) out[r.section] = Number(r.count);
  return out;
}
