import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Settings } from "@/lib/defaults";
import type { NavGroup } from "@/lib/nav";
import { waLink } from "@/lib/format";
import { SiteLogo } from "./Logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, XIcon, YoutubeIcon } from "./icons";

export function Footer({ settings, nav }: { settings: Settings; nav: NavGroup[] }) {
  const socials = [
    { url: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { url: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { url: settings.youtube, label: "YouTube", Icon: YoutubeIcon },
    { url: settings.tiktok, label: "TikTok", Icon: TiktokIcon },
    { url: settings.twitter, label: "X", Icon: XIcon },
  ].filter((s) => s.url);
  const wa = waLink(settings.whatsapp, settings.whatsappMessage);
  const year = new Date().getFullYear();

  return (
    <footer className="no-print relative mt-24 border-t border-white/10 bg-black/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent to-transparent" />
      <div className="container-x grid gap-12 py-14 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <SiteLogo settings={settings} prefer="light" className="h-16 w-16" idPrefix="ftr" />
            <div>
              <div className="font-brand text-xl tracking-[0.2em] text-white">{settings.siteName.toUpperCase()}</div>
              <div className="text-xs text-zinc-400">{settings.tagline}</div>
            </div>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-400">{settings.footerText}</p>
          <ul className="mt-5 space-y-2 text-sm text-zinc-300">
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                  <MessageCircle className="h-4 w-4 text-emerald-400" /> WhatsApp
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4 text-accent-light" /> {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Mail className="h-4 w-4 text-accent-light" /> {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-light" /> {settings.address}
              </li>
            )}
            {settings.hours && (
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-light" /> {settings.hours}
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ url, label, Icon }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:border-accent hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {nav.map((g) => (
            <div key={g.key}>
              <h4 className="font-display text-sm font-bold tracking-[0.2em] text-white uppercase">{g.label}</h4>
              <ul className="mt-3 space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-zinc-400 transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-zinc-500 sm:flex-row">
          <span>
            © {year} {settings.siteName} · Jomer Works. Todos los derechos reservados.
          </span>
          <Link href="/admin" className="hover:text-zinc-300">
            Administrar sitio
          </Link>
        </div>
      </div>
    </footer>
  );
}
