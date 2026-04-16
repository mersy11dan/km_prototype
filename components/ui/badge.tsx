import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: "bg-[var(--ssgi-blue-soft)] text-[var(--ssgi-blue)] ring-[rgba(27,77,140,0.12)]",
        warning: "bg-[#fff5e6] text-[#9f6300] ring-[rgba(159,99,0,0.12)]",
        success: "bg-[#e8f7ef] text-[#156c41] ring-[rgba(21,108,65,0.12)]",
        danger: "bg-[#fdeceb] text-[var(--ssgi-red)] ring-[rgba(197,59,51,0.12)]",
        neutral: "bg-[#f3f5f8] text-[#4d5d72] ring-[rgba(77,93,114,0.12)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
