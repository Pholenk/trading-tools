import * as React from "react";
import { type LucideProps, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps extends LucideProps {
  icon: LucideIcon;
  size?: number;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, className, size = 24, ...props }, ref) => {
    return (
      <IconComponent
        ref={ref}
        size={size}
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";

export { Icon };
