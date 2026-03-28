import { Typography } from '@/atoms'
import { InputText } from '@/molecules'
import { cn } from '@/lib/utils'

export interface HomeTemplateProps {
  // ── Greeting Label ───────────────────────────────────────────────────────
  /** First line of the greeting. Default: "Welcome," */
  greetingLine1?: string
  /** Second line of the greeting. Default: "What Stock" */
  greetingLine2?: string
  /** Third line of the greeting. Default: "Are You Looking For?" */
  greetingLine3?: string

  // ── InputText ────────────────────────────────────────────────────────────
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void

  className?: string
}

/**
 * HomeTemplate — Template (pure UI, no logic)
 *
 * The home / landing page layout.
 *
 * Structure (flex-col):
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │                                           [Menu]            │ ← top row, justify-end
 *  │                                                             │
 *  │   [Greeting Label]                                          │ ← flex-1, justify-center
 *  │   [InputText]                                               │
 *  │                                                             │
 *  └──────────────────────────────────────────────────────────────┘
 *
 * Template default layout:
 *  - w: full, min-h: screen (design frame: 1440 × 1024)
 *  - padding vertical: 48   → py-12
 *  - padding left: 72       → pl-[72px]
 *  - padding right: 52      → pr-[52px]
 *  - background: {theme}/surface → bg-surface
 *  - direction: vertical    → flex-col
 *
 * Greeting Label specs:
 *  - w: hug content, max-w: 716px
 *  - h: hug content
 *  - align items: center
 *  - justify content: flex-start
 *  - padding vertical: 12 → py-3
 *  - padding horizontal: 0 → px-0
 *  - directions: vertical → flex-col
 *  - typography: display/large, color: {theme}/on-surface
 */
export function HomeTemplate({
  greetingLine1 = 'Welcome,',
  greetingLine2 = 'What Stock Are You',
  greetingLine3 = 'Looking For?',
  searchPlaceholder = 'ASII, ADMR, BBCA, BMRI... ',
  searchValue,
  onSearchChange,
  className,
}: HomeTemplateProps) {
  return (
    <div className={cn('flex flex-col flex-1', 'justify-center items-center', className)}>
      {/* Greeting Label */}
      <div
        className={cn(
          'flex flex-col items-center justify-start',
          'gap-2 py-3',
          'max-w-[720px]',
          'w-full',
        )}
      >
        <Typography variant='display-large' as='h1' className='text-on-surface w-full'>
          {greetingLine1}
        </Typography>
        <Typography variant='display-large' as='h2' className='text-on-surface w-full'>
          {greetingLine2}
        </Typography>
        <Typography variant='display-large' as='h2' className='text-on-surface w-full'>
          {greetingLine3}
        </Typography>
      </div>

      {/* InputText */}
      <div className='max-w-[720px] h-14 w-full'>
        <InputText
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
          readOnly={searchValue !== undefined && !onSearchChange}
          containerClassName='h-full w-full'
        />
      </div>
    </div>
  )
}
