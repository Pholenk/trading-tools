import { Divider } from "@/components/atoms/Divider";
import { InputText } from "@/components/molecules/InputText";
import { Menu, type MenuTab } from "@/components/molecules/Menu";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Tabs passed through to the Menu molecule */
  tabs: MenuTab[];
  /** Controlled active tab label */
  activeTab?: string;
  /** Default active tab label (uncontrolled) */
  defaultActiveTab?: string;
  /** Fired when the user switches tab */
  onTabChange?: (label: string) => void;
  /** Search input placeholder text */
  searchPlaceholder?: string;
  /** Controlled search value */
  searchValue?: string;
  /** Fired on every keystroke in the search input */
  onSearchChange?: (value: string) => void;
  /**
   * Whether to render the InputText and the bottom Divider.
   * Set to false on the landing page (/) where only the Menu is shown.
   * Defaults to true.
   */
  showSearch?: boolean;
  className?: string;
}

/**
 * PageHeader — Organism
 *
 * Structure when showSearch=true (default):
 *  ┌─────────────────────────────────────────────────┐
 *  │  [InputText]                   [Menu]           │
 *  ├─────────────────────────────────────────────────┤  ← Divider
 *
 * Structure when showSearch=false (landing page):
 *  ┌─────────────────────────────────────────────────┐
 *  │                                [Menu]           │
 *
 * Composed of:
 *  - InputText molecule  (left, flex-1)   — only when showSearch=true
 *  - Menu molecule       (right, hug content)
 *  - Divider atom        (full-width, bottom) — only when showSearch=true
 *
 * Design specs:
 *  - w: fill container → w-full
 *  - h: hug content
 *  - layout: column flex
 *  - inner row: horizontal flex, items-center, gap between InputText and Menu
 */
export function PageHeader({
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  showSearch = true,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col w-full",
        className
      )}
    >
      {/* Content row */}
      <div
        className={cn(
          "flex flex-row items-center w-full px-4 py-3 gap-4",
          !showSearch && "justify-end"
        )}
      >
        {/* InputText — only when showSearch=true */}
        {showSearch && (
          <div className="flex-1 min-w-0 h-12">
            <InputText
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={
                onSearchChange
                  ? (e) => onSearchChange(e.target.value)
                  : undefined
              }
              readOnly={searchValue !== undefined && !onSearchChange}
              className="h-full"
              containerClassName="h-full"
            />
          </div>
        )}

        {/* Menu — always rendered */}
        <Menu
          tabs={tabs}
          activeTab={activeTab}
          defaultActive={defaultActiveTab}
          onTabChange={onTabChange}
        />
      </div>

      {/* Divider — only when showSearch=true */}
      {showSearch && <Divider />}
    </div>
  );
}
