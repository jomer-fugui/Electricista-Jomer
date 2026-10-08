import Link from "next/link";
import { ArrowRight, ChevronDown, Heart, Laugh, Quote } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getFeatured, getItems, getPageTexts, getRandomItem, getSettings } from "@/lib/data";
import { excerpt } from "@/lib/format";
import { PLATFORMS } from "@/lib/platforms";
import { SECTIONS, getPageDef, getSection, type SectionDef } from "@/lib/sections";
import { SiteLogo } from "@/components/Logo";
import { Icon } from "@/components/icons";
import { AdminFab, ContactButton, ItemImage, PlatformBadge, RichText, SectionHeading } from "@/components/ui";
import { itemPath } from "@/components/views/SectionView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, pages, featured, frase, colmo, characters, inventos, admin] = await Promise.all([
    getSettings(),
    getPageTexts(),
    getFeatured(8),
    getRandomItem("frases"),
    getRandomItem("colmos"),
    getItems("cielinfier-personajes", { limit: 4 }),
    getItems("inventos", { limit: 3 }),
    isAdmin(),
  ]);
  const vis = (k: string) => pages[k]?.visible !== false;
  const services = ["electricista", "camaras", "web", "cursos"]
    .filter(vis)
    .map((k) => getSection(k))
    .filter((s): s is SectionDef => Boolean(s));
  const storeKids = ["tienda-electricidad", "tienda-mercadolibre", "tienda-virtuales", "tienda-otras"].filter(vis);
  const explore = [
    "recomendacion",
    "truchadas",
    "frases",
    "poesias",
    "colmos",
    "mis-paginas",
    "canciones",
    "inventos",
    "precios-servicios",
    "precios-productos",
    "donacion",
  ].filter(vis);
  const ciel = pages["cielinfier-personajes"];
  const storePlatforms = PLATFORMS.filter((p) =>
    ["mercadolibre", "hotmart", "aliexpress", "amazon", "temu", "udemy"].includes(p.key),
  );

  return (
    <>
      {/* ─────────── HERO */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        {settings.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/30 via-zinc-950/60 to-zinc-950" />
        <div className="container-x grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">{settings.tagline}</p>
            <h1 className="mt-5 font-brand text-5xl leading-none text-white text-glow sm:text-7xl xl:text-8xl">
              {settings.siteName.toUpperCase()}
            </h1>
            <h2 className="mt-6 max-w-2xl font-display text-2xl leading-tight font-semibold text-zinc-100 sm:text-3xl">
              {settings.heroTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-300">{settings.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/Servicios" className="btn-primary px-6 py-3">
                Ver servicios <ArrowRight className="h-4 w-4" />
              </Link>
              <ContactButton settings={settings} label="Escríbeme" className="px-6 py-3" />
              <Link href="/Tienda" className="btn-ghost px-6 py-3">
                Tienda
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {services.map((s) => (
                <Link key={s.key} href={s.path} className="chip hover:border-accent hover:text-white">
                  <Icon name={s.icon} className="h-3.5 w-3.5 text-accent-light" /> {pages[s.key].navLabel}
                </Link>
              ))}
              {vis("cielinfier-personajes") && (
                <Link href="/Cielinfier" className="chip hover:border-accent hover:text-white">
                  <Icon name="flame" className="h-3.5 w-3.5 text-accent-light" /> CielInfier
                </Link>
              )}
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
            <div className="absolute inset-[10%] animate-glow rounded-full bg-accent/40 blur-3xl" />
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/15" />
            <div className="absolute inset-[5%] rounded-full border border-accent/30" />
            <div className="relative h-full w-full animate-float p-[9%]">
              <SiteLogo settings={settings} prefer="light" className="h-full w-full" idPrefix="hero" />
            </div>
            <span className="vertical-text absolute top-1/2 -right-6 hidden -translate-y-1/2 font-brand text-xs tracking-[0.5em] text-white/25 sm:block">
              ジョメル・ワークス
            </span>
          </div>
        </div>
      </section>

      {/* ─────────── SERVICIOS */}
      {services.length > 0 && (
        <section className="container-x py-20">
          <SectionHeading eyebrow="Servicios" title="¿En qué te puedo ayudar?" href="/Servicios" linkLabel="Todos los servicios" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => {
              const t = pages[s.key];
              return (
                <Link key={s.key} href={s.path} className="card card-hover group flex flex-col overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ItemImage
                      src={t.imageUrl}
                      alt={t.title}
                      icon={s.icon}
                      className="transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 to-transparent" />
                    <span className="absolute bottom-3 left-3 grid h-11 w-11 place-items-center rounded-xl bg-accent text-white shadow-lg shadow-accent/30">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-xl leading-tight font-bold text-white">{t.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400">{excerpt(t.intro, 110)}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-accent-light">
                      Ver más <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ─────────── DESTACADOS */}
      {featured.length > 0 && (
        <section className="container-x pb-20">
          <SectionHeading eyebrow="Destacados" title="Lo más buscado" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((it) => {
              const sec = SECTIONS.find((s) => s.key === it.section);
              if (!sec || !vis(sec.key)) return null;
              const href = sec.detail ? itemPath(sec.path, it) : sec.path;
              return (
                <Link key={it.id} href={href} className="card card-hover group flex flex-col overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <ItemImage
                      src={it.imageUrl}
                      alt={it.title}
                      icon={sec.icon}
                      label={it.title}
                      className="transition duration-700 group-hover:scale-105"
                    />
                    {it.platform && <PlatformBadge platform={it.platform} className="absolute top-3 left-3" />}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold tracking-widest text-accent-light uppercase">
                      {pages[sec.key].navLabel}
                    </p>
                    <h3 className="mt-1 font-display text-xl leading-tight font-bold text-white">{it.title}</h3>
                    {it.subtitle && <p className="mt-1 text-sm text-zinc-400">{excerpt(it.subtitle, 80)}</p>}
                    {it.price && <p className="mt-auto pt-3 font-display text-lg font-bold text-white">{it.price}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ─────────── TIENDA */}
      {vis("tienda") && (
        <section className="container-x pb-20">
          <div className="card grid overflow-hidden lg:grid-cols-2">
            <div className="relative min-h-64">
              <ItemImage src={pages.tienda.imageUrl} alt="Tienda" icon="store" className="absolute inset-0" />
              <div className="absolute inset-0 bg-linear-to-r from-transparent to-zinc-900/80 max-lg:bg-linear-to-t" />
            </div>
            <div className="p-8 sm:p-10">
              <p className="eyebrow">Tienda</p>
              <h2 className="h-section mt-2">{pages.tienda.title}</h2>
              <p className="mt-4 text-zinc-300">{excerpt(pages.tienda.intro, 220)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {storePlatforms.map((p) => (
                  <PlatformBadge key={p.key} platform={p.key} />
                ))}
              </div>
              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {storeKids.map((k) => {
                  const def = getPageDef(k);
                  if (!def) return null;
                  return (
                    <Link
                      key={k}
                      href={def.path}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-accent/60 hover:text-white"
                    >
                      <Icon name={def.icon} className="h-4 w-4 text-accent-light" />
                      <span className="flex-1">{pages[k].navLabel}</span>
                      <ArrowRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-1" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─────────── CIELINFIER */}
      {vis("cielinfier-personajes") && (
        <section className="relative isolate overflow-hidden border-y border-white/10">
          {ciel.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ciel.imageUrl} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
          )}
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
          <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Anime · Videojuego en desarrollo</p>
              <h2 className="mt-3 font-brand text-5xl text-white text-glow sm:text-6xl">CielInfier</h2>
              <p className="mt-5 max-w-xl text-lg text-zinc-300">{excerpt(ciel.intro, 240)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/Cielinfier" className="btn-primary">
                  Personajes
                </Link>
                {vis("cielinfier-historia") && (
                  <Link href="/Cielinfier/historia" className="btn-ghost">
                    Historia
                  </Link>
                )}
                {vis("cielinfier-proceso") && (
                  <Link href="/Cielinfier/proceso" className="btn-ghost">
                    Proceso del proyecto
                  </Link>
                )}
              </div>
            </div>
            {characters.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {characters.slice(0, 4).map((c, i) => (
                  <Link
                    key={c.id}
                    href={itemPath("/Cielinfier", c)}
                    className={`group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 ${
                      i % 2 === 1 ? "translate-y-6" : ""
                    }`}
                  >
                    {c.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="placeholder-art absolute inset-0 grid place-items-center">
                        <span className="font-brand text-6xl text-white/15">{c.title.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-display text-2xl font-bold text-white uppercase">{c.title}</p>
                      {c.subtitle && <p className="text-xs text-zinc-300">{c.subtitle}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─────────── FRASE + COLMO */}
      {(frase || colmo) && (
        <section className="container-x grid gap-6 py-20 lg:grid-cols-3">
          {frase && vis("frases") && (
            <figure className="card relative overflow-hidden p-8 sm:p-10 lg:col-span-2">
              <Quote className="absolute -top-4 -right-4 h-40 w-40 text-white/[0.04]" />
              <p className="eyebrow">Frase de un Herje</p>
              <blockquote className="mt-4 font-display text-3xl leading-tight font-bold text-white sm:text-4xl">
                “{frase.content}”
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-center gap-3">
                {frase.category && <span className="chip">{frase.category}</span>}
                <Link href="/Frases" className="inline-flex items-center gap-1 text-sm font-semibold text-accent-light hover:text-white">
                  Leer todas las frases <ArrowRight className="h-4 w-4" />
                </Link>
              </figcaption>
            </figure>
          )}
          {colmo && vis("colmos") && (
            <details className="card group p-8">
              <summary>
                <Laugh className="h-8 w-8 text-accent-light" />
                <p className="eyebrow mt-4">Colmo del día</p>
                <p className="mt-3 font-display text-2xl leading-tight font-bold text-white">{colmo.title}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-zinc-400 group-open:hidden">
                  Ver respuesta <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <p className="mt-4 border-t border-white/10 pt-4 text-lg font-medium text-accent-light">{colmo.content}</p>
              <Link href="/Frases/Colmos" className="mt-4 inline-flex text-sm font-semibold text-zinc-300 hover:text-white">
                Más colmos →
              </Link>
            </details>
          )}
        </section>
      )}

      {/* ─────────── INVENTOS */}
      {inventos.length > 0 && vis("inventos") && (
        <section className="container-x pb-20">
          <SectionHeading eyebrow="Inventos" title={pages.inventos.title} href="/inventos" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {inventos.map((it) => (
              <Link key={it.id} href={itemPath("/inventos", it)} className="card card-hover group overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <ItemImage
                    src={it.imageUrl}
                    alt={it.title}
                    icon="lightbulb"
                    label={it.title}
                    className="transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  {it.category && <span className="chip">{it.category}</span>}
                  <h3 className="mt-2 font-display text-xl font-bold text-white">{it.title}</h3>
                  {it.subtitle && <p className="text-sm text-zinc-400">{it.subtitle}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─────────── EXPLORA */}
      <section className="container-x pb-20">
        <SectionHeading eyebrow="Explora" title="Todo Jomerarte" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {explore.map((k) => {
            const def = getPageDef(k);
            if (!def) return null;
            return (
              <Link
                key={k}
                href={def.path}
                className="card card-hover group flex flex-col items-start gap-3 p-5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent-light transition group-hover:bg-accent group-hover:text-white">
                  <Icon name={def.icon} className="h-5 w-5" />
                </span>
                <span className="font-display text-lg leading-tight font-bold text-white">{pages[k].navLabel}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─────────── SOBRE MÍ */}
      <section className="container-x pb-20">
        <div className="card grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[18rem_1fr]">
          <div className="mx-auto w-56 lg:w-full">
            {settings.aboutImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.aboutImage} alt={settings.aboutTitle} className="aspect-square w-full rounded-2xl object-cover" />
            ) : (
              <SiteLogo settings={settings} prefer="light" className="aspect-square w-full" idPrefix="about" />
            )}
          </div>
          <div>
            <p className="eyebrow">Sobre mí</p>
            <h2 className="h-section mt-2">{settings.aboutTitle}</h2>
            <RichText text={settings.aboutText} className="mt-5 text-lg text-zinc-300" />
            <div className="mt-7 flex flex-wrap gap-3">
              <ContactButton settings={settings} label="Contactar" />
              <Link href="/PreciosServicios" className="btn-ghost">
                Ver precios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── DONACIÓN */}
      {vis("donacion") && (
        <section className="container-x pb-8">
          <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-linear-to-br from-accent/30 via-zinc-900 to-zinc-950 p-10 text-center sm:p-14">
            <Heart className="mx-auto h-10 w-10 fill-accent text-accent" />
            <h2 className="h-section mt-4">{pages.donacion.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-300">{excerpt(pages.donacion.intro, 220)}</p>
            <Link href="/Donacion" className="btn-primary mt-8 px-8 py-3">
              Quiero donar
            </Link>
          </div>
        </section>
      )}

      {admin && <AdminFab href="/admin/ajustes" label="Editar portada" />}
    </>
  );
}
