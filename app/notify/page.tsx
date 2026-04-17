'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { addEmailSubscriber } from '@/lib/supabase-store'
import { getLiveStream } from '@/lib/store'
import type { LiveStream } from '@/lib/types'

export default function NotifyPage() {
  const [stream, setStream] = useState<LiveStream | null>(null)
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'exists' | 'error'>('idle')

  useEffect(() => {
    setStream(getLiveStream())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setStatus('loading')
    const result = await addEmailSubscriber(email)
    setStatus(result.alreadyExists ? 'exists' : result.success ? 'success' : 'error')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 pt-24 pb-16">
        <div className="space-y-6">
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Notifications</p>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Get notified when we go live
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {stream
                ? `We'll email you before "${stream.title}" starts.`
                : "We'll email you before the next session starts."}
            </p>
          </header>

          <div className="h-px bg-border" />

          {status === 'success' || status === 'exists' ? (
            <div className="rounded-xl bg-secondary/40 p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-foreground">
                {status === 'exists' ? "You're already on the list" : "You're on the list"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                We&apos;ll send a reminder before the next session.
              </p>
              <a
                href="/"
                className="mt-4 inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
              >
                Back to home
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'loading'}
                  className="w-full rounded-lg border-0 bg-secondary/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-foreground"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to receive session reminder emails from Locus Education.
                  I can{' '}
                  <a href="/unsubscribe" className="underline underline-offset-2 hover:text-foreground">
                    unsubscribe
                  </a>
                  {' '}at any time. See our{' '}
                  <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
                    terms &amp; privacy
                  </a>.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'loading' || !agreed}
                className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Adding you…' : 'Notify me'}
              </button>

              {status === 'error' && (
                <p className="text-xs text-red-500">Something went wrong. Try again?</p>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
