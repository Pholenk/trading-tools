"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/components/molecules/MenuItem";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

export interface MenuTab {
  /** Unique key and display label for this tab */
  label: string;
}

export interface MenuProps {
  /** The list of tabs to render */
  tabs: MenuTab[];
  /** The label of the initially active tab (defaults to the first tab) */
  defaultActive?: string;
  /** Controlled active tab — use alongside onTabChange for controlled mode */
  activeTab?: string;
  /** Fired when the user selects a different tab */
  onTabChange?: (label: string) => void;
  /** Whether to show the ThemeToggle button on the trailing edge */
  showThemeToggle?: boolean;
  className?: string;
}

/**
 * Menu — Molecule
 *
 * A horizontal tab bar that renders a row of MenuItem molecules plus an
 * optional ThemeToggle button on the trailing edge.
 *
 * Supports both uncontrolled (defaultActive) and controlled (activeTab +
 * onTabChange) usage patterns.
 *
 * Design specs:
 *  - layout: horizontal flex
 *  - w: hug content
 *  - h: hug content
 *  - align-items: center
 *  - justify-content: flex-start
 *  - padding-left: 8px  (pl-2)
 *  - padding-vertical: 0
 *  - gap: 8px between children (gap-2)
 */
export function Menu({
  tabs,
  defaultActive,
  activeTab: controlledActive,
  onTabChange,
  showThemeToggle = true,
  className,
}: MenuProps) {
  // Uncontrolled internal state — ignored when controlledActive is provided
  const [internalActive, setInternalActive] = useState<string>(
    defaultActive ?? tabs[0]?.label ?? ""
  );

  const isControlled = controlledActive !== undefined;
  const activeLabel = isControlled ? controlledActive : internalActive;

  function handleTabClick(label: string) {
    if (!isControlled) setInternalActive(label);
    onTabChange?.(label);
  }

  return (
    <nav
      role="tablist"
      aria-label="Menu"
      className={cn(
        // Layout — matches design specs
        "inline-flex flex-row items-center justify-start",
        "pl-2 py-0 gap-2",
        className
      )}
    >
      {/* Tab items */}
      {tabs.map((tab) => (
        <MenuItem
          key={tab.label}
          label={tab.label}
          active={tab.label === activeLabel}
          onClick={handleTabClick}
        />
      ))}

      {/* Trailing theme toggle */}
      {showThemeToggle && (
        <ThemeToggle variant="icon" className="ml-auto" />
      )}
    </nav>
  );
}
