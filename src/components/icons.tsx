import {
  Award,
  Ban,
  BookOpen,
  Camera,
  Download,
  Feather,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Hammer,
  Heart,
  House,
  Laugh,
  Lightbulb,
  Link2,
  ListOrdered,
  Music,
  Package,
  Quote,
  ShoppingCart,
  Skull,
  Sparkles,
  Star,
  Store,
  Swords,
  Tag,
  ThumbsUp,
  TriangleAlert,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/sections";

const MAP: Record<IconName, LucideIcon> = {
  zap: Zap,
  camera: Camera,
  globe: Globe,
  graduation: GraduationCap,
  store: Store,
  cart: ShoppingCart,
  download: Download,
  package: Package,
  thumbsUp: ThumbsUp,
  award: Award,
  link: Link2,
  alert: TriangleAlert,
  skull: Skull,
  quote: Quote,
  laugh: Laugh,
  feather: Feather,
  music: Music,
  swords: Swords,
  book: BookOpen,
  hammer: Hammer,
  lightbulb: Lightbulb,
  list: ListOrdered,
  heart: Heart,
  file: FileText,
  home: House,
  wrench: Wrench,
  star: Star,
  sparkles: Sparkles,
  flame: Flame,
  users: Users,
  tag: Tag,
  ban: Ban,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const C = MAP[name] ?? Sparkles;
  return <C className={className} aria-hidden="true" />;
}

type BrandProps = { className?: string };

export function InstagramIcon({ className }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export function TiktokIcon({ className }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.6 2.4 4.4 5 4.6" />
    </svg>
  );
}

export function XIcon({ className }: BrandProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}
