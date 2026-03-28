import { BreadcrumbItem } from "@/components/atoms";
import { cn } from "@/lib/utils";

export interface BreadcrumbEntry {
  label: string;
  /** If provided, renders the item as a clickable button */
  onClick?: () => void;
}

export interface BreadcrumbProps {
  /** Ordered list of crumbs. The last entry is automatically marked active. */
  items: BreadcrumbEntry[];
  className?: string;
}

/**
 * Breadcrumb — Molecule
 *
 * Renders an ordered row of BreadcrumbItem atoms.
 * The last item is always treated as the active (current) page.
 *
 * Design specs:
 *  - w: fill container   → w-full
 *  - h: hug content
 *  - padding vertical: 8  → py-2
 *  - padding horizontal: 12 → px-3
 *  - directions: horizontal → flex-row
 *  - align items: center
 *  - justify content: flex-start
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={cn(
          "flex flex-row items-center justify-start",
          "w-full",
          "py-2 px-3",
          className
        )}
      >
        {items.map((item, index) => {
          const isActive = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              <BreadcrumbItem
                label={item.label}
                active={isActive}
                onClick={item.onClick}
              />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
