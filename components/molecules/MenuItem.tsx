"use client";

import { cn } from "@/lib/utils";
import { MenuIndicator } from "@/components/atoms/MenuIndicator";

export interface MenuItemProps {
  /** The visible tab label */
  label: string;
  /** Whether this tab is currently active */
  active?: boolean;
  /** Click handler — receives the label string for easy identification */
  onClick?: (label: string) => void;
  className?: string;
}

/**
 * MenuItem — Molecule
 *
 * A single horizontal-tab item composed of two atoms:
 *   1. label     — Typography Title/Small
 *   2. indicator — MenuIndicator (3px bar, visible only when active)
 *
 * Design specs:
 *  - touchable (button)
 *  - layout: vertical flex, justify-end (content anchored to bottom)
 *  - min-w: 100px
 *  - h: 48px
 *  - padding-vertical: 14px  (py-[14px])
 *  - padding-horizontal: 2px (px-0.5)
 *  - gap: 4px between label and indicator
 *  - background: none
 *  - align-items: center
 *
 * Label colours:
 *  - active:   {theme}/on-surface          → text-on-surface
 *  - inactive: {theme}/on-surface-variant  → text-on-surface-variant
 */
export function MenuItem({
  label,
  active = false,
  onClick,
  className,
}: MenuItemProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onClick?.(label)}
      className={cn(
        // Layout
        "flex flex-col items-center justify-end",
        "min-w-18 h-12",
        "px-0.5 gap-2",
        // Reset
        "bg-transparent border-none outline-none cursor-pointer",
        // Focus ring for accessibility
        "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-sm",
        // Transition
        "transition-colors duration-200",
        className
      )}
    >
      {/* Atom 1: Label */}
      <span
        className={cn(
          "title-small select-none whitespace-nowrap transition-colors duration-200",
          active
            ? "text-on-surface"
            : "text-on-surface-variant"
        )}
      >
        {label}
      </span>

      {/* Atom 2: Indicator */}
      <MenuIndicator active={active} />
    </button>
  );
}
