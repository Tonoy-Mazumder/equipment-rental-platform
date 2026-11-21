"use client";

import { cn } from "@/lib/utils";

type UserRole = "customer" | "owner";

const accountTypes: { value: UserRole; label: string }[] = [
  { value: "customer", label: "I want to rent" },
  { value: "owner", label: "I own equipment" },
];

type Props = {
  selected: UserRole;
  onChange: (value: UserRole) => void;
  className?: string;
};

export function AccountTypeToggle({
  selected,
  onChange,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {accountTypes.map((type) => (
        <button
          key={type.value}
          type="button"
          onClick={() => onChange(type.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium",
            selected === type.value
              ? "border bg-input/40 text-foreground"
              : "text-foreground/80 hover:text-brand"
          )}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}