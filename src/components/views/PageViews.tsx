import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { getItems, type Item, type PageText } from "@/lib/data";
import type { Settings } from "@/lib/defaults";
import { GROUPS, HUBS, getSection, subnavFor, type HubDef, type SectionDef } from "@/lib/sections";
import { excerpt } from "@/lib/format";
import { Gallery } from "../client";
import { MediaPlayer } from "../media";
import {
  AdminFab,
  BuyButton,
  ContactButton,
  ItemImage,
  PageHero,
  PlatformBadge,
  PriceTag,
  RichText,
  SectionHeading,
  SmartLink,
  Stars,
  SubNav,
} from "../ui";
import { Icon } from "../icons";
import { SectionBody, itemPath } from "./SectionView";

export { itemPath };

function eyebrowFor(section: SectionDef, pages: Record<string, PageText>): string {
  const hub = HUBS.find((h) => h.children.includes(section.key));
  if (hub) return pages[hub.key]?.navLabel ?? hub.navLabel;
  if (section.group === "mas") return "Jomerarte";
  return GROUPS.find((g) => g.key === section.group)?.label ?? "";
}

function crumbsFor(section: SectionDef, pages: Record<string, PageText>) {
  const crumbs = [{ href: "/", label: "Inicio" }];
  const hub = HUBS.find((h) => h.children.includes(section.key));
  if (hub) crumbs.push({ href: hub.path, label: pages[hub.key]?.navLabel ?? hub.navLabel });
  const tabs = subnavFor(section.key);
  if (!hub && tabs && tabs[0] !== section.key) {
    const first = getSection(tabs[0]);
    if (first) crumbs.push({ href: first.path, label: pages[first.key]?.navLabel ?? first.navLabel });
  }
  return crumbs;
}

/* ───────────────────────── Página de sección */
export function SectionPage({
  section,
  text,
  items,
  settings,
  pages,
  admin,
  category,
}: {
  section: SectionDef;
  text: PageText;
  items: Item[];
  settings: Settings;
  pages: Record<string, PageText>;
  admin: boolean;
  category?: string;
}) {
  const tabs = subnavFor(section.key);
  return (
    <>
      <PageHero
        title={text.title}
        intro={text.intro}
        image={text.imageUrl}
        icon={section.icon}
        eyebrow={eyebrowFor(section, pages)}
        crumbs={crumbsFor(section, pages)}
        tone={section.layout === "bad" ? "danger" : "default"}
      >
        {section.layout === "services" && (
          <ContactButton settings={settings} topic={text.title} label="Pedir presupuesto" />
        )}
      </PageHero>
      {tabs && <SubNav keys={tabs} current={section.key} pages={pages} />}
      <div className="container-x py-12">
        <SectionBody section={section} items={items} settings={settings} category={category} admin={admin} />
      </div>
      {admin && <AdminFab href={`/admin/s/${section.key}`} />}
    </>
  );
}

