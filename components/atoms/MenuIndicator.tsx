import { cn } from "@/lib/utils";

export interface MenuIndicatorProps {
  /** Whether this indicator is in its active (visible) state */
  active?: boolean;
  className?: string;
}

/**
 * MenuIndicator — Atom
 *
 * The slim bottom bar that appears beneath an active MenuItem.
 *
 * Design specs:
 *  - w: fill container (w-full)
 *  - h: 3px
 *  - border-radius: 20px
 *  - active bg:   {theme}/on-surface  → surface-foreground
 *  - inactive bg: transparent
 */
export function MenuIndicator({ active = false, className }: MenuIndicatorProps) {
  return (
    <span
      aria-hidden={!active}
      className={cn(
        "block w-full h-1 rounded-[20px] transition-colors duration-200",
        active ? "bg-on-surface" : "bg-transparent",
        className
      )}
    />
  );
}
