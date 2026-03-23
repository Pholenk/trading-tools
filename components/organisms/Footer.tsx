import { Typography } from "@/components/atoms";
import { cn } from "@/lib/utils";

export interface FooterProps {
  brand: string;
  tagline?: string;
  className?: string;
}

export function Footer({ brand, tagline, className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "w-full border-t border-outline-variant bg-surface-container-low",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <Typography variant="label-medium" className="text-muted-foreground">
          © {year} {brand}. All rights reserved.
        </Typography>
        {tagline && (
          <Typography variant="label-small" className="text-muted-foreground">
            {tagline}
          </Typography>
        )}
      </div>
    </footer>
  );
}
