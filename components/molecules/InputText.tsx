"use client";

import * as React from "react";
import { Search, type LucideIcon } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/lib/utils";

export interface InputTextProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Override the trailing icon (defaults to Search) */
  icon?: LucideIcon;
  containerClassName?: string;
}

/**
 * InputText — Molecule
 *
 * Composed of:
 *  - Input atom  — transparent/borderless, fills the row
 *  - Icon atom   — Search icon, 48×48, trailing edge
 *
 * Design specs:
 *  - w: fill container    → w-full
 *  - h: fill container    → h-full
 *  - padding horizontal: 20 → px-5
 *  - gap: 10              → gap-[10px]
 *  - align items: center
 *  - justify content: flex-start
 *  - corner radius: 28    → rounded-[28px]
 *  - background: {theme}/surface-container-high → bg-surface-container-high
 *  - placeholder: body/large
 *  - placeholder color: {theme}/on-surface-variant → placeholder:text-surface-variant-foreground
 *  - text color: {theme}/on-surface               → text-surface-foreground
 *  - icon: Search (lucide-react)
 *  - icon w: 48, icon h: 48
 */
export const InputText = React.forwardRef<HTMLInputElement, InputTextProps>(
  ({ className, containerClassName, icon: IconOverride, ...props }, ref) => {
    const SearchIcon: LucideIcon = IconOverride ?? Search;

    return (
      <div
        className={cn(
          // Layout
          "flex flex-row items-center justify-start",
          // Sizing
          "w-full h-full",
          // Spacing
          "px-5 gap-[10px]",
          // Shape
          "rounded-[28px]",
          // Colour
          "bg-surface-container-high",
          containerClassName
        )}
      >
        {/* Input atom — transparent shell, fills remaining space */}
        <Input
          ref={ref}
          className={cn(
            // Reset atom's own visual styles — molecule container owns them
            "flex-1 h-full min-h-0",
            "bg-transparent border-none rounded-none",
            "shadow-none ring-0 focus:ring-0 focus:ring-offset-0",
            "px-0 py-0",
            // Typography
            "body-large",
            // Colours
            "text-surface-foreground",
            "placeholder:text-surface-variant-foreground",
            className
          )}
          {...props}
        />

        {/* Icon atom — Search, 48×48 */}
        <Icon
          icon={SearchIcon}
          size={48}
          className="shrink-0 text-surface-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }
);

InputText.displayName = "InputText";
