import { ChevronRight } from "lucide-react";
import { Icon } from "@/components/atoms";
import { Typography } from "@/components/atoms";
import { cn } from "@/lib/utils";

export interface BreadcrumbItemProps {
  /** The visible label for this crumb */
  label: string;
  /** Whether this is the current / active crumb */
  active?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  className?: string;
}

/**
 * BreadcrumbItem — Atom
 *
 * Composed of:
 *  - Icon atom     (ChevronRight, 24×24, inherits label colour)
 *  - Typography atom (title-small)
 *
 * Design specs:
 *  - directions: horizontal
 *  - align items: center
 *  - justify content: flex-start
 *  - icon w: 24, icon h: 24, icon color: same as label
 *  - typography: title/small
 *  - color (inactive): {theme}/on-surface-variant → text-on-surface-variant
 *  - color (active):   {theme}/on-surface          → text-on-surface
 */
export function BreadcrumbItem({
  label,
  active = false,
  onClick,
  className,
}: BreadcrumbItemProps) {
  const colorClass = active
    ? "text-on-surface"
    : "text-on-surface-variant";

  const inner = (
    <span
      className={cn(
        "inline-flex flex-row items-center justify-start gap-0",
        colorClass,
        className
      )}
    >
      <Icon icon={ChevronRight} size={24} aria-hidden="true" />
      <Typography
        variant="title-small"
        as="span"
        className={cn("font-medium", colorClass)}
      >
        {label}
      </Typography>
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className="inline-flex items-center bg-transparent border-none p-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-1 rounded-sm"
      >
        {inner}
      </button>
    );
  }

  return (
    <span aria-current={active ? "page" : undefined}>
      {inner}
    </span>
  );
}
