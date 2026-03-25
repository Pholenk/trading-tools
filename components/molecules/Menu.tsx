'use client'

import { cn } from '@/lib/utils'
import { MenuItem } from '@/components/molecules/MenuItem'
import { ButtonIcon } from '@/components/molecules/ButtonIcon'

export interface MenuTab {
  /** Unique key and display label for this tab */
  label: string
  href: string
}

export interface MenuProps {
  /** The list of tabs to render */
  tabs: MenuTab[]
  /** The label of the initially active tab (defaults to the first tab) */
  defaultActive?: string
  /** Controlled active tab — use alongside onTabChange for controlled mode */
  activeTab?: string
  /** Fired when the user selects a different tab */
  onTabChange?: (href: string) => void
  className?: string
}

const RenderMenuItem = (props: {
  tabs: MenuTab[]
  onMenuClick: MenuProps['onTabChange']
  activeMenu: MenuTab['label']
}) => {
  const realTabs = [...props.tabs, { href: '#', label: 'button' }]

  return realTabs.map((tab) => {
    return tab.label === 'button' ? (
      <ButtonIcon key='theme-switcher' className='rounded-full' />
    ) : (
      <MenuItem
        key={tab.label}
        label={tab.label}
        active={tab.label === props.activeMenu}
        onClick={() => {
          if (typeof props.onMenuClick === 'undefined') {
            return
          }
          props.onMenuClick(tab.href)
        }}
      />
    )
  })
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
export function Menu({ tabs, defaultActive, activeTab, onTabChange, className }: MenuProps) {
  function handleMenuClick(href: string) {
    if (typeof onTabChange === 'undefined') {
      return
    }
    onTabChange?.(href)
  }

  return (
    <nav
      role='tablist'
      aria-label='Menu'
      className={cn(
        'inline-flex flex-row items-center justify-start',
        'pl-2 py-0 gap-2',
        className,
      )}
    >
      <RenderMenuItem
        tabs={tabs}
        onMenuClick={handleMenuClick}
        activeMenu={activeTab || defaultActive || ''}
      />
    </nav>
  )
}
