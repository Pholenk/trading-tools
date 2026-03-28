import { HomeTemplate } from '@/templates'

/**
 * HomePage — Page (HOC) layer.
 * All business logic, routing, Redux connections live here.
 * Renders <HomeTemplate /> with pure props — no logic in the template.
 */
export default function Page() {
  return <HomeTemplate className='py-12 pl-18 pr-13' />
}
