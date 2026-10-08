import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { getItem, getPageTexts, type Item } from "@/lib/data";
import { getSection, newItemLabel } from "@/lib/sections";
import { ConfirmButton } from "@/components/client";
import { ItemForm, type ItemValues } from "@/components/admin/ItemForm";
import { itemPath } from "@/components/views/SectionView";
import { deleteItemAction } from "../../../../actions";

export const dynamic = "force-dynamic";

function toValues(it: Item): ItemValues & { id: number } {
  return {
    id: it.id,
    title: it.title,
    subtitle: it.subtitle,
    content: it.content,
    category: it.category,
    imageUrl: it.imageUrl,
    gallery: Array.isArray(it.gallery) ? it.gallery : [],
    videoUrl: it.videoUrl,
    linkUrl: it.linkUrl,
    linkLabel: it.linkLabel,
    platform: it.platform,
    price: it.price,
    unit: it.unit,
    rating: it.rating,
    location: it.location,
    slug: it.slug,
    featured: it.featured,
    published: it.published,
  };
}

export default async function EditItemPage({ params }: { params: Promise<{ key: string; id: string }> }) {
  const { key, id } = await params;
  const section = getSection(key);
  if (!section) notFound();
  let item: Item | undefined;
  if (id !== "nuevo") {
    item = await getItem(Number(id));
    if (!item || item.section !== key) notFound();
  }
  const pages = await getPageTexts();
  const label = pages[key]?.navLabel ?? section.navLabel;
  const publicHref = item ? (key === "custom" ? `/${item.slug}` : section.detail ? itemPath(section.path, item) : section.path) : null;

  return (
    <div className="space-y-6">
      <nav className="text-sm text-zinc-500">
        <Link href="/admin" className="hover:text-white">
          Panel
        </Link>{" "}
        /{" "}
        <Link href={`/admin/s/${key}`} className="hover:text-white">
          {label}
        </Link>{" "}
        / <span className="text-zinc-300">{item ? "Editar" : "Nuevo"}</span>
      </nav>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-white uppercase">
          {item ? `Editar ${section.itemLabel}` : newItemLabel(section)}
        </h1>
        {publicHref && (
          <Link href={publicHref} target="_blank" className="btn-ghost">
            <ExternalLink className="h-4 w-4" /> Ver en el sitio
          </Link>
        )}
      </div>

      <ItemForm
        section={{
          key: section.key,
          fields: section.fields,
          categories: section.categories,
          itemLabel: section.itemLabel,
          layout: section.layout,
        }}
        item={item ? toValues(item) : null}
      />

      {item && (
        <form action={deleteItemAction} className="border-t border-white/10 pt-6">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="redirectTo" value={`/admin/s/${key}`} />
          <ConfirmButton message="¿Seguro que quieres eliminar este elemento? No se puede deshacer." className="btn-danger">
            <Trash2 className="h-4 w-4" /> Eliminar {section.itemLabel}
          </ConfirmButton>
        </form>
      )}
    </div>
  );
}
