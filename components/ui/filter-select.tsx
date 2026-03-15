"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const filterTriggerClass =
  "min-h-[48px] h-12 rounded-xl border border-border bg-white text-base text-brand-charcoal focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all [&>span]:line-clamp-1";

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  "aria-label"?: string;
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  label,
  icon,
  className,
  triggerClassName,
  "aria-label": ariaLabel,
}: FilterSelectProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Select
        value={value || "__none__"}
        onValueChange={(v) => onValueChange(v === "__none__" ? "" : v)}
      >
        <SelectTrigger
          className={cn(
            filterTriggerClass,
            icon && "relative pl-10",
            triggerClassName,
          )}
          aria-label={ariaLabel ?? label}
        >
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0">
              {icon}
            </span>
          )}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border">
          {options.map((opt) => (
            <SelectItem
              key={opt.value || "__none__"}
              value={opt.value || "__none__"}
              className="rounded-lg"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
