import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ChevronRight, ExternalLink, Mail, MessageCircle, Pencil, Plus, Sparkles, Star } from "lucide-react";
import type { Settings } from "@/lib/defaults";
import type { PageText } from "@/lib/data";
import { cn, isExternal, richTextToHtml, waLink } from "@/lib/format";
import { getPlatform } from "@/lib/platforms";
import { getPageDef, type IconName } from "@/lib/sections";
import { Icon } from "./icons";

export function RichText({ text, className }: { text: string; className?: string }) {
  const html = richTextToHtml(text);
  if (!html) return null;
  return <div className={cn("rich", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function SmartLink({
  href,
  className,
  children,
  title,
  style,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
}) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={className} title={title} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} title={title} style={style}>
      {children}
    </Link>
  );
}

export function PlatformBadge({ platform, className }: { platform: string; className?: string }) {
  const p = getPlatform(platform);
  if (!p) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide whitespace-nowrap uppercase shadow",
        className,
      )}
      style={{ background: p.bg, color: p.fg }}
    >
      {p.label}
    </span>
  );
}

/** Botón de compra con los colores de la plataforma (Mercado Libre, Hotmart, AliExpress…) */
export function BuyButton({
  url,
  platform,
  label,
  className,
}: {
  url: string;
  platform: string;
  label?: string;
  className?: string;
}) {
  const p = getPlatform(platform);
  const own = !p || p.key === "propio" || p.key === "web" || p.key === "otro";
  const text = label || (own ? "Ver producto" : `Comprar en ${p.label}`);
  return (
    <SmartLink
      href={url}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition hover:brightness-110",
        className,
      )}
      style={own ? { background: "var(--accent)", color: "#fff" } : { background: p.bg, color: p.fg }}
    >
      {text}
      <ExternalLink className="h-3.5 w-3.5" />
    </SmartLink>
  );
}

export function Stars({ value, bad = false }: { value: number; bad?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} de 5`} title={`${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-4 w-4",
            n <= value ? (bad ? "fill-red-500 text-red-500" : "fill-amber-400 text-amber-400") : "text-zinc-700",
          )}
        />
      ))}
    </div>
  );
}

/** Botón “Consultar”: WhatsApp si está configurado, si no email. */
export function ContactButton({
  settings,
  topic,
  label = "Consultar",
  className,
}: {
  settings: Settings;
  topic?: string;
  label?: string;
  className?: string;
}) {
  const msg = `${settings.whatsappMessage}${topic ? `: ${topic}` : ""}`.trim();
  const wa = waLink(settings.whatsapp, msg);
  if (wa) {
    return (
      <a href={wa} target="_blank" rel="noopener noreferrer" className={cn("btn-wa", className)}>
        <MessageCircle className="h-4 w-4" />
        {label}
      </a>
    );
  }
  if (settings.email) {
    const subject = topic ? `Consulta: ${topic}` : `Consulta desde ${settings.siteName}`;
    return (
      <a href={`mailto:${settings.email}?subject=${encodeURIComponent(subject)}`} className={cn("btn-ghost", className)}>
        <Mail className="h-4 w-4" />
        {label}
      </a>
    );
  }
  return null;
}

export function PriceTag({ price, unit, className }: { price: string; unit?: string; className?: string }) {
  if (!price) return null;
  return (
    <div className={className}>
      <div className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">Precio</div>
      <div className="font-display text-2xl leading-tight font-bold text-white">{price}</div>
      {unit && <div className="text-xs text-zinc-400">{unit}</div>}
    </div>
  );
}

export function ItemImage({
  src,
  alt,
  icon = "sparkles",
  className,
  label,
}: {
  src?: string;
  alt: string;
  icon?: IconName;
  className?: string;
  label?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div className={cn("placeholder-art relative grid h-full w-full place-items-center overflow-hidden", className)}>
      <Icon name={icon} className="h-12 w-12 text-white/25" />
      {label && (
        <span className="absolute inset-x-3 bottom-3 truncate text-center font-brand text-[10px] tracking-[0.3em] text-white/25 uppercase">
          {label}
        </span>
      )}
    </div>
  );
}

export function PageHero({
  title,
  intro,
  image,
  icon,
  eyebrow,
  crumbs,
  tone = "default",
  children,
}: {
  title: string;
  intro?: string;
  image?: string;
  icon?: IconName;
  eyebrow?: string;
  crumbs?: { href: string; label: string }[];
  tone?: "default" | "danger";
  children?: ReactNode;
}) {
  const danger = tone === "danger";
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/50 via-zinc-950/75 to-zinc-950" />
      <div
        className={cn(
          "absolute -top-24 -right-24 -z-10 h-80 w-80 rounded-full blur-3xl",
          danger ? "bg-red-600/25" : "bg-accent/25",
        )}
      />
      {danger && (
        <div
          className="absolute inset-x-0 top-0 h-1.5 opacity-80"
          style={{ background: "repeating-linear-gradient(45deg,#facc15 0 12px,#09090b 12px 24px)" }}
        />
      )}
      <div className="container-x py-14 sm:py-20">
        {crumbs && crumbs.length > 0 && (
          <nav className="mb-5 flex flex-wrap items-center gap-1 text-xs text-zinc-400" aria-label="Migas de pan">
            {crumbs.map((c) => (
              <span key={c.href} className="inline-flex items-center gap-1">
                <Link href={c.href} className="hover:text-white">
                  {c.label}
                </Link>
                <ChevronRight className="h-3 w-3" />
              </span>
            ))}
            <span className="text-zinc-300">{title}</span>
          </nav>
        )}
        <div className="flex items-center gap-3">
          {icon && (
            <span
              className={cn(
                "grid h-11 w-11 place-items-center rounded-xl ring-1",
                danger ? "bg-red-500/15 text-red-300 ring-red-500/40" : "bg-accent/15 text-accent-light ring-accent/40",
              )}
            >
              <Icon name={icon} className="h-5 w-5" />
            </span>
          )}
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-[1.05] font-bold tracking-wide text-white uppercase sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {intro && <RichText text={intro} className="mt-5 max-w-3xl text-lg text-zinc-300" />}
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function SubNav({ keys, current, pages }: { keys: string[]; current: string; pages: Record<string, PageText> }) {
  const visible = keys.filter((k) => pages[k]?.visible !== false);
  if (visible.length < 2) return null;
  return (
    <div className="no-print sticky top-16 z-30 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="container-x no-scrollbar flex gap-2 overflow-x-auto py-3">
        {visible.map((k) => {
          const def = getPageDef(k);
          if (!def) return null;
          const active = k === current;
          const label = def.hub ? def.allLabel : pages[k]?.navLabel || def.navLabel;
          return (
            <Link
              key={k}
              href={def.path}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition",
                active ? "bg-accent text-white shadow-lg shadow-accent/25" : "bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function CategoryChips({
  categories,
  active,
  basePath,
  counts,
}: {
  categories: string[];
  active?: string;
  basePath: string;
  counts?: Record<string, number>;
}) {
  if (categories.length < 2) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <Link href={basePath} scroll={false} className={cn("chip hover:border-white/30", !active && "chip-active")}>
        Todas
      </Link>
      {categories.map((c) => (
        <Link
          key={c}
          href={`${basePath}?cat=${encodeURIComponent(c)}`}
          scroll={false}
          className={cn("chip hover:border-white/30", active === c && "chip-active")}
        >
          {c}
          {counts?.[c] ? <span className="opacity-60">{counts[c]}</span> : null}
        </Link>
      ))}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "Ver todo",
  className,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="h-section mt-2">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-light hover:text-white">
          {linkLabel} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export function EmptyState({ label, adminHref }: { label: string; adminHref?: string }) {
  return (
    <div className="card grid place-items-center gap-3 px-6 py-16 text-center">
      <Sparkles className="h-10 w-10 text-accent-light" />
      <p className="font-display text-2xl font-bold text-white uppercase">Próximamente</p>
      <p className="max-w-md text-zinc-400">Todavía no hay contenido publicado en esta sección. ¡Vuelve pronto!</p>
      {adminHref && (
        <Link href={adminHref} className="btn-primary mt-2">
          <Plus className="h-4 w-4" /> Agregar {label}
        </Link>
      )}
    </div>
  );
}

export function AdminFab({ href, label = "Editar esta sección" }: { href: string; label?: string }) {
  return (
    <div className="no-print fixed bottom-5 left-5 z-40 flex gap-2">
      <Link href={href} className="btn-primary shadow-2xl">
        <Pencil className="h-4 w-4" /> {label}
      </Link>
      <Link href="/admin" className="btn-ghost bg-zinc-900/90 backdrop-blur">
        Panel
      </Link>
    </div>
  );
}
