import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingProps = {
  /** Extra classes for the centered wrapper (e.g. "min-h-0 py-16" for inline card states). */
  className?: string;
  /** Accessible label announced while loading. */
  label?: string;
};

/**
 * Shared loading spinner used across the app.
 * Design matches the original Admin Dashboard spinner: a brand-orange
 * RefreshCw icon spinning inside a centered container.
 */
export function Loading({ className, label = "Loading..." }: LoadingProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "flex min-h-[400px] items-center justify-center",
        className
      )}
    >
      <RefreshCw className="animate-spin text-brand" size={30} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
