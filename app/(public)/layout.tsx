'use client'

import { useState, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PageHeader } from '@/organisms'
import type { MenuTab } from '@/molecules'
import { STOCK_TICKERS } from '@/raw-data/rotation-graph/StockTickers'

const NAV_ITEMS: MenuTab[] = [
  { href: '/sector-rotation', label: 'Rotation' },
  { href: '/wave-count', label: 'Wave' },
  { href: '/calculator', label: 'Calculator' },
]

/** All ticker symbols extracted from stock.json keys */
const ALL_TICKERS = STOCK_TICKERS

/** Maximum number of suggestions to show at once */
const MAX_SUGGESTIONS = 10

/**
 * PublicLayout — Layout for the (public) route group.
 *
 * Responsibilities:
 *  - Renders PageHeader at the top of every public page.
 *  - Derives the active tab from the current pathname.
 *  - Hides the search input and Divider on the landing page (/).
 *  - Navigates via router.push when a tab is clicked.
 *  - Owns search state and derives filtered ticker suggestions.
 *  - Navigates to /{ticker} when the user selects a suggestion.
 *  - Provides a flex-col full-screen shell that children fill.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [searchValue, setSearchValue] = useState('')

  const isHome = pathname === '/'
  const activeTab = NAV_ITEMS.find((tab) => pathname.startsWith(tab.href))?.label

  /** Case-insensitive prefix/contains match, capped at MAX_SUGGESTIONS */
  const suggestions = useMemo(() => {
    if (!searchValue.trim()) return []
    const lower = searchValue.trim().toLowerCase()
    return ALL_TICKERS.filter((ticker) => ticker.toLowerCase().includes(lower)).slice(
      0,
      MAX_SUGGESTIONS,
    )
  }, [searchValue])

  const handleSuggestionClick = (ticker: string) => {
    setSearchValue('')
    router.push(`/${ticker}`)
  }

  return (
    <div className='flex flex-col min-h-screen w-full bg-surface'>
      <PageHeader
        tabs={NAV_ITEMS}
        activeTab={activeTab}
        showSearch={!isHome}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        onTabChange={(href) => router.push(href)}
      />
      <main className='flex flex-col flex-1'>{children}</main>
    </div>
  )
}
