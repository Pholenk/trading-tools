"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";

export interface ButtonIconProps {
  className?: string;
}

/**
 * ButtonIcon — Molecule
 *
 * Composed of:
 *  - Button atom  (variant="tertiary", size="icon-lg")
 *  - Icon atom    (Sun in dark mode, Moon in light mode)
 *
 * Design specs:
 *  - w: 48px, h: 48px          → size="icon-lg" on Button
 *  - padding: 10px             → size="icon-lg" on Button
 *  - border-radius: 20px       → size="icon-lg" on Button
 *  - background: tertiary-container  → variant="tertiary" on Button
 *  - icon color: on-tertiary-container → inherited from Button text colour
 *  - icon: Sun (dark mode) | Moon (light mode) → Icon atom
 */
export function ButtonIcon({ className }: ButtonIconProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="tertiary"
      size="icon-lg"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className}
    >
      <Icon
        icon={isDark ? Sun : Moon}
        size={24}
        aria-hidden="true"
      />
    </Button>
  );
}
