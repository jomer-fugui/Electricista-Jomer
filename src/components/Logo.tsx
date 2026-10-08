import type { Settings } from "@/lib/defaults";
import { cn } from "@/lib/format";

/** Recreación en SVG del logo “JOMER WORKS”. Puedes reemplazarlo subiendo tu logo en /admin/ajustes */
export function LogoMark({ className, idPrefix = "jw" }: { className?: string; idPrefix?: string }) {
  const top = `${idPrefix}-top`;
  const bottom = `${idPrefix}-bottom`;
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="Jomer Works">
      <defs>
        <path id={top} d="M 40 122 A 80 80 0 0 1 200 122" />
        <path id={bottom} d="M 15 122 A 105 105 0 0 0 225 122" />
      </defs>
      <circle cx="120" cy="122" r="58" fill="#7a0d14" stroke="#050505" strokeWidth="5" />
      <g fill="#f4f4f5" stroke="#050505" strokeWidth="3.5" strokeLinejoin="round">
        <path d="M120 168 C86 164 70 120 92 76 C92 112 100 142 120 152 Z" />
        <path d="M120 168 C154 164 170 120 148 76 C148 112 140 142 120 152 Z" />
        <path d="M100 146 C96 166 114 174 120 163 C126 174 144 166 140 146 C130 155 110 155 100 146 Z" />
      </g>
      <path
        d="M120 150 C117 130 108 118 100 110"
        fill="none"
        stroke="#050505"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M92 100 L107 103 L98 115 Z" fill="#7a0d14" stroke="#050505" strokeWidth="3" strokeLinejoin="round" />
      <g
        fontFamily="'Zen Dots', ui-sans-serif, system-ui, sans-serif"
        fontSize="33"
        fill="#7c7c82"
        stroke="#050505"
        strokeWidth="1.4"
        paintOrder="stroke"
        letterSpacing="8"
      >
        <text textAnchor="middle">
          <textPath href={`#${top}`} startOffset="50%">
            JOMER
          </textPath>
        </text>
        <text textAnchor="middle">
          <textPath href={`#${bottom}`} startOffset="50%">
            WORKS
          </textPath>
        </text>
      </g>
      <circle cx="27" cy="122" r="6.5" fill="#7c7c82" stroke="#050505" strokeWidth="2" />
      <circle cx="213" cy="122" r="6.5" fill="#7c7c82" stroke="#050505" strokeWidth="2" />
    </svg>
  );
}

/**
 * Logo del sitio:
 *  - logoUrl: logo principal (ideal PNG transparente) → se muestra tal cual.
 *  - logoLightUrl: versión con fondo blanco → se muestra dentro de un círculo blanco.
 *  - Si no hay ninguno cargado, se usa el SVG.
 */
export function SiteLogo({
  settings,
  className,
  prefer = "main",
  idPrefix,
}: {
  settings: Pick<Settings, "logoUrl" | "logoLightUrl" | "siteName">;
  className?: string;
  prefer?: "main" | "light";
  idPrefix?: string;
}) {
  const { logoUrl: main, logoLightUrl: light, siteName } = settings;
  const badge = (src: string) => (
    <span className={cn("block overflow-hidden rounded-full bg-white ring-1 ring-white/20", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={siteName} className="h-full w-full object-contain p-[5%]" />
    </span>
  );
  if (prefer === "light" && light) return badge(light);
  if (main) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={main} alt={siteName} className={cn("object-contain", className)} />;
  }
  if (light) return badge(light);
  return <LogoMark className={className} idPrefix={idPrefix} />;
}
