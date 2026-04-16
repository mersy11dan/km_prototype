import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ssgi-blue)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,var(--ssgi-blue)_0%,var(--ssgi-blue-strong)_100%)] text-white shadow-[0_12px_28px_rgba(18,52,95,0.24)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(18,52,95,0.3)]",
        secondary:
          "bg-[linear-gradient(135deg,#e4b257_0%,var(--ssgi-gold-strong)_100%)] text-[#2f2410] shadow-[0_12px_28px_rgba(184,130,31,0.22)] hover:-translate-y-0.5",
        outline:
          "border border-[var(--ssgi-border-strong)] bg-white/85 text-[var(--ssgi-ink)] hover:border-[var(--ssgi-blue)] hover:bg-[var(--ssgi-blue-soft)] hover:text-[var(--ssgi-blue)]",
        ghost: "text-[var(--ssgi-blue)] hover:bg-[var(--ssgi-blue-soft)]",
        destructive: "bg-[var(--ssgi-red)] text-white hover:bg-[#9f0e18]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
);

Button.displayName = "Button";

export { Button, buttonVariants };
