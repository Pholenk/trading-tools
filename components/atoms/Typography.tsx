import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      "display-large": "display-large",
      "display-medium": "display-medium",
      "display-small": "display-small",
      "headline-large": "headline-large",
      "headline-medium": "headline-medium",
      "headline-small": "headline-small",
      "title-large": "title-large",
      "title-medium": "title-medium",
      "title-small": "title-small",
      "body-large": "body-large",
      "body-medium": "body-medium",
      "body-small": "body-small",
      "label-large": "label-large",
      "label-medium": "label-medium",
      "label-small": "label-small",
    },
    textColor: {
      default: "text-on-surface",
      primary: "text-primary",
      secondary: "text-secondary",
      muted: "text-on-surface-variant",
      error: "text-error",
    },
  },
  defaultVariants: {
    variant: "body-medium",
    textColor: "default",
  },
});

type TypographyTag =
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "p" | "span" | "label" | "div";

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: TypographyTag;
}

const defaultTagMap: Record<string, TypographyTag> = {
  "display-large": "h1",
  "display-medium": "h1",
  "display-small": "h2",
  "headline-large": "h2",
  "headline-medium": "h3",
  "headline-small": "h4",
  "title-large": "h5",
  "title-medium": "h6",
  "title-small": "h6",
  "body-large": "p",
  "body-medium": "p",
  "body-small": "p",
  "label-large": "span",
  "label-medium": "span",
  "label-small": "span",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Typography = React.forwardRef<any, TypographyProps>(
  ({ className, variant, textColor, as, children, ...props }, ref) => {
    const Tag = (as ?? defaultTagMap[variant ?? "body-medium"] ?? "p") as TypographyTag;

    return (
      <Tag
        className={cn(typographyVariants({ variant, textColor, className }))}
        ref={ref}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      >
        {children}
      </Tag>
    );
  }
);

Typography.displayName = "Typography";

export { Typography, typographyVariants };
