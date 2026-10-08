import { ExternalLink, FileText } from "lucide-react";
import { cn, mediaKind, vimeoId, youtubeId } from "@/lib/format";

/** Reproduce cualquier medio: YouTube, Vimeo, video/audio subido, imagen, PDF o enlace. */
export function MediaPlayer({
  url,
  title,
  autoPlay = false,
  className,
}: {
  url: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}) {
  if (!url) return null;
  const kind = mediaKind(url);
  if (kind === "youtube") {
    return (
      <div className={cn("aspect-video w-full overflow-hidden rounded-xl bg-black", className)}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId(url)}${autoPlay ? "?autoplay=1" : ""}`}
          title={title ?? "Video"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  if (kind === "vimeo") {
    return (
      <div className={cn("aspect-video w-full overflow-hidden rounded-xl bg-black", className)}>
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId(url)}${autoPlay ? "?autoplay=1" : ""}`}
          title={title ?? "Video"}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }
  if (kind === "video") {
    return (
      <video
        src={url}
        controls
        playsInline
        preload="metadata"
        autoPlay={autoPlay}
        className={cn("max-h-[80vh] w-full rounded-xl bg-black", className)}
      />
    );
  }
  if (kind === "audio") {
    return <audio src={url} controls preload="metadata" className={cn("w-full", className)} />;
  }
  if (kind === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={title ?? ""} className={cn("max-h-[85vh] w-auto rounded-xl object-contain", className)} />;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cn("btn-ghost", className)}>
      {kind === "pdf" ? <FileText className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
      {kind === "pdf" ? "Ver PDF" : "Ver contenido"}
    </a>
  );
}
