import * as React from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-[var(--ssgi-border)] bg-white px-3 py-2 text-sm text-[var(--ssgi-ink)] outline-none transition focus:border-[var(--ssgi-blue)] focus:ring-2 focus:ring-[var(--ssgi-blue-soft)]",
        className,
      )}
      {...props}
    />
  );
}
