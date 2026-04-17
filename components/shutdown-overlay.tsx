'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { getSiteShutdown } from '@/lib/supabase-store'

export function ShutdownOverlay() {
  const pathname = usePathname()
  const [shutdown, setShutdown] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setChecked(true)
      return
    }
    getSiteShutdown().then(active => {
      setShutdown(active)
      setChecked(true)
    })
  }, [pathname])

  if (!checked || !shutdown || pathname.startsWith('/admin')) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-foreground">
          <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Sessions Temporarily Paused</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We&apos;re taking a short break. All sessions and resources will be back up shortly — check back soon.
        </p>
        <p className="mt-5 text-xs text-muted-foreground/60">locus education</p>
      </div>
    </div>
  )
}
