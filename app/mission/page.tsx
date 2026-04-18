import { PageGate } from '@/components/page-gate'
import { MissionClient } from './mission-client'

export default function MissionPage() {
  return (
    <PageGate page="mission">
      <MissionClient />
    </PageGate>
  )
}
