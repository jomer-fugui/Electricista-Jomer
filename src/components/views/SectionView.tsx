import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  Feather,
  Globe,
  Laugh,
  MapPin,
  Play,
  Quote,
  Share2,
  TriangleAlert,
} from "lucide-react";
import type { Item } from "@/lib/data";
import type { Settings } from "@/lib/defaults";
import type { SectionDef } from "@/lib/sections";
import { cn, excerpt, formatDate, slugify } from "@/lib/format";
import { getPlatform } from "@/lib/platforms";
import { CopyButton, Gallery, PrintButton } from "../client";
import { MediaPlayer } from "../media";
import {
  BuyButton,
  CategoryChips,
  ContactButton,
  EmptyState,
  ItemImage,
  PlatformBadge,
  PriceTag,
  RichText,
  SmartLink,
  Stars,
} from "../ui";

export type ViewProps = {
  section: SectionDef;
  items: Item[];
  settings: Settings;
  category?: string;
  admin?: boolean;
  preview?: boolean;
};

export function itemPath(basePath: string, item: { id: number; title: string }): string {
  return `${basePath}/${item.id}-${slugify(item.title) || "ver"}`;
}

function categorize(section: SectionDef, items: Item[], active?: string) {
  const present = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
  const known = section.categories ?? [];
  const categories = [...known.filter((c) => present.includes(c)), ...present.filter((c) => !known.includes(c))];
  const counts: Record<string, number> = {};
  for (const i of items) if (i.category) counts[i.category] = (counts[i.category] ?? 0) + 1;
  const filtered = active ? items.filter((i) => i.category === active) : items;
  return { categories, counts, filtered };
}

export function SectionBody(props: ViewProps) {
  const { section, items, admin } = props;
  if (items.length === 0) {
    return <EmptyState label={section.itemLabel} adminHref={admin ? `/admin/s/${section.key}/nuevo` : undefined} />;
  }
  switch (section.layout) {
    case "services":
      return <ServicesList {...props} />;
    case "products":
      return <ProductsGrid {...props} />;
    case "recommend":
      return <RecommendList {...props} />;
    case "bad":
      return <BadList {...props} />;
    case "quotes":
      return <QuotesWall {...props} />;
    case "colmos":
      return <ColmosGrid {...props} />;
    case "poems":
      return <PoemsList {...props} />;
    case "links":
      return <LinksGrid {...props} />;
    case "songs":
      return <SongsList {...props} />;
    case "characters":
      return <CharactersGrid {...props} />;
    case "story":
      return <StoryTimeline {...props} />;
    case "devlog":
    case "inventions":
      return <PostsGrid {...props} />;
    case "prices":
      return <PricesTable {...props} />;
    case "donations":
      return <DonationsList {...props} />;
    default:
      return null;
  }
}

