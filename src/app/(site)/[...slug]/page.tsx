import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getCustomPageBySlug, getItem, getItems, getPageTexts, getSettings } from "@/lib/data";
import { excerpt } from "@/lib/format";
import { resolvePath } from "@/lib/sections";
import { CustomPageView, HubView, ItemDetailView, SectionPage, itemPath } from "@/components/views/PageViews";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toPath(slug: string[]): string {
  return (
    "/" +
    slug
      .map((s) => {
        try {
          return decodeURIComponent(s);
        } catch {
          return s;
        }
      })
      .join("/")
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const path = toPath(slug);
  const r = resolvePath(path);
  const pages = await getPageTexts();
  if (r && r.kind !== "detail") {
    const key = r.kind === "hub" ? r.hub.key : r.section.key;
    const t = pages[key];
    return {
      title: t.title,
      description: excerpt(t.intro, 160),
      openGraph: t.imageUrl ? { images: [t.imageUrl] } : undefined,
    };
  }
  if (r?.kind === "detail") {
    const item = await getItem(r.id);
    if (item) {
      return {
        title: item.title || pages[r.section.key].title,
        description: excerpt(item.subtitle || item.content, 160),
        openGraph: item.imageUrl ? { images: [item.imageUrl] } : undefined,
      };
    }
  }
  if (!r && slug.length === 1) {
    const page = await getCustomPageBySlug(path.slice(1));
    if (page) return { title: page.title, description: excerpt(page.subtitle || page.content, 160) };
  }
  return { title: "Página no encontrada" };
}

export default async function CatchAllPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const path = toPath(slug);
  const r = resolvePath(path);
  const [settings, pages, admin] = await Promise.all([getSettings(), getPageTexts(), isAdmin()]);

  if (!r) {
    if (slug.length === 1) {
      const page = await getCustomPageBySlug(path.slice(1));
      if (page) {
        if (`/${page.slug}` !== path) redirect(`/${page.slug}`);
        return <CustomPageView page={page} admin={admin} />;
      }
    }
    notFound();
  }

  if (r.kind !== "detail" && path !== r.canonical) redirect(r.canonical);

  const key = r.kind === "hub" ? r.hub.key : r.section.key;
  if (pages[key]?.visible === false && !admin) notFound();

  if (r.kind === "hub") {
    return <HubView hub={r.hub} pages={pages} settings={settings} admin={admin} />;
  }

  if (r.kind === "detail") {
    const item = await getItem(r.id);
    if (!item || item.section !== r.section.key || (!item.published && !admin)) notFound();
    const proper = itemPath(r.section.path, item);
    if (path !== proper) redirect(proper);
    return <ItemDetailView section={r.section} item={item} pages={pages} settings={settings} admin={admin} />;
  }

  const category = typeof sp.cat === "string" ? sp.cat : undefined;
  const items = await getItems(r.section.key);
  return (
    <SectionPage
      section={r.section}
      text={pages[key]}
      items={items}
      settings={settings}
      pages={pages}
      admin={admin}
      category={category}
    />
  );
}
