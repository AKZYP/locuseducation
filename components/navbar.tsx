'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/', label: 'Videos' },
    { href: '/resources', label: 'Resources' },
    { href: '/tutors', label: 'Tutors' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/mission', label: 'Our Mission' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="mx-auto max-w-6xl rounded-2xl sm:rounded-full border border-white/20 bg-white/60 shadow-sm backdrop-blur-2xl backdrop-saturate-150">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground">
              <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">locus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-0.5">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-foreground text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground"
            aria-label="Toggle menu"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden border-t border-border/50 px-4 py-3">
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-foreground text-white'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
