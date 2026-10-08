import Link from "next/link";
import { ChevronDown, Heart } from "lucide-react";
import type { Settings } from "@/lib/defaults";
import type { NavGroup } from "@/lib/nav";
import { cn } from "@/lib/format";
import { SiteLogo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { Icon } from "./icons";

export function Header({ settings, nav, showDonate }: { settings: Settings; nav: NavGroup[]; showDonate: boolean }) {
  return (
    <header className="no-print sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${settings.siteName} – Inicio`}>
          <SiteLogo settings={settings} className="h-11 w-11" idPrefix="hdr" />
          <span className="font-brand text-base tracking-[0.18em] text-white sm:text-lg">
            {settings.siteName.toUpperCase()}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center xl:flex" aria-label="Principal">
          <Link href="/" className="navlink">
            Inicio
          </Link>
          {nav.map((g, i) => (
            <div key={g.key} className="group relative">
              <button type="button" className="navlink inline-flex items-center gap-1" aria-haspopup="true">
                {g.label}
                <ChevronDown className="h-3.5 w-3.5 opacity-60 transition group-hover:rotate-180" />
              </button>
              <div
                className={cn(
                  "invisible absolute top-full z-50 w-72 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100",
                  i >= nav.length - 2 ? "right-0" : "left-0",
                )}
              >
                <div className="rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/15 text-accent-light">
                        <Icon name={l.icon} className="h-4 w-4" />
                      </span>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {showDonate && (
          <Link href="/Donacion" className="btn-primary ml-2 hidden xl:inline-flex">
            <Heart className="h-4 w-4" /> Donar
          </Link>
        )}
        <MobileNav nav={nav} showDonate={showDonate} />
      </div>
    </header>
  );
}
