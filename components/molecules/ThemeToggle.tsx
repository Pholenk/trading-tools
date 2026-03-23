"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/atoms";
import { cn } from "@/lib/utils";

export interface ThemeToggleProps {
  className?: string;
  /** "icon" shows a single cycling icon; "segmented" shows all three options */
  variant?: "icon" | "segmented";
}

export function ThemeToggle({
  className,
  variant = "icon",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  if (variant === "segmented") {
    const options = [
      { value: "light", label: "Light", Icon: Sun },
      { value: "system", label: "System", Icon: Monitor },
      { value: "dark", label: "Dark", Icon: Moon },
    ] as const;

    return (
      <div
        role="group"
        aria-label="Theme selector"
        className={cn(
          "inline-flex rounded-full border border-outline-variant bg-surface-container p-1 gap-1",
          className
        )}
      >
        {options.map(({ value, label, Icon: IconComp }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              aria-pressed={isActive}
              aria-label={`Switch to ${label} theme`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 label-medium transition-colors",
                isActive
                  ? "bg-secondary-container text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high"
              )}
            >
              <IconComp size={14} aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Single cycling icon button
  const isDark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={className}
    >
      {isDark ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </Button>
  );
}
