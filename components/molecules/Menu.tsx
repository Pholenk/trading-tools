"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/components/molecules/MenuItem";
import { ButtonIcon } from "@/components/molecules/ButtonIcon";

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
  /** Whether to show the ButtonIcon at the trailing edge */
  showButtonIcon?: boolean;
  className?: string;
}

/**
 * Menu — Molecule
 *
 * Structure: {loop of MenuItem} → {ButtonIcon}
 *
 * A horizontal tab bar that renders a row of MenuItem molecules followed
 * by a ButtonIcon theme toggle at the very end.
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
  showButtonIcon = true,
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
        "inline-flex flex-row items-center justify-start",
        "pl-2 py-0 gap-2",
        className
      )}
    >
      {/* Loop of MenuItems */}
      {tabs.map((tab) => (
        <MenuItem
          key={tab.label}
          label={tab.label}
          active={tab.label === activeLabel}
          onClick={handleTabClick}
        />
      ))}

      {/* ButtonIcon — always last */}
      {showButtonIcon && <ButtonIcon />}
    </nav>
  );
}
