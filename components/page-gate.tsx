'use client'

import { useEffect, useState } from 'react'
import { getPageStatuses } from '@/lib/supabase-store'
import { Navbar } from '@/components/navbar'

export function PageGate({ page, children }: { page: string; children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'open' | 'closed'>('loading')

  useEffect(() => {
    getPageStatuses().then(statuses => {
      setStatus(statuses[page] === false ? 'closed' : 'open')
    })
  }, [page])

  if (status === 'loading') return <div className="min-h-screen bg-background" />

  if (status === 'closed') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center max-w-xs">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-foreground mb-2">Under Construction</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We&apos;re working on this section. Check back soon.
            </p>
            <p className="mt-5 text-xs text-muted-foreground/50">locus education</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
