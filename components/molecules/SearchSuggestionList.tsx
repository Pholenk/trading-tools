'use client'

import { cn } from '@/lib/utils'
import { SearchOption } from '@/molecules'

export interface SearchSuggestionListProps {
  /** Filtered ticker symbols to display */
  suggestions: string[]
  /** Called when the user clicks a suggestion */
  onSuggestionClick: (ticker: string) => void
  className?: string
}

/**
 * SearchSuggestionList — Molecule
 *
 * A floating dropdown list of SearchOption items that appears below the
 * search input. Hidden automatically when `suggestions` is empty.
 *
 * Design specs:
 *  - position: absolute, full width of the parent relative container
 *  - top: 100% + 4px gap (mt-1)
 *  - z-index: 50
 *  - background: surface-container-high  (matches InputText pill)
 *  - corner radius: 16px → rounded-2xl
 *  - max-height: 240px (5 items × h-12) → max-h-60
 *  - overflow-y: auto when content exceeds max-height
 *  - padding-vertical: 8px → py-2
 *  - elevation shadow: shadow-md
 */
export function SearchSuggestionList({
  suggestions,
  onSuggestionClick,
  className,
}: SearchSuggestionListProps) {
  if (suggestions.length === 0) return null

  return (
    <ul
      role='listbox'
      aria-label='Search suggestions'
      className={cn(
        // Positioning
        'absolute top-full left-0 right-0 mt-1 z-50',
        // Shape
        'rounded-2xl',
        // Colour
        'bg-surface-container-high',
        // Overflow
        'max-h-60 overflow-y-auto',
        // Spacing
        'py-2',
        // Elevation
        'shadow-md',
        className,
      )}
    >
      {suggestions.map((ticker) => (
        <li key={ticker} role='presentation'>
          <SearchOption ticker={ticker} onClick={onSuggestionClick} />
        </li>
      ))}
    </ul>
  )
}
