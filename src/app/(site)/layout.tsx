import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCustomPages, getPageTexts, getSettings } from "@/lib/data";
import { buildNav } from "@/lib/nav";
import { waLink } from "@/lib/format";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, pages, custom] = await Promise.all([getSettings(), getPageTexts(), getCustomPages()]);
  const nav = buildNav(
    pages,
    custom.map((c) => ({ slug: c.slug, title: c.title })),
  );
  const wa = waLink(settings.whatsapp, settings.whatsappMessage);

  return (
    <>
      <Header settings={settings} nav={nav} showDonate={pages.donacion?.visible !== false} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer settings={settings} nav={nav} />
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
          className="no-print fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-zinc-950 shadow-xl shadow-black/50 transition hover:scale-110"
        >
          <MessageCircle className="h-7 w-7" />
        </a>
      )}
    </>
  );
}
