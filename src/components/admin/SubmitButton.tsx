"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/format";

export function SubmitButton({
  children,
  className,
  pendingLabel = "Guardando…",
  icon = true,
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
  icon?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn("btn-primary", className)}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon ? <Save className="h-4 w-4" /> : null}
      {pending ? pendingLabel : children}
    </button>
  );
}
