export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return m ? m[1] : null;
}

export function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export type MediaKind = "youtube" | "vimeo" | "video" | "audio" | "image" | "pdf" | "link";

export function mediaKind(url: string): MediaKind {
  if (!url) return "link";
  if (youtubeId(url)) return "youtube";
  if (vimeoId(url)) return "vimeo";
  const clean = url.split(/[?#]/)[0].toLowerCase();
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(clean)) return "video";
  if (/\.(mp3|wav|ogg|oga|m4a|aac|flac|opus)$/.test(clean)) return "audio";
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp)$/.test(clean)) return "image";
  if (/\.pdf$/.test(clean)) return "pdf";
  return "link";
}

/** Miniatura para un medio (imagen directa o portada de YouTube) */
export function mediaThumb(url: string): string | null {
  const kind = mediaKind(url);
  if (kind === "image") return url;
  if (kind === "youtube") return `https://img.youtube.com/vi/${youtubeId(url)}/hqdefault.jpg`;
  if (kind === "link" && /^https?:\/\//.test(url)) return url;
  return null;
}

export function waLink(phone: string, text?: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function excerpt(text: string, max = 160): string {
  const plain = (text || "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*|__|~~|[*_#>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? plain.slice(0, max - 1).trimEnd() + "…" : plain;
}

export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export function isExternal(url: string): boolean {
  return /^(https?:)?\/\//.test(url) || url.startsWith("mailto:") || url.startsWith("tel:");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(raw: string): string {
  let s = esc(raw);
  s = s.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|\/|mailto:|tel:)[^\s)]+)\)/g,
    (_m, text: string, url: string) =>
      `<a href="${url}"${url.startsWith("/") ? "" : ' target="_blank" rel="noopener noreferrer"'}>${text}</a>`,
  );
  s = s.replace(
    /(^|[\s(])(https?:\/\/[^\s<)]+)/g,
    (_m, pre: string, url: string) => `${pre}<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`,
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>");
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  return s;
}

/**
 * Formato simple y seguro:
 * **negrita**, *cursiva*, [texto](enlace), # título, - listas, > citas.
 * Una línea en blanco separa párrafos; los saltos de línea se respetan.
 */
export function richTextToHtml(text: string): string {
  const src = (text || "").replace(/\r\n?/g, "\n").trim();
  if (!src) return "";
  return src
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split("\n");
      const h = block.match(/^(#{1,3})\s+(.+)$/);
      if (lines.length === 1 && h) {
        const lvl = h[1].length + 1;
        return `<h${lvl}>${inline(h[2])}</h${lvl}>`;
      }
      if (lines.every((l) => /^\s*[-•]\s+/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-•]\s+/, ""))}</li>`).join("")}</ul>`;
      }
      if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
        return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
      }
      if (lines.every((l) => /^>\s?/.test(l))) {
        return `<blockquote>${lines.map((l) => inline(l.replace(/^>\s?/, ""))).join("<br/>")}</blockquote>`;
      }
      return `<p>${lines.map(inline).join("<br/>")}</p>`;
    })
    .join("");
}
