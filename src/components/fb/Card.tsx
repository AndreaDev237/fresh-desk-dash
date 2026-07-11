import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-outline-variant/40 bg-surface-container-lowest p-3 shadow-premium",
        className,
      )}
      {...props}
    />
  );
}

type BadgeVariant = "promo" | "category" | "success";

export function Badge({
  variant = "category",
  children,
  className,
}: {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const variants: Record<BadgeVariant, string> = {
    promo: "bg-secondary-container text-on-secondary-container",
    category: "bg-surface-container-high text-on-surface-variant",
    success: "bg-primary-container/30 text-on-primary-container",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
