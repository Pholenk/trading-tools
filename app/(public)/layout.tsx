'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/organisms'
import type { MenuTab } from '@/components/molecules'

const NAV_ITEMS: MenuTab[] = [
  { href: '/setor-rotation', label: 'Rotation' },
  { href: '/wave-count', label: 'Wave' },
  { href: '/calculator', label: 'Calculator' },
]

/**
 * PublicLayout — Layout for the (public) route group.
 *
 * Responsibilities:
 *  - Renders PageHeader at the top of every public page.
 *  - Derives the active tab from the current pathname.
 *  - Hides the search input and Divider on the landing page (/).
 *  - Navigates via router.push when a tab is clicked.
 *  - Provides a flex-col full-screen shell that children fill.
 */
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const isHome = pathname === '/'
  const activeTab = NAV_ITEMS.find((tab) =>
    pathname.startsWith(tab.href)
  )?.label

  return (
    <div className="flex flex-col min-h-screen w-full bg-surface">
      <PageHeader
        tabs={NAV_ITEMS}
        activeTab={activeTab}
        showSearch={!isHome}
        onTabChange={(href) => router.push(href)}
      />
      <main className="flex flex-col flex-1">
        {children}
      </main>
    </div>
  )
}
