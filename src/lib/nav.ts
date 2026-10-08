import { GROUPS, HUBS, SECTIONS, type IconName } from "./sections";
import type { PageText } from "./data";

export type NavLink = { href: string; label: string; icon: IconName };
export type NavGroup = { key: string; label: string; href?: string; icon: IconName; links: NavLink[] };

export function buildNav(
  pages: Record<string, PageText>,
  custom: { slug: string; title: string }[],
): NavGroup[] {
  const out: NavGroup[] = [];
  for (const g of GROUPS) {
    const hub = HUBS.find((h) => h.group === g.key);
    const hubVisible = hub ? pages[hub.key]?.visible !== false : false;
    const links: NavLink[] = [];
    if (hub && hubVisible) links.push({ href: hub.path, label: hub.allLabel, icon: hub.icon });
    for (const s of SECTIONS) {
      if (s.group !== g.key || s.layout === "custom") continue;
      const t = pages[s.key];
      if (t && !t.visible) continue;
      links.push({ href: s.path, label: t?.navLabel || s.navLabel, icon: s.icon });
    }
    if (g.key === "mas") {
      for (const c of custom) {
        if (c.slug) links.push({ href: `/${c.slug}`, label: c.title || c.slug, icon: "file" });
      }
    }
    if (links.length === 0) continue;
    out.push({
      key: g.key,
      label: hub ? pages[hub.key]?.navLabel || g.label : g.label,
      href: hub && hubVisible ? hub.path : undefined,
      icon: g.icon,
      links,
    });
  }
  return out;
}
