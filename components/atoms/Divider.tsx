import { cn } from "@/lib/utils";

export interface DividerProps {
  className?: string;
}

/**
 * Divider — Atom
 *
 * A full-width horizontal rule.
 *
 * Design specs:
 *  - width: fill container → w-full
 *  - h: 2px
 *  - solid
 *  - color: {theme}/outline-variant → bg-outline-variant
 */
export function Divider({ className }: DividerProps) {
  return (
    <hr
      aria-hidden="true"
      className={cn(
        "w-full h-[2px] border-none bg-outline-variant shrink-0",
        className
      )}
    />
  );
}
