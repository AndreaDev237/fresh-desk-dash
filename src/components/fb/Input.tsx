import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold uppercase tracking-wider text-on-surface-variant"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-12 rounded-md border bg-surface-container-lowest px-3 text-[16px] text-on-surface placeholder:text-on-surface-variant/50 transition-colors",
            "border-outline-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30",
            error && "border-error focus:border-error focus:ring-error/30",
            className,
          )}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error ? (
          <p className="text-[12px] font-medium text-error">{error}</p>
        ) : hint ? (
          <p className="text-[12px] text-on-surface-variant">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
