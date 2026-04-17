'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { getCalendarEvents } from '@/lib/supabase-store'
import { SUBJECT_COLORS, QCE_SUBJECTS } from '@/lib/types'
import type { CalendarEvent, QCESubject } from '@/lib/types'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Recurring weekly schedule: day-of-week → subject
const WEEKLY_SCHEDULE: Record<number, QCESubject> = {
  1: 'Methods',    // Monday
  2: 'Specialist', // Tuesday
  3: 'Physics',    // Wednesday
  4: 'Chemistry',  // Thursday
}

function getRecurringEvents(year: number, month: number): CalendarEvent[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const events: CalendarEvent[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const subject = WEEKLY_SCHEDULE[new Date(year, month, day).getDay()]
    if (!subject) continue
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    events.push({ id: `recurring-${date}`, title: subject, date, subject, description: '', createdAt: '' })
  }
  return events
}

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [hidden, setHidden] = useState<Set<QCESubject>>(new Set())

  useEffect(() => {
    getCalendarEvents().then(data => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  const toggleSubject = (subject: QCESubject) => {
    setHidden(prev => {
      const next = new Set(prev)
      next.has(subject) ? next.delete(subject) : next.add(subject)
      return next
    })
  }

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

  const getDateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  // Merge recurring base schedule with admin-added events.
  // Admin event for same date+subject replaces the recurring placeholder.
  const recurring = getRecurringEvents(year, month).filter(e => !hidden.has(e.subject))
  const adminEvents = events.filter(e => !hidden.has(e.subject))
  const adminKeys = new Set(adminEvents.map(e => `${e.date}-${e.subject}`))
  const merged = [
    ...recurring.filter(e => !adminKeys.has(`${e.date}-${e.subject}`)),
    ...adminEvents,
  ]

  const eventsByDate: Record<string, CalendarEvent[]> = {}
  merged.forEach(e => {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = []
    eventsByDate[e.date].push(e)
  })

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - firstDay + 1
    return day >= 1 && day <= daysInMonth ? day : null
  })

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-16">
        <header className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">What&apos;s on</p>
          <h1 className="text-2xl font-semibold text-foreground">Schedule</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">See what topics are being covered each week.</p>
        </header>

        <div className="rounded-2xl border border-border/50 bg-white shadow-sm overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
            <button
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-sm font-semibold text-foreground">{MONTHS[month]} {year}</h2>
            <button
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border/50 bg-secondary/30">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {cells.map((day, i) => {
                const isLastRow = i >= totalCells - 7
                const isLastCol = (i + 1) % 7 === 0
                const dateStr = day ? getDateStr(day) : null
                const dayEvents = dateStr ? (eventsByDate[dateStr] || []) : []
                const shadeColor = dayEvents.length > 0
                  ? SUBJECT_COLORS[dayEvents[0].subject].shade
                  : undefined

                return (
                  <div
                    key={i}
                    className={`p-1.5 ${!isLastRow ? 'border-b' : ''} ${!isLastCol ? 'border-r' : ''} border-border/30 transition-colors`}
                    style={{ backgroundColor: shadeColor, minHeight: '88px' }}
                  >
                    {day && (
                      <>
                        <span
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                            isToday(day) ? 'bg-foreground text-white' : 'text-muted-foreground'
                          }`}
                        >
                          {day}
                        </span>
                        <div className="mt-1 space-y-1">
                          {dayEvents.map(e => (
                            <div key={e.id}>
                              <div
                                className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium leading-snug"
                                style={{
                                  backgroundColor: SUBJECT_COLORS[e.subject].bg,
                                  color: SUBJECT_COLORS[e.subject].text,
                                }}
                              >
                                {e.title}
                              </div>
                              {e.description && (
                                <p className="mt-0.5 px-0.5 text-[9px] leading-snug text-muted-foreground line-clamp-2">
                                  {e.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Legend / subject filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {QCE_SUBJECTS.map(subject => {
            const isVisible = !hidden.has(subject)
            const colors = SUBJECT_COLORS[subject]
            return (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
                style={{
                  backgroundColor: isVisible ? colors.bg : '#f1f5f9',
                  color: isVisible ? colors.text : '#94a3b8',
                  opacity: isVisible ? 1 : 0.6,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: isVisible ? colors.text : '#94a3b8' }}
                />
                {subject}
              </button>
            )
          })}
          <span className="self-center text-[11px] text-muted-foreground">click to hide</span>
        </div>
      </main>
    </div>
  )
}