/* ───────────────────────── Servicios y cursos */
function ServicesList({ section, items, settings }: ViewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((it) => (
        <article key={it.id} className="card card-hover group flex flex-col overflow-hidden">
          <Link href={itemPath(section.path, it)} className="relative block aspect-[16/9] overflow-hidden">
            <ItemImage
              src={it.imageUrl}
              alt={it.title}
              icon={section.icon}
              label={it.title}
              className="transition duration-700 group-hover:scale-105"
            />
            {it.platform && <PlatformBadge platform={it.platform} className="absolute top-3 left-3" />}
          </Link>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-2xl leading-tight font-bold text-white">
              <Link href={itemPath(section.path, it)} className="hover:text-accent-light">
                {it.title}
              </Link>
            </h3>
            {it.subtitle && <p className="mt-1 text-sm font-medium text-accent-light">{it.subtitle}</p>}
            <RichText text={it.content} className="mt-3 text-sm text-zinc-300" />
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
              <PriceTag price={it.price} unit={it.unit} />
              <div className="flex flex-wrap gap-2">
                {it.linkUrl && <BuyButton url={it.linkUrl} platform={it.platform} label={it.linkLabel || "Ver más"} />}
                <ContactButton settings={settings} topic={it.title} className="btn-sm" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ───────────────────────── Tienda */
function ProductsGrid({ section, items, settings, category, preview }: ViewProps) {
  const { categories, counts, filtered } = categorize(section, items, category);
  return (
    <div className="space-y-6">
      {!preview && <CategoryChips categories={categories} counts={counts} active={category} basePath={section.path} />}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((it) => (
          <article key={it.id} className="card card-hover group flex flex-col overflow-hidden">
            <Link href={itemPath(section.path, it)} className="relative block aspect-square overflow-hidden bg-zinc-950">
              <ItemImage
                src={it.imageUrl}
                alt={it.title}
                icon={section.icon}
                label={it.category || section.navLabel}
                className="transition duration-700 group-hover:scale-105"
              />
              {it.platform && <PlatformBadge platform={it.platform} className="absolute top-3 left-3" />}
            </Link>
            <div className="flex flex-1 flex-col p-5">
              {it.category && <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">{it.category}</p>}
              <h3 className="mt-1 font-display text-xl leading-tight font-bold text-white">
                <Link href={itemPath(section.path, it)} className="hover:text-accent-light">
                  {it.title}
                </Link>
              </h3>
              {it.subtitle && <p className="mt-1 text-sm text-zinc-400">{it.subtitle}</p>}
              <div className="mt-auto pt-4">
                {it.price && <div className="font-display text-2xl font-bold text-white">{it.price}</div>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {it.linkUrl ? (
                    <BuyButton url={it.linkUrl} platform={it.platform} label={it.linkLabel} className="flex-1" />
                  ) : (
                    <ContactButton settings={settings} topic={it.title} className="btn-sm flex-1" />
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Recomendaciones */
function RecommendList({ section, items, category, preview }: ViewProps) {
  const { categories, counts, filtered } = categorize(section, items, category);
  return (
    <div className="space-y-6">
      {!preview && <CategoryChips categories={categories} counts={counts} active={category} basePath={section.path} />}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <article key={it.id} className="card card-hover flex flex-col overflow-hidden">
            {it.imageUrl && (
              <div className="aspect-[16/9] overflow-hidden">
                <ItemImage src={it.imageUrl} alt={it.title} />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-300 uppercase">
                  <BadgeCheck className="h-3.5 w-3.5" /> Recomendado
                </span>
                <Stars value={it.rating} />
              </div>
              <h3 className="mt-3 font-display text-2xl leading-tight font-bold text-white">{it.title}</h3>
              {it.subtitle && <p className="text-sm text-zinc-400">{it.subtitle}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                {it.category && <span className="chip">{it.category}</span>}
                {it.platform && <PlatformBadge platform={it.platform} />}
                {it.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-accent-light" /> {it.location}
                  </span>
                )}
                {it.price && <span className="font-semibold text-white">{it.price}</span>}
              </div>
              <RichText text={it.content} className="mt-3 text-sm text-zinc-300" />
              {it.linkUrl && (
                <div className="mt-auto pt-5">
                  <SmartLink href={it.linkUrl} className="btn-ghost btn-sm">
                    {it.linkLabel || "Visitar"} <ArrowUpRight className="h-3.5 w-3.5" />
                  </SmartLink>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── NO recomendable */
function BadList({ section, items, category, preview }: ViewProps) {
  const { categories, counts, filtered } = categorize(section, items, category);
  return (
    <div className="space-y-6">
      {!preview && <CategoryChips categories={categories} counts={counts} active={category} basePath={section.path} />}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <article
            key={it.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-red-500/20 bg-linear-to-b from-red-950/30 to-zinc-900/60 transition hover:border-red-500/50"
          >
            {it.imageUrl && (
              <div className="aspect-[16/9] overflow-hidden grayscale-[40%]">
                <ItemImage src={it.imageUrl} alt={it.title} />
              </div>
            )}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-red-300 uppercase">
                  <TriangleAlert className="h-3.5 w-3.5" /> NO recomendado
                </span>
                <Stars value={it.rating} bad />
              </div>
              <h3 className="mt-3 font-display text-2xl leading-tight font-bold text-white">{it.title}</h3>
              {it.subtitle && <p className="text-sm text-zinc-400">{it.subtitle}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                {it.category && <span className="chip">{it.category}</span>}
                {it.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-red-400" /> {it.location}
                  </span>
                )}
              </div>
              <RichText text={it.content} className="mt-3 text-sm text-zinc-300" />
              {it.gallery.length > 0 && <Gallery urls={it.gallery} title={it.title} className="mt-4 !grid-cols-3" />}
              {it.linkUrl && (
                <div className="mt-auto pt-5">
                  <SmartLink href={it.linkUrl} className="btn-ghost btn-sm">
                    Ver enlace <ArrowUpRight className="h-3.5 w-3.5" />
                  </SmartLink>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Frases */
function QuotesWall({ section, items, category, preview }: ViewProps) {
  const { categories, counts, filtered } = categorize(section, items, category);
  return (
    <div className="space-y-6">
      {!preview && <CategoryChips categories={categories} counts={counts} active={category} basePath={section.path} />}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((it) => {
          const share = `“${it.content}” — Frases de un Herje · jomerarte.com`;
          return (
            <figure key={it.id} className="card relative mb-5 break-inside-avoid overflow-hidden p-6">
              <Quote className="h-8 w-8 text-accent" />
              {it.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.imageUrl} alt="" loading="lazy" className="mt-3 w-full rounded-lg" />
              )}
              <blockquote className="mt-3 font-display text-xl leading-snug font-semibold whitespace-pre-line text-white sm:text-2xl">
                {it.content}
              </blockquote>
              <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {it.category && (
                    <Link
                      href={`${section.path}?cat=${encodeURIComponent(it.category)}`}
                      scroll={false}
                      className="chip hover:border-accent"
                    >
                      {it.category}
                    </Link>
                  )}
                  {it.title && <span className="text-sm text-zinc-400">— {it.title}</span>}
                </div>
                <div className="flex gap-1.5">
                  <CopyButton text={share} />
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(share)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost btn-sm"
                    aria-label="Compartir por WhatsApp"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </a>
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Colmos */
function ColmosGrid({ items }: ViewProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((it) => (
        <details key={it.id} className="card group p-6 transition open:border-accent/60">
          <summary className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent-light">
              <Laugh className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block font-display text-xl leading-snug font-bold text-white">{it.title}</span>
              <span className="mt-1 block text-xs tracking-widest text-zinc-500 uppercase group-open:hidden">
                Toca para ver la respuesta
              </span>
            </span>
            <ChevronDown className="mt-1 h-5 w-5 text-zinc-500 transition group-open:rotate-180" />
          </summary>
          <p className="mt-4 border-t border-white/10 pt-4 text-lg font-medium text-accent-light">{it.content}</p>
        </details>
      ))}
    </div>
  );
}

/* ───────────────────────── Poesías */
function PoemsList({ section, items, category, preview }: ViewProps) {
  const { categories, counts, filtered } = categorize(section, items, category);
  return (
    <div className="space-y-6">
      {!preview && <CategoryChips categories={categories} counts={counts} active={category} basePath={section.path} />}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((it) => (
          <article key={it.id} className="card relative overflow-hidden p-7 sm:p-9">
            <Feather className="absolute top-6 right-6 h-16 w-16 text-white/5" />
            {it.category && (
              <Link href={`${section.path}?cat=${encodeURIComponent(it.category)}`} scroll={false} className="chip hover:border-accent">
                {it.category}
              </Link>
            )}
            <h3 className="mt-3 font-display text-3xl font-bold text-white">{it.title}</h3>
            {it.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.imageUrl} alt="" loading="lazy" className="mt-4 w-full rounded-xl" />
            )}
            <div className="mt-5 font-serif text-lg leading-relaxed whitespace-pre-line text-zinc-200 italic">{it.content}</div>
            {it.videoUrl && <MediaPlayer url={it.videoUrl} title={it.title} className="mt-5" />}
            <div className="mt-6">
              <CopyButton text={`${it.title}\n\n${it.content}\n\n— Jomerarte`} label="Copiar poesía" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Mis páginas */
function LinksGrid({ items }: ViewProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const p = getPlatform(it.platform);
        return (
          <article key={it.id} className="card card-hover group flex flex-col overflow-hidden">
            <SmartLink href={it.linkUrl || "#"} className="relative block aspect-video overflow-hidden">
              {it.imageUrl ? (
                <ItemImage src={it.imageUrl} alt={it.title} className="transition duration-700 group-hover:scale-105" />
              ) : (
                <div
                  className="grid h-full w-full place-items-center"
                  style={{ background: `linear-gradient(135deg, ${p?.bg ?? "var(--accent)"}, #09090b 75%)` }}
                >
                  <Globe className="h-12 w-12 text-white/60" />
                </div>
              )}
              {p && <PlatformBadge platform={it.platform} className="absolute top-3 left-3" />}
            </SmartLink>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-2xl font-bold text-white">{it.title}</h3>
              {it.subtitle && <p className="text-sm text-accent-light">{it.subtitle}</p>}
              <RichText text={it.content} className="mt-2 text-sm text-zinc-400" />
              {it.linkUrl && (
                <div className="mt-auto pt-5">
                  <SmartLink href={it.linkUrl} className="btn-primary btn-sm">
                    {it.linkLabel || "Visitar"} <ArrowUpRight className="h-3.5 w-3.5" />
                  </SmartLink>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Canciones */
function SongsList({ section, items }: ViewProps) {
  return (
    <div className="space-y-6">
      {items.map((it, idx) => {
        const p = getPlatform(it.platform);
        return (
          <article key={it.id} className="card overflow-hidden md:flex">
            <Link href={itemPath(section.path, it)} className="relative block aspect-square w-full shrink-0 md:w-64">
              <ItemImage src={it.imageUrl} alt={it.title} icon="music" label={it.title} />
            </Link>
            <div className="min-w-0 flex-1 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-brand text-sm text-accent-light">#{String(idx + 1).padStart(2, "0")}</span>
                {it.subtitle && <span className="chip">{it.subtitle}</span>}
                {it.platform && <PlatformBadge platform={it.platform} />}
              </div>
              <h3 className="mt-2 font-display text-3xl font-bold text-white">{it.title}</h3>
              {it.videoUrl && <MediaPlayer url={it.videoUrl} title={it.title} className="mt-4" />}
              {it.content && (
                <details className="group mt-4" open={idx === 0}>
                  <summary className="inline-flex items-center gap-2 text-sm font-semibold text-accent-light">
                    Ver letra <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 font-serif leading-relaxed whitespace-pre-line text-zinc-200">{it.content}</div>
                </details>
              )}
              {it.linkUrl && (
                <SmartLink href={it.linkUrl} className="btn-ghost btn-sm mt-5">
                  {it.linkLabel || `Escuchar en ${p?.label ?? "la plataforma"}`} <ArrowUpRight className="h-3.5 w-3.5" />
                </SmartLink>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ───────────────────────── CielInfier · Personajes */
function factionClass(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("cielo")) return "border-amber-300/50 bg-amber-400/15 text-amber-200";
  if (c.includes("infierno")) return "border-red-500/50 bg-red-600/20 text-red-200";
  if (c.includes("tierra")) return "border-emerald-400/50 bg-emerald-500/15 text-emerald-200";
  return "border-white/20 bg-white/10 text-zinc-200";
}

function CharactersGrid({ section, items, category, preview }: ViewProps) {
  const { categories, counts, filtered } = categorize(section, items, category);
  return (
    <div className="space-y-6">
      {!preview && <CategoryChips categories={categories} counts={counts} active={category} basePath={section.path} />}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((it) => (
          <Link
            key={it.id}
            href={itemPath(section.path, it)}
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition hover:border-accent/60"
          >
            {it.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={it.imageUrl}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="placeholder-art absolute inset-0 grid place-items-center">
                <span className="font-brand text-7xl text-white/15">{it.title.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent" />
            {it.category && (
              <span
                className={cn(
                  "absolute top-3 left-3 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase backdrop-blur",
                  factionClass(it.category),
                )}
              >
                {it.category}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <h3 className="font-display text-2xl leading-none font-bold tracking-wide text-white uppercase sm:text-3xl">
                {it.title}
              </h3>
              {it.subtitle && <p className="mt-1 text-xs text-zinc-300 sm:text-sm">{it.subtitle}</p>}
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent-light opacity-0 transition group-hover:opacity-100">
                Ver ficha <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── CielInfier · Historia */
function StoryTimeline({ section, items }: ViewProps) {
  return (
    <ol className="relative space-y-10 border-l border-accent/30 pl-6 sm:pl-10">
      {items.map((it) => (
        <li key={it.id} className="relative">
          <span className="absolute top-2 -left-[33px] h-4 w-4 rounded-full bg-accent ring-4 ring-accent/20 sm:-left-[49px]" />
          <Link href={itemPath(section.path, it)} className="card card-hover group block overflow-hidden md:flex">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden md:w-80">
              <ItemImage
                src={it.imageUrl}
                alt={it.title}
                icon="book"
                label={it.subtitle}
                className="transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col p-6">
              {it.subtitle && <p className="eyebrow">{it.subtitle}</p>}
              <h3 className="mt-1 font-display text-3xl font-bold text-white">{it.title}</h3>
              <p className="mt-3 text-zinc-400">{excerpt(it.content, 260)}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-light">
                Leer capítulo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

/* ───────────────────────── Proceso / Inventos */
function statusClass(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("termin")) return "bg-emerald-500/20 text-emerald-200";
  if (c.includes("desarrollo")) return "bg-sky-500/20 text-sky-200";
  if (c.includes("prototipo")) return "bg-amber-500/20 text-amber-200";
  return "bg-white/10 text-zinc-200";
}

function PostsGrid({ section, items, category, preview }: ViewProps) {
  const { categories, counts, filtered } = categorize(section, items, category);
  const isInvention = section.layout === "inventions";
  return (
    <div className="space-y-6">
      {!preview && <CategoryChips categories={categories} counts={counts} active={category} basePath={section.path} />}
      <div className={cn("grid gap-6 md:grid-cols-2", isInvention && "lg:grid-cols-3")}>
        {filtered.map((it) => (
          <article key={it.id} className="card card-hover group flex flex-col overflow-hidden">
            <Link href={itemPath(section.path, it)} className="relative block aspect-video overflow-hidden">
              <ItemImage
                src={it.imageUrl}
                alt={it.title}
                icon={section.icon}
                label={it.title}
                className="transition duration-700 group-hover:scale-105"
              />
              {it.category && (
                <span
                  className={cn(
                    "absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wider uppercase backdrop-blur",
                    statusClass(it.category),
                  )}
                >
                  {it.category}
                </span>
              )}
              {it.videoUrl && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white">
                  <Play className="h-3 w-3 fill-white" /> Video
                </span>
              )}
            </Link>
            <div className="flex flex-1 flex-col p-5">
              {!isInvention && (
                <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <CalendarDays className="h-3.5 w-3.5" /> {it.subtitle || formatDate(it.createdAt)}
                </p>
              )}
              <h3 className="mt-1 font-display text-2xl leading-tight font-bold text-white">{it.title}</h3>
              {isInvention && it.subtitle && <p className="text-sm text-accent-light">{it.subtitle}</p>}
              <p className="mt-2 text-sm text-zinc-400">{excerpt(it.content, 180)}</p>
              {it.gallery.length > 0 && (
                <p className="mt-2 text-xs text-zinc-500">
                  {it.gallery.length} {it.gallery.length === 1 ? "archivo" : "archivos"} en la galería
                </p>
              )}
              <Link
                href={itemPath(section.path, it)}
                className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-accent-light"
              >
                {isInvention ? "Ver invento" : "Ver avance"} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── Listas de precios */
function PricesTable({ section, items, settings }: ViewProps) {
  const groups = new Map<string, Item[]>();
  for (const it of items) {
    const k = it.category || "General";
    groups.set(k, [...(groups.get(k) ?? []), it]);
  }
  const updated = items.reduce((m, i) => (i.updatedAt > m ? i.updatedAt : m), items[0].updatedAt);
  return (
    <div className="print-plain space-y-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">Actualizado el {formatDate(updated)}</p>
        <div className="flex flex-wrap gap-2">
          <PrintButton />
          <ContactButton settings={settings} topic={section.title} label="Pedir presupuesto" />
        </div>
      </div>
      {[...groups.entries()].map(([cat, list]) => (
        <section key={cat} className="card overflow-hidden">
          <h2 className="border-b border-white/10 bg-white/5 px-5 py-3 font-display text-xl font-bold tracking-wide text-white uppercase">
            {cat}
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] tracking-widest text-zinc-500 uppercase">
              <tr>
                <th className="px-5 pt-3 pb-1 font-semibold">Detalle</th>
                <th className="hidden px-3 pt-3 pb-1 font-semibold sm:table-cell">Unidad</th>
                <th className="px-5 pt-3 pb-1 text-right font-semibold">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {list.map((it) => (
                <tr key={it.id} className="transition hover:bg-white/5">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-zinc-100">{it.title}</div>
                    {it.subtitle && <div className="text-xs text-zinc-500">{it.subtitle}</div>}
                  </td>
                  <td className="hidden px-3 py-3.5 text-zinc-400 sm:table-cell">{it.unit}</td>
                  <td className="px-5 py-3.5 text-right font-display text-lg font-bold whitespace-nowrap text-white">
                    {it.price || "Consultar"}
                    {it.unit && <div className="text-xs font-normal text-zinc-500 sm:hidden">{it.unit}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      {settings.pricesNote && <p className="text-sm text-zinc-500">* {settings.pricesNote}</p>}
    </div>
  );
}

/* ───────────────────────── Donaciones */
function DonationsList({ items }: ViewProps) {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const p = getPlatform(it.platform);
          return (
            <article key={it.id} className="card relative flex flex-col overflow-hidden p-6">
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: p?.bg ?? "var(--accent)" }} />
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-2xl font-bold text-white">{it.title}</h3>
                {p && <PlatformBadge platform={it.platform} />}
              </div>
              {it.subtitle && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-3">
                  <code className="min-w-0 flex-1 font-mono text-sm break-all text-accent-light">{it.subtitle}</code>
                  <CopyButton text={it.subtitle} />
                </div>
              )}
              <RichText text={it.content} className="mt-4 text-sm text-zinc-300" />
              {it.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.imageUrl} alt={`QR ${it.title}`} className="mx-auto mt-5 w-48 rounded-xl bg-white p-2" />
              )}
              {it.linkUrl && (
                <div className="mt-auto pt-5">
                  <SmartLink href={it.linkUrl} className="btn-primary w-full">
                    {it.linkLabel || `Donar con ${it.title}`}
                  </SmartLink>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <p className="mt-12 text-center font-display text-2xl font-semibold text-zinc-300">
        ¡Gracias por apoyar mis proyectos! <span className="text-accent-light">♥</span>
      </p>
    </div>
  );
}
