import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Input styled for the dark auth pages. */
export function AuthInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <Input
      className={cn(
        "h-10 rounded-lg px-3 text-sm dark:bg-input/50",
        "focus-visible:border-brand focus-visible:ring-brand/30",
        className
      )}
      {...props}
    />
  );
}

type AuthFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

/** Label + input + optional helper text, used for every auth form field. */
export function AuthField({ label, htmlFor, hint, children }: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
