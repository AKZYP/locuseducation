'use client'

import { useState, useEffect } from 'react'
import type { Subject } from '@/lib/types'

// Methods = Monday (1), Specialist = Tuesday (2)
// Sessions run at 5pm AEST (Brisbane, UTC+10, no DST)
const SESSION_DAY: Record<Subject, number> = { Methods: 1, Specialist: 2 }
const BRISBANE_OFFSET_MS = 10 * 60 * 60 * 1000 // UTC+10

function getNextSessionDate(subject: Subject): Date {
  const targetDay = SESSION_DAY[subject]
  const nowUtc = Date.now()
  const nowBrisbane = new Date(nowUtc + BRISBANE_OFFSET_MS)

  let daysUntil = targetDay - nowBrisbane.getUTCDay()
  if (daysUntil < 0) daysUntil += 7
  // If today is the day but 5pm has passed, go to next week
  if (daysUntil === 0 && nowBrisbane.getUTCHours() >= 17) daysUntil = 7

  const sessionBrisbane = new Date(nowBrisbane)
  sessionBrisbane.setUTCDate(nowBrisbane.getUTCDate() + daysUntil)
  sessionBrisbane.setUTCHours(17, 0, 0, 0)

  // Convert back to UTC for comparison
  return new Date(sessionBrisbane.getTime() - BRISBANE_OFFSET_MS)
}

function isSessionLive(subject: Subject): boolean {
  const nowUtc = Date.now()
  const nowBrisbane = new Date(nowUtc + BRISBANE_OFFSET_MS)
  const todayDay = nowBrisbane.getUTCDay()
  const hour = nowBrisbane.getUTCHours()
  // Consider live if it's the right day between 5pm and 7pm
  return todayDay === SESSION_DAY[subject] && hour >= 17 && hour < 19
}

interface Props {
  subject: Subject
}

export function LiveCountdown({ subject }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const tick = () => {
      const live = isSessionLive(subject)
      setIsLive(live)

      if (live) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const diff = getNextSessionDate(subject).getTime() - Date.now()
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [subject])

  const dayLabel = subject === 'Methods' ? 'Mondays' : 'Tuesdays'
  const notifyHref = `/notify/${subject.toLowerCase()}`

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            {isLive ? (
              <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Live Now
              </span>
            ) : (
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Next Session
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground">{subject} Maths</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{dayLabel} at 5pm AEST — free, live, online.</p>
        </div>

        <div className="flex items-center gap-3">
          {!isLive && (
            <div className="flex gap-2">
              {[
                { value: timeLeft.days, label: 'd' },
                { value: timeLeft.hours, label: 'h' },
                { value: timeLeft.minutes, label: 'm' },
                { value: timeLeft.seconds, label: 's' },
              ].map((item, i) => (
                <div key={i} className="flex items-baseline gap-0.5">
                  <span className="text-lg font-semibold tabular-nums text-foreground">
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {isLive ? (
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
            >
              Join
            </a>
          ) : (
            <a
              href={notifyHref}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
            >
              Get notified
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