/* ───────────────────────── Páginas “hub” (Servicios, Tienda, Recomendaciones, Truchadas) */
export async function HubView({
  hub,
  pages,
  settings,
  admin,
}: {
  hub: HubDef;
  pages: Record<string, PageText>;
  settings: Settings;
  admin: boolean;
}) {
  const text = pages[hub.key];
  const children = hub.children
    .map((k) => getSection(k))
    .filter((s): s is SectionDef => Boolean(s) && pages[s!.key]?.visible !== false);
  const previews = await Promise.all(children.map((s) => getItems(s.key, { limit: 4 })));
  const danger = hub.key === "truchadas";

  const stores = [
    { url: settings.storeMercadoLibre, label: "Mi tienda en Mercado Libre", bg: "#FFE600", fg: "#2D3277" },
    { url: settings.storeHotmart, label: "Mis productos en Hotmart", bg: "#F04E23", fg: "#fff" },
    { url: settings.storeAliExpress, label: "Mi tienda en AliExpress", bg: "#E62E04", fg: "#fff" },
    { url: settings.storeAmazon, label: "Mi tienda en Amazon", bg: "#FF9900", fg: "#111" },
    { url: settings.storeOther, label: settings.storeOtherLabel || "Otra tienda", bg: "#3f3f46", fg: "#fff" },
  ].filter((s) => s.url);

  return (
    <>
      <PageHero
        title={text.title}
        intro={text.intro}
        image={text.imageUrl}
        icon={hub.icon}
        crumbs={[{ href: "/", label: "Inicio" }]}
        tone={danger ? "danger" : "default"}
      >
        {hub.key === "servicios" && <ContactButton settings={settings} label="Pedir presupuesto" />}
        {hub.key === "tienda" &&
          stores.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition hover:brightness-110"
              style={{ background: s.bg, color: s.fg }}
            >
              {s.label}
            </a>
          ))}
      </PageHero>
      <SubNav keys={[hub.key, ...hub.children]} current={hub.key} pages={pages} />

      <div className="container-x space-y-20 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {children.map((s) => {
            const t = pages[s.key];
            return (
              <Link key={s.key} href={s.path} className="card card-hover group flex flex-col overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ItemImage
                    src={t.imageUrl}
                    alt={t.title}
                    icon={s.icon}
                    label={t.navLabel}
                    className="transition duration-700 group-hover:scale-105"
                  />
                  <span
                    className={
                      danger
                        ? "absolute top-3 left-3 grid h-10 w-10 place-items-center rounded-xl bg-red-600/80 text-white"
                        : "absolute top-3 left-3 grid h-10 w-10 place-items-center rounded-xl bg-accent/90 text-white"
                    }
                  >
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-xl leading-tight font-bold text-white">{t.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{excerpt(t.intro, 110)}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-accent-light">
                    Entrar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {children.map((s, i) =>
          previews[i].length > 0 ? (
            <section key={s.key}>
              <SectionHeading eyebrow={pages[s.key].navLabel} title={pages[s.key].title} href={s.path} />
              <div className="mt-8">
                <SectionBody section={s} items={previews[i]} settings={settings} admin={admin} preview />
              </div>
            </section>
          ) : null,
        )}
      </div>
      {admin && <AdminFab href={`/admin/s/${hub.key}`} label="Editar textos" />}
    </>
  );
}

