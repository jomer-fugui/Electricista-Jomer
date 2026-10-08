export interface PlatformDef {
  key: string;
  label: string;
  bg: string;
  fg: string;
  domains: string[];
}

export const PLATFORMS: PlatformDef[] = [
  { key: "propio", label: "Jomerarte", bg: "var(--accent)", fg: "#ffffff", domains: ["jomerarte.com"] },
  { key: "mercadolibre", label: "Mercado Libre", bg: "#FFE600", fg: "#2D3277", domains: ["mercadolibre", "mercadolivre", "meli.la", "mercadoli.br"] },
  { key: "mercadopago", label: "Mercado Pago", bg: "#00B1EA", fg: "#ffffff", domains: ["mercadopago", "mpago.la", "link.mercadopago"] },
  { key: "hotmart", label: "Hotmart", bg: "#F04E23", fg: "#ffffff", domains: ["hotmart", "hotm.art"] },
  { key: "aliexpress", label: "AliExpress", bg: "#E62E04", fg: "#ffffff", domains: ["aliexpress", "s.click.ali", "a.aliexpress"] },
  { key: "amazon", label: "Amazon", bg: "#FF9900", fg: "#111111", domains: ["amazon.", "amzn."] },
  { key: "temu", label: "Temu", bg: "#FB7701", fg: "#ffffff", domains: ["temu.com"] },
  { key: "shein", label: "Shein", bg: "#111111", fg: "#ffffff", domains: ["shein."] },
  { key: "shopee", label: "Shopee", bg: "#EE4D2D", fg: "#ffffff", domains: ["shopee."] },
  { key: "ebay", label: "eBay", bg: "#0064D2", fg: "#ffffff", domains: ["ebay."] },
  { key: "etsy", label: "Etsy", bg: "#F1641E", fg: "#ffffff", domains: ["etsy."] },
  { key: "udemy", label: "Udemy", bg: "#A435F0", fg: "#ffffff", domains: ["udemy."] },
  { key: "gumroad", label: "Gumroad", bg: "#FF90E8", fg: "#111111", domains: ["gumroad."] },
  { key: "paypal", label: "PayPal", bg: "#003087", fg: "#ffffff", domains: ["paypal."] },
  { key: "cafecito", label: "Cafecito", bg: "#6F4E37", fg: "#ffffff", domains: ["cafecito.app"] },
  { key: "kofi", label: "Ko-fi", bg: "#29ABE0", fg: "#ffffff", domains: ["ko-fi.com"] },
  { key: "patreon", label: "Patreon", bg: "#FF424D", fg: "#ffffff", domains: ["patreon."] },
  { key: "binance", label: "Binance", bg: "#F3BA2F", fg: "#111111", domains: ["binance."] },
  { key: "youtube", label: "YouTube", bg: "#FF0000", fg: "#ffffff", domains: ["youtube.", "youtu.be"] },
  { key: "instagram", label: "Instagram", bg: "#E1306C", fg: "#ffffff", domains: ["instagram."] },
  { key: "tiktok", label: "TikTok", bg: "#111111", fg: "#ffffff", domains: ["tiktok."] },
  { key: "facebook", label: "Facebook", bg: "#1877F2", fg: "#ffffff", domains: ["facebook.", "fb.com", "fb.me"] },
  { key: "spotify", label: "Spotify", bg: "#1DB954", fg: "#111111", domains: ["spotify."] },
  { key: "whatsapp", label: "WhatsApp", bg: "#25D366", fg: "#0b141a", domains: ["wa.me", "whatsapp."] },
  { key: "web", label: "Sitio web", bg: "#3f3f46", fg: "#ffffff", domains: [] },
  { key: "otro", label: "Otra plataforma", bg: "#3f3f46", fg: "#ffffff", domains: [] },
];

export function getPlatform(key: string | null | undefined): PlatformDef | undefined {
  if (!key) return undefined;
  return PLATFORMS.find((p) => p.key === key);
}

/** Detecta la plataforma a partir de un enlace (mercadolibre, hotmart, aliexpress, etc.) */
export function detectPlatform(url: string): string {
  if (!url) return "";
  if (url.startsWith("/")) return "propio";
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
  for (const p of PLATFORMS) {
    if (p.domains.some((d) => host.includes(d))) return p.key;
  }
  return "web";
}
