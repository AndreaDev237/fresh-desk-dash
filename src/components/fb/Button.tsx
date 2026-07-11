import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      icon,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-md font-semibold text-[14px] leading-5 tracking-wide transition-all press disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
    const sizes: Record<Size, string> = {
      md: "h-11 px-5",
      lg: "h-14 px-6 text-[15px]",
    };
    const variants: Record<Variant, string> = {
      primary: "bg-primary text-on-primary shadow-premium hover:bg-surface-tint hover:shadow-premium-hover",
      secondary:
        "border-[1.5px] border-primary bg-transparent text-primary hover:bg-primary/5",
      ghost: "bg-transparent text-on-surface hover:bg-surface-container",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, sizes[size], variants[variant], fullWidth && "w-full", className)}
        {...props}
      >
        {loading ? (
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-label="Caricamento"
          />
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
