'use client'

import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { cn } from '@/lib/utils'
import { HomeTemplate } from '@/components/templates'
import { Menu, type MenuTab } from '@/components/molecules'

const NAV_ITEMS: MenuTab[] = [
  { href: '/setor-rotation', label: 'Rotation' },
  { href: '/wave-count', label: 'Wave' },
  { href: '/calculator', label: 'Calculator' },
]

/**
 * HomePage — Page (HOC) layer.
 * All business logic, routing, Redux connections live here.
 * Renders <HomeTemplate /> with pure props — no logic in the template.
 */
export default function Page() {
  const router = useRouter()
  const themeMode = useAppSelector((s) => s.theme.mode)
  void themeMode // available for conditional logic as needed

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  return (
    <div
      className={cn(
        // Template defaults
        'flex flex-col',
        'w-full min-h-screen',
        'py-12 pl-18 pr-13',
        'bg-surface',
      )}
    >
      {/* ── Top row: Menu right-aligned ──────────────────────────────────── */}
      <div className='flex justify-end'>
        <Menu tabs={NAV_ITEMS} onTabChange={handleMenuClick} />
      </div>
      <HomeTemplate />
    </div>
  )
}
