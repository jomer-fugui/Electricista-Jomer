"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, House, Menu, X } from "lucide-react";
import type { NavGroup } from "@/lib/nav";
import { cn } from "@/lib/format";
import { Icon } from "./icons";

export function MobileNav({ nav, showDonate }: { nav: NavGroup[]; showDonate: boolean }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-white xl:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Cerrar menú" onClick={close} />
          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-white/10 bg-zinc-950">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <span className="font-brand tracking-[0.2em] text-white">MENÚ</span>
              <button
                type="button"
                onClick={close}
                className="grid h-10 w-10 place-items-center rounded-lg bg-white/5 text-white"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <Link href="/" onClick={close} className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-white hover:bg-white/5">
                <House className="h-5 w-5 text-accent-light" /> Inicio
              </Link>
              {nav.map((g) => {
                const isOpen = expanded === g.key;
                return (
                  <div key={g.key} className="border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : g.key)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-white hover:bg-white/5"
                      aria-expanded={isOpen}
                    >
                      <Icon name={g.icon} className="h-5 w-5 text-accent-light" />
                      <span className="flex-1">{g.label}</span>
                      <ChevronDown className={cn("h-4 w-4 transition", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <div className="mb-2 ml-4 border-l border-white/10 pl-3">
                        {g.links.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            onClick={close}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                          >
                            <Icon name={l.icon} className="h-4 w-4 text-zinc-500" />
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {showDonate && (
              <div className="border-t border-white/10 p-4">
                <Link href="/Donacion" onClick={close} className="btn-primary w-full">
                  <Heart className="h-4 w-4" /> Donar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
