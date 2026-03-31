'use client'

import { cn } from '@/lib/utils'

export interface SearchOptionProps {
  /** The ticker symbol to display */
  ticker: string
  /** Called when the item is clicked */
  onClick: (ticker: string) => void
  className?: string
}

/**
 * SearchOption — Molecule
 *
 * A single suggestion row in the search dropdown.
 * Looks like a MenuItem without its MenuIndicator — a full-width button
 * with a left-aligned title-small label and an active hover state.
 *
 * Design specs (mirrors MenuItem minus the indicator):
 *  - role: option (part of a listbox)
 *  - layout: horizontal flex, items-center
 *  - w: full
 *  - h: 48px  → h-12
 *  - padding-horizontal: 20px → px-5
 *  - background on hover: surface-container-highest
 *  - typography: title-small
 *  - color: on-surface-variant (resting) → on-surface (hover)
 */
export function SearchOption({ ticker, onClick, className }: SearchOptionProps) {
  return (
    <button
      type='button'
      role='option'
      aria-selected={false}
      onMouseDown={(e) => {
        // Prevent the input from losing focus before the click fires
        e.preventDefault()
        onClick(ticker)
      }}
      className={cn(
        // Layout
        'flex flex-row items-center',
        'w-full h-12',
        'px-5',
        // Reset
        'bg-transparent border-none outline-none cursor-pointer',
        // Colour
        'text-on-surface-variant',
        // Hover
        'hover:bg-surface-container-highest hover:text-on-surface',
        // Transition
        'transition-colors duration-150',
        className,
      )}
    >
      <span className='title-small select-none whitespace-nowrap'>
        {ticker}
      </span>
    </button>
  )
}
