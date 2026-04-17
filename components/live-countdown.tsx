'use client'

import { useState, useEffect } from 'react'
import { getLiveStream } from '@/lib/store'
import { addEmailSubscriber } from '@/lib/supabase-store'
import type { LiveStream } from '@/lib/types'

export function LiveCountdown() {
  const [stream, setStream] = useState<LiveStream | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isLive, setIsLive] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'exists' | 'error'>('idle')

  useEffect(() => {
    setStream(getLiveStream())
  }, [])

  useEffect(() => {
    if (!stream) return

    const calculateTimeLeft = () => {
      const targetDate = new Date(stream.scheduledDate).getTime()
      const now = Date.now()
      const difference = targetDate - now

      if (difference <= 0) {
        setIsLive(true)
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [stream])

  if (!stream) {
    return null
  }

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
          <h3 className="text-base font-semibold text-foreground">{stream.title}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{stream.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isLive && (
            <div className="flex gap-2">
              {[
                { value: timeLeft.days, label: 'd' },
                { value: timeLeft.hours, label: 'h' },
                { value: timeLeft.minutes, label: 'm' },
                { value: timeLeft.seconds, label: 's' }
              ].map((item, index) => (
                <div key={index} className="flex items-baseline gap-0.5">
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
              href={stream.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
            >
              Join
            </a>
          ) : emailStatus === 'success' || emailStatus === 'exists' ? (
            <p className="text-sm font-medium text-foreground">
              {emailStatus === 'exists' ? "You're already on the list" : "You're on the list"}
            </p>
          ) : showEmailForm ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setEmailStatus('loading')
                const result = await addEmailSubscriber(email)
                setEmailStatus(result.alreadyExists ? 'exists' : result.success ? 'success' : 'error')
                setShowEmailForm(false)
              }}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-40 rounded-lg border-0 bg-secondary/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-white hover:bg-foreground/90 disabled:opacity-50"
              >
                Notify me
              </button>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowEmailForm(true)}
              className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
            >
              Get notified
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