/* ───────────────────────── Detalle de un elemento */
export async function ItemDetailView({
  section,
  item,
  pages,
  settings,
  admin,
}: {
  section: SectionDef;
  item: Item;
  pages: Record<string, PageText>;
  settings: Settings;
  admin: boolean;
}) {
  const text = pages[section.key];
  const all = await getItems(section.key);
  const idx = all.findIndex((i) => i.id === item.id);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;
  const others = all.filter((i) => i.id !== item.id).slice(0, 4);
  const isCommerce = section.layout === "products" || section.layout === "services";
  const crumbs = [...crumbsFor(section, pages), { href: section.path, label: text.navLabel }];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        {item.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="absolute inset-0 -z-20 h-full w-full scale-110 object-cover opacity-20 blur-2xl" />
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-zinc-950/40 to-zinc-950" />
        <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
          <div className="order-2 lg:order-1">
            <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-zinc-400" aria-label="Migas de pan">
              {crumbs.map((c) => (
                <span key={c.href} className="inline-flex items-center gap-1.5">
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                  <span>/</span>
                </span>
              ))}
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              {item.category && <span className="chip">{item.category}</span>}
              {item.platform && <PlatformBadge platform={item.platform} />}
              <Stars value={item.rating} bad={section.layout === "bad"} />
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] font-bold tracking-wide text-white uppercase sm:text-5xl">
              {item.title}
            </h1>
            {item.subtitle && <p className="mt-3 text-lg font-medium text-accent-light">{item.subtitle}</p>}
            {item.location && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-400">
                <MapPin className="h-4 w-4 text-accent-light" /> {item.location}
              </p>
            )}
            {item.price && <PriceTag price={item.price} unit={item.unit} className="mt-6" />}
            <div className="mt-7 flex flex-wrap gap-3">
              {item.linkUrl &&
                (isCommerce ? (
                  <BuyButton url={item.linkUrl} platform={item.platform} label={item.linkLabel} className="px-5 py-3 text-sm" />
                ) : (
                  <SmartLink href={item.linkUrl} className="btn-primary">
                    {item.linkLabel || "Ver enlace"}
                  </SmartLink>
                ))}
              {isCommerce && <ContactButton settings={settings} topic={item.title} />}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mx-auto max-h-[70vh] w-auto rounded-2xl border border-white/10 object-contain shadow-2xl shadow-black/60"
              />
            ) : item.videoUrl ? (
              <MediaPlayer url={item.videoUrl} title={item.title} />
            ) : (
              <div className="mx-auto aspect-square max-w-md overflow-hidden rounded-2xl border border-white/10">
                <ItemImage alt={item.title} icon={section.icon} label={item.title} />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-x space-y-16 py-12">
        {item.content && (
          <RichText
            text={item.content}
            className={
              section.layout === "songs" || section.layout === "poems"
                ? "max-w-3xl font-serif text-lg whitespace-pre-line text-zinc-200"
                : "max-w-3xl text-lg text-zinc-300"
            }
          />
        )}
        {item.videoUrl && item.imageUrl && (
          <section>
            <SectionHeading title="Video" />
            <MediaPlayer url={item.videoUrl} title={item.title} className="mt-6 max-w-4xl" />
          </section>
        )}
        {item.gallery.length > 0 && (
          <section>
            <SectionHeading title="Galería" />
            <Gallery urls={item.gallery} title={item.title} className="mt-6" />
          </section>
        )}

        {(prev || next) && (
          <nav className="grid gap-4 sm:grid-cols-2" aria-label="Navegación entre elementos">
            {prev ? (
              <Link href={itemPath(section.path, prev)} className="card card-hover p-5">
                <span className="inline-flex items-center gap-1 text-xs tracking-widest text-zinc-500 uppercase">
                  <ArrowLeft className="h-3.5 w-3.5" /> Anterior
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-white">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={itemPath(section.path, next)} className="card card-hover p-5 text-right">
                <span className="inline-flex items-center gap-1 text-xs tracking-widest text-zinc-500 uppercase">
                  Siguiente <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-white">{next.title}</span>
              </Link>
            )}
          </nav>
        )}

        {others.length > 0 && (
          <section>
            <SectionHeading eyebrow="Más contenido" title={text.navLabel} href={section.path} />
            <div className="mt-8">
              <SectionBody section={section} items={others} settings={settings} admin={admin} preview />
            </div>
          </section>
        )}
      </div>
      {admin && <AdminFab href={`/admin/s/${section.key}/${item.id}`} label="Editar" />}
    </>
  );
}

/* ───────────────────────── Páginas personalizadas */
export function CustomPageView({ page, admin }: { page: Item; admin: boolean }) {
  return (
    <>
      <PageHero
        title={page.title}
        intro={page.subtitle}
        image={page.imageUrl}
        icon="file"
        crumbs={[{ href: "/", label: "Inicio" }]}
      >
        {page.linkUrl && (
          <SmartLink href={page.linkUrl} className="btn-primary">
            {page.linkLabel || "Ver más"}
          </SmartLink>
        )}
      </PageHero>
      <div className="container-x space-y-12 py-12">
        <RichText text={page.content} className="max-w-3xl text-lg text-zinc-300" />
        {page.videoUrl && <MediaPlayer url={page.videoUrl} title={page.title} className="max-w-4xl" />}
        {page.gallery.length > 0 && <Gallery urls={page.gallery} title={page.title} />}
      </div>
      {admin && <AdminFab href={`/admin/s/custom/${page.id}`} label="Editar página" />}
    </>
  );
}
