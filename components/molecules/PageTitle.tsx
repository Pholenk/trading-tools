import { Typography } from "@/components/atoms/Typography";
import { Divider } from "@/components/atoms/Divider";
import { cn } from "@/lib/utils";

export interface PageTitleProps {
  /** The title text to display */
  title: string;
  className?: string;
}

/**
 * PageTitle — Molecule
 *
 * Composed of:
 *  - Typography atom  (headline/large, color: on-surface)
 *  - Divider atom     (color overridden to on-surface-variant)
 *
 * Design specs:
 *  - layout: column flex
 *  - align items: center
 *  - justify content: center
 *  - w: hug content
 *  - h: hug content
 *  - padding vertical: 20  → py-5
 *  - padding horizontal: 20 → px-5
 *  - gap: 16               → gap-4
 *  - typography: headline/large
 *  - text color: {theme}/on-surface     → text-surface-foreground
 *  - divider color: {theme}/on-surface-variant → bg-surface-variant-foreground
 */
export function PageTitle({ title, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center",
        "py-5 px-5 gap-4",
        className
      )}
    >
      <Typography
        variant="headline-large"
        as="h1"
        className="text-surface-foreground"
      >
        {title}
      </Typography>

      <Divider className="bg-surface-variant-foreground" />
    </div>
  );
}
