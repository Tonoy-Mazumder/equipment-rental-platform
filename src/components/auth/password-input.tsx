"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthInput } from "@/components/auth/auth-field";
import { cn } from "@/lib/utils";

/** Password input with a show/hide toggle. UI only, no validation. */
export function PasswordInput({
  className,
  ...props
}: ComponentProps<typeof AuthInput>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <AuthInput
        type={isVisible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        {isVisible ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}
