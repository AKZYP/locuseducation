'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { removeEmailSubscriber } from '@/lib/supabase-store'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'notfound' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const result = await removeEmailSubscriber(email)
    setStatus(result.notFound ? 'notfound' : result.success ? 'success' : 'error')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 pt-24 pb-16">
        <div className="space-y-6">
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Notifications</p>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Unsubscribe
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we&apos;ll remove you from the list immediately.
            </p>
          </header>

          <div className="h-px bg-border" />

          {status === 'success' ? (
            <div className="rounded-xl bg-secondary/40 p-6 text-center">
              <p className="text-base font-semibold text-foreground">Done — you&apos;re off the list</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You won&apos;t receive any more emails from us.
              </p>
              <a
                href="/"
                className="mt-4 inline-flex rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
              >
                Back to home
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
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

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90 disabled:opacity-50"
              >
                {status === 'loading' ? 'Removing…' : 'Unsubscribe'}
              </button>

              {status === 'notfound' && (
                <p className="text-xs text-muted-foreground">That email isn&apos;t on our list.</p>
              )}
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
