import { cn } from '@/lib/utils'
import { Breadcrumb, PageTitle } from '@/molecules'
import { RotationGraph, type RRGDatum  } from '@/organisms'

export interface SectorRotationTemplateProps {
  className?: string
  graph?: RRGDatum[]
}

const BREADCRUMB_ITEMS = [{ label: 'Home' }, { label: 'Rotation' }]

export function SectorRotationTemplate({ className, graph }: SectorRotationTemplateProps) {
  return (
    <div className={cn('flex flex-1 flex-col justify-start gap-2', className)}>
      <Breadcrumb items={BREADCRUMB_ITEMS} />
      <PageTitle title='Sector Rotation' />
      <RotationGraph data={graph || []} />
    </div>
  )
}
