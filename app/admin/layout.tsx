'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Show, UserButton, SignInButton } from '@clerk/nextjs'
import { useUser, useClerk } from '@clerk/nextjs'
import { useEffect } from 'react'

const ADMIN_EMAILS = ['apate934@gmail.com', 'Rishpatelau@gmail.com']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()

  const isAdmin = user?.emailAddresses?.some(
    email => ADMIN_EMAILS.includes(email.emailAddress)
  ) ?? false

  // Automatically sign out non-admin users
  useEffect(() => {
    if (isLoaded && user && !isAdmin) {
      signOut({ redirectUrl: '/' })
    }
  }, [isLoaded, user, isAdmin, signOut])

  const navItems = [
    { href: '/admin', label: 'Videos' },
    { href: '/admin/resources', label: 'Resources' },
    { href: '/admin/livestream', label: 'Livestream' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Show when="signed-out">
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="w-full max-w-xs text-center">
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-foreground">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-foreground mb-4">Admin Access</h1>
            <p className="text-sm text-muted-foreground mb-6">Please sign in to access the admin panel.</p>
            <SignInButton mode="modal" fallbackRedirectUrl="/admin">
              <button className="w-full rounded-lg bg-foreground py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90">
                Sign In
              </button>
            </SignInButton>
            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-muted-foreground hover:text-foreground">
                Back to site
              </Link>
            </div>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        {isLoaded && !isAdmin ? (
          <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-xs text-center">
              <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-foreground mb-2">Access Denied</h1>
              <p className="text-sm text-muted-foreground mb-6">You do not have permission to access the admin panel.</p>
              <div className="flex flex-col gap-2">
                <Link 
                  href="/" 
                  className="w-full rounded-lg bg-foreground py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
                >
                  Back to site
                </Link>
                <UserButton />
              </div>
            </div>
          </div>
        ) : (
          <>
            <header className="border-b border-border/50 bg-white">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-5">
                  <Link href="/admin" className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground">
                      <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-foreground">Admin</span>
                  </Link>
                  
                  <nav className="flex items-center gap-0.5">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-foreground text-white'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link
                    href="/"
                    className="text-[13px] text-muted-foreground hover:text-foreground"
                  >
                    View site
                  </Link>
                  <UserButton />
                </div>
              </div>
            </header>
            
            <main className="mx-auto max-w-5xl px-4 py-6">
              {children}
            </main>
          </>
        )}
      </Show>
    </div>
  )
}
