import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, Image as ImageIcon, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import { SiteLogo } from "@/components/Logo";
import { logoutAction } from "../actions";

export const metadata: Metadata = { title: "Panel de administración", robots: { index: false, follow: false } };

export default async function PanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <SiteLogo settings={settings} className="h-9 w-9" idPrefix="adm" />
            <span className="hidden font-brand text-sm tracking-[0.2em] text-white sm:inline">PANEL</span>
          </Link>
          <nav className="ml-auto flex items-center gap-0.5">
            <Link href="/admin" className="navlink inline-flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">Contenido</span>
            </Link>
            <Link href="/admin/ajustes" className="navlink inline-flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Ajustes y logo</span>
            </Link>
            <Link href="/admin/medios" className="navlink inline-flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden md:inline">Archivos</span>
            </Link>
            <Link href="/" target="_blank" className="navlink inline-flex items-center gap-1.5">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden md:inline">Ver sitio</span>
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="navlink inline-flex items-center gap-1.5">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Salir</span>
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
