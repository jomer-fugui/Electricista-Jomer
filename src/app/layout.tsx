import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import "@fontsource/zen-dots";
import "./globals.css";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: `${s.siteName} · ${s.tagline}`, template: `%s | ${s.siteName}` },
    description: s.heroText.slice(0, 160),
    openGraph: {
      title: s.siteName,
      description: s.heroText.slice(0, 160),
      images: s.heroImage ? [s.heroImage] : undefined,
      locale: "es",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const s = await getSettings();
  const accent = /^#[0-9a-f]{3,8}$/i.test(s.accentColor) ? s.accentColor : "#b3121f";
  return (
    <html lang="es" style={{ "--accent": accent } as CSSProperties}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
