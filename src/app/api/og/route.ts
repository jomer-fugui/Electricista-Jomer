import { isAdmin } from "@/lib/auth";
import { detectPlatform } from "@/lib/platforms";

export const dynamic = "force-dynamic";

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_m, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .trim();
}

function formatPrice(raw: string): string {
  const n = Number(raw.replace(/,/g, "."));
  if (!Number.isFinite(n)) return raw;
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(n);
}

/** Lee título, imagen, descripción y precio de un enlace (Mercado Libre, Hotmart, AliExpress…) */
export async function GET(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "No autorizado" }, { status: 401 });
  const url = new URL(req.url).searchParams.get("url") ?? "";
  if (!/^https?:\/\//i.test(url)) return Response.json({ error: "Enlace inválido" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const html = (await res.text()).slice(0, 800_000);
    const meta: Record<string, string> = {};
    for (const tag of html.match(/<meta\s[^>]*>/gi) ?? []) {
      const attrs: Record<string, string> = {};
      for (const a of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
        attrs[a[1].toLowerCase()] = a[3] ?? a[4] ?? "";
      }
      const key = (attrs.property || attrs.name || attrs.itemprop || "").toLowerCase();
      if (key && attrs.content && !meta[key]) meta[key] = decode(attrs.content);
    }
    const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    let price = meta["product:price:amount"] || meta["og:price:amount"] || meta["price"] || "";
    if (!price) {
      const m = html.match(/"price"\s*:\s*"?(\d[\d.,]*)"?/);
      if (m) price = m[1];
    }
    const currency = meta["product:price:currency"] || meta["og:price:currency"] || meta["pricecurrency"] || "";
    let image = meta["og:image"] || meta["og:image:url"] || meta["og:image:secure_url"] || meta["twitter:image"] || "";
    if (image.startsWith("//")) image = `https:${image}`;
    else if (image.startsWith("/")) image = new URL(image, res.url || url).toString();
    const finalUrl = res.url || url;

    return Response.json({
      title: meta["og:title"] || meta["twitter:title"] || (titleTag ? decode(titleTag) : ""),
      description: meta["og:description"] || meta["description"] || meta["twitter:description"] || "",
      image,
      price: price ? `${currency && currency !== "ARS" ? `${currency} ` : "$ "}${formatPrice(price)}` : "",
      platform: detectPlatform(finalUrl),
    });
  } catch {
    return Response.json({ error: "No se pudo leer el enlace. Completa los datos a mano." }, { status: 502 });
  }
}
