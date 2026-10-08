import { NextResponse, type NextRequest } from "next/server";

/**
 * Subdominios:
 *  - frases.jomerarte.com      → /Frases      (frases.jomerarte.com/Colmos → /Frases/Colmos)
 *  - cielinfier.jomerarte.com  → /Cielinfier  (cielinfier.jomerarte.com/historia → /Cielinfier/historia)
 * Requiere configurar los subdominios en el DNS apuntando al mismo servidor.
 */
const SUBDOMAINS: Record<string, string> = {
  frases: "/Frases",
  cielinfier: "/Cielinfier",
};

const TOP_LEVEL = new Set([
  "servicios",
  "cursos",
  "tienda",
  "recomendacion",
  "recomendaciones",
  "paginas",
  "truchadas",
  "frases",
  "mispaginas",
  "cancionesjomer",
  "cielinfier",
  "inventos",
  "preciosservicios",
  "preciosproductos",
  "donacion",
  "admin",
]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();
  const parts = host.split(".");
  const prefix = parts.length >= 2 ? SUBDOMAINS[parts[0]] : undefined;
  if (!prefix) return NextResponse.next();

  const url = request.nextUrl.clone();
  const first = (url.pathname.split("/")[1] || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (first && TOP_LEVEL.has(first)) return NextResponse.next();

  url.pathname = prefix + (url.pathname === "/" ? "" : url.pathname);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|icon.svg|.*\\..*).*)"],
};
