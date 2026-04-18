'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { getPageStatuses, setPageStatus } from '@/lib/supabase-store'

const SUPER_ADMIN = 'rishpatelau@gmail.com'

const PAGES = [
  { key: 'videos',    label: 'Videos',       path: '/',          description: 'Main video library and livestreams' },
  { key: 'resources', label: 'Resources',    path: '/resources', description: 'Downloadable study guides and resources' },
  { key: 'tutors',    label: 'Tutors',       path: '/tutors',    description: 'Meet the tutor profiles' },
  { key: 'calendar',  label: 'Calendar',     path: '/calendar',  description: 'Weekly session schedule' },
  { key: 'notify',    label: 'Get Notified', path: '/notify',    description: 'Email notification sign-up' },
  { key: 'mission',   label: 'Our Mission',  path: '/mission',   description: 'About Locus and our goals' },
]

export default function AdminPagesPage() {
  const { user, isLoaded } = useUser()
  const [statuses, setStatuses] = useState<Record<string, boolean>>({})
  const [toggling, setToggling] = useState<string | null>(null)

  const isSuperAdmin = user?.emailAddresses?.some(e => e.emailAddress === SUPER_ADMIN)

  useEffect(() => {
    getPageStatuses().then(setStatuses)
  }, [])

  const handleToggle = async (key: string) => {
    setToggling(key)
    const next = !statuses[key]
    await setPageStatus(key, next)
    setStatuses(prev => ({ ...prev, [key]: next }))
    setToggling(null)
  }

  if (!isLoaded) return null

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-foreground mb-1">Access Restricted</h2>
        <p className="text-sm text-muted-foreground">Only the site owner can manage page visibility.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground">Page Visibility</h1>
        <p className="text-sm text-muted-foreground">Toggle pages on or off. Disabled pages show an &quot;Under Construction&quot; screen to visitors.</p>
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-border/50 divide-y divide-border/50">
        {PAGES.map(page => {
          const isActive = statuses[page.key] !== false
          const isToggling = toggling === page.key
          return (
            <div key={page.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-foreground">{page.label}</h3>
                  <span className="text-[11px] text-muted-foreground/60">{page.path}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{page.description}</p>
              </div>
              <button
                onClick={() => handleToggle(page.key)}
                disabled={isToggling}
                className="ml-6 shrink-0 flex items-center gap-2"
                aria-label={`Toggle ${page.label}`}
              >
                <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {isToggling ? '...' : isActive ? 'Live' : 'Off'}
                </span>
                {/* Toggle pill */}
                <div
                  className="relative h-5 w-9 rounded-full transition-colors duration-200"
                  style={{ backgroundColor: isActive ? '#18181b' : '#e2e8f0' }}
                >
                  <div
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform: isActive ? 'translateX(18px)' : 'translateX(2px)' }}
                  />
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
