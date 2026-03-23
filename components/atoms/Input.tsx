import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border bg-surface px-3 py-2",
          "body-medium text-foreground placeholder:text-muted-foreground",
          "border-outline-variant focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
