'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { addEmailSubscriber } from '@/lib/supabase-store'
import { getLiveStream } from '@/lib/store'
import type { LiveStream } from '@/lib/types'

// Replace with your WhatsApp group invite link
const WHATSAPP_INVITE = 'https://chat.whatsapp.com/REPLACE_ME'

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

  const sessionLabel = stream ? `"${stream.title}"` : 'the next session'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 pt-24 pb-16">
        <div className="space-y-6">
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Notifications</p>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Stay in the loop
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Get notified before {sessionLabel} starts — pick whichever works for you.
            </p>
          </header>

          <div className="h-px bg-border" />

          {/* WhatsApp */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-foreground">Join our WhatsApp group</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Get reminders and updates directly in WhatsApp. Tap once to join.
                </p>
                <a
                  href={WHATSAPP_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#22c35e]"
                >
                  Join WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
                <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-foreground">Get an email reminder</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  One email before each session. No spam.
                </p>

                {status === 'success' || status === 'exists' ? (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                      <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {status === 'exists' ? "Already on the list" : "You're on the list"}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={status === 'loading'}
                      className="w-full rounded-lg border-0 bg-secondary/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    />

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        required
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-foreground"
                      />
                      <span className="text-xs text-muted-foreground leading-relaxed">
                        I agree to receive session reminder emails. I can{' '}
                        <a href="/unsubscribe" className="underline underline-offset-2 hover:text-foreground">unsubscribe</a>
                        {' '}anytime. See our{' '}
                        <a href="/terms" className="underline underline-offset-2 hover:text-foreground">terms &amp; privacy</a>.
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
