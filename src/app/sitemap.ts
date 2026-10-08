import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { items } from "@/db/schema";
import { getCustomPages, getPageTexts } from "@/lib/data";
import { slugify } from "@/lib/format";
import { ALL_PAGE_DEFS, SECTIONS } from "@/lib/sections";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://jomerarte.com").replace(/\/$/, "");
  const pages = await getPageTexts();
  const entries: MetadataRoute.Sitemap = [{ url: base, changeFrequency: "weekly", priority: 1 }];

  for (const def of ALL_PAGE_DEFS) {
    if (def.key === "custom" || pages[def.key]?.visible === false) continue;
    entries.push({ url: base + def.path, changeFrequency: "weekly", priority: 0.8 });
  }

  try {
    const rows = await db
      .select({ id: items.id, title: items.title, section: items.section, updatedAt: items.updatedAt })
      .from(items)
      .where(eq(items.published, true));
    for (const r of rows) {
      const s = SECTIONS.find((x) => x.key === r.section);
      if (!s?.detail || pages[s.key]?.visible === false) continue;
      entries.push({
        url: `${base}${s.path}/${r.id}-${slugify(r.title) || "ver"}`,
        lastModified: r.updatedAt,
        priority: 0.6,
      });
    }
    for (const c of await getCustomPages()) {
      if (c.slug) entries.push({ url: `${base}/${c.slug}`, lastModified: c.updatedAt, priority: 0.5 });
    }
  } catch (err) {
    console.error("[sitemap]", err);
  }
  return entries;
}
