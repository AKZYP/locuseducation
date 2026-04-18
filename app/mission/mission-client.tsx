'use client'

import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'

type Phase = 'intro' | 'shrinking' | 'done'

const SIDE_EQUATIONS_LEFT = [
  { top: '14%', text: 'f(x) = ax² + bx + c' },
  { top: '32%', text: '∫ sin(x) dx = −cos(x) + C' },
  { top: '56%', text: 'lim  (1 + 1/n)ⁿ = e' },
  { top: '78%', text: 'P(A ∩ B) = P(A)·P(B)' },
]

const SIDE_EQUATIONS_RIGHT = [
  { top: '8%', text: "dy/dx = 2x + 3" },
  { top: '26%', text: 'a² + b² = c²' },
  { top: '48%', text: "f'(x) = lim (f(x+h)−f(x))/h" },
  { top: '68%', text: 'Σⁿ k = n(n+1)/2' },
  { top: '88%', text: 'y = mx + b' },
]

export function MissionClient() {
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === 'undefined') return 'intro'
    return sessionStorage.getItem('mission-intro-seen') ? 'done' : 'intro'
  })

  useEffect(() => {
    if (phase === 'done') return
    sessionStorage.setItem('mission-intro-seen', '1')
    const t1 = setTimeout(() => setPhase('shrinking'), 1800)
    const t2 = setTimeout(() => setPhase('done'), 3000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [phase])

  return (
    <>
      <style>{`
        :root {
          --paper: #faf7ef;
          --paper-line: #e5dfd0;
          --ink: #1c1a17;
          --ink-soft: #5a5349;
          --ink-muted: #8b8375;
          --olive: #6b7f4e;
          --olive-soft: #93a178;
          --rust: #b8562b;
        }
        .notebook {
          background-color: var(--paper);
          background-image:
            repeating-linear-gradient(
              transparent 0px,
              transparent 31px,
              var(--paper-line) 31px,
              var(--paper-line) 32px
            );
          color: var(--ink);
        }
        .ink       { color: var(--ink); }
        .ink-soft  { color: var(--ink-soft); }
        .ink-muted { color: var(--ink-muted); }
        .olive     { color: var(--olive); }
        .rust      { color: var(--rust); }
        .serif {
          font-family: var(--font-serif), 'Instrument Serif', Georgia, 'Times New Roman', serif;
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        .serif-italic {
          font-family: var(--font-serif), 'Instrument Serif', Georgia, serif;
          font-style: italic;
        }

        /* Intro animation ------------------------------------------------- */
        @keyframes intro-fade-in {
          0%   { opacity: 0; transform: translateY(14px); letter-spacing: 0.02em; }
          100% { opacity: 1; transform: translateY(0);    letter-spacing: -0.01em; }
        }
        @keyframes intro-underline {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes content-rise {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-drift {
          0%, 100% { transform: translate(0, 0) rotate(-0.5deg); opacity: 0.35; }
          50%      { transform: translate(10px, -8px) rotate(0.5deg); opacity: 0.55; }
        }
        .intro-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--paper);
          background-image:
            repeating-linear-gradient(
              transparent 0px, transparent 31px,
              var(--paper-line) 31px, var(--paper-line) 32px
            );
          transition: opacity 900ms cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .intro-title {
          text-align: center;
          max-width: 90vw;
          transition: transform 1100ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 800ms cubic-bezier(0.22, 1, 0.36, 1),
                      font-size 1100ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
          animation: intro-fade-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .hero-title.hidden-initial { opacity: 0; }
        .hero-title.reveal { animation: content-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both; }
        .content.hidden-initial { opacity: 0; pointer-events: none; }
        .content.reveal { animation: content-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) 400ms both; }

        .floating-eq {
          position: absolute;
          font-family: var(--font-serif), Georgia, serif;
          font-style: italic;
          color: var(--ink-muted);
          font-size: 15px;
          opacity: 0.35;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          animation: float-drift 14s ease-in-out infinite;
        }

        .doodle {
          position: absolute;
          pointer-events: none;
          opacity: 0.45;
          color: var(--ink-muted);
        }

        .accent-underline {
          position: relative;
          display: inline-block;
        }
        .accent-underline::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0.08em;
          height: 0.35em;
          background: color-mix(in oklab, var(--olive) 28%, transparent);
          z-index: -1;
          transform-origin: left;
          animation: intro-underline 900ms cubic-bezier(0.22, 1, 0.36, 1) 700ms both;
        }

        /* Reset outer bg so navbar area also looks like paper */
        .mission-root { min-height: 100vh; }
      `}</style>

      <div className="notebook mission-root relative overflow-hidden">
        <Navbar />

        {/* Decorative floating equations on the sides */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          {SIDE_EQUATIONS_LEFT.map((eq, i) => (
            <span
              key={`l-${i}`}
              className="floating-eq"
              style={{ top: eq.top, left: '3%', animationDelay: `${i * 1.4}s` }}
            >
              {eq.text}
            </span>
          ))}
          {SIDE_EQUATIONS_RIGHT.map((eq, i) => (
            <span
              key={`r-${i}`}
              className="floating-eq"
              style={{ top: eq.top, right: '3%', animationDelay: `${i * 1.8}s` }}
            >
              {eq.text}
            </span>
          ))}

          {/* Triangle doodle */}
          <svg className="doodle hidden lg:block" style={{ top: '10%', left: '2%' }} width="140" height="110" viewBox="0 0 140 110" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M10 95 L70 10 L130 95 Z" />
            <path d="M70 10 L70 95" strokeDasharray="3 3" />
            <text x="4" y="108" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">A</text>
            <text x="130" y="108" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">B</text>
            <text x="64" y="8" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">C</text>
          </svg>

          {/* Circle with radius */}
          <svg className="doodle hidden lg:block" style={{ bottom: '8%', right: '2%' }} width="130" height="130" viewBox="0 0 130 130" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="65" cy="65" r="55" />
            <path d="M65 65 L118 50" />
            <circle cx="65" cy="65" r="2" fill="currentColor" />
            <text x="85" y="52" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">r</text>
          </svg>

          {/* Parabola */}
          <svg className="doodle hidden lg:block" style={{ top: '48%', right: '4%' }} width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M5 85 Q60 -20 115 85" />
            <path d="M5 85 L115 85" strokeDasharray="3 3" />
            <text x="50" y="14" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">y = x²</text>
          </svg>
        </div>

        {/* Intro overlay */}
        {phase !== 'done' && (
          <div
            className="intro-overlay"
            style={{
              opacity: phase === 'shrinking' ? 0 : 1,
            }}
          >
            <h1
              className="intro-title serif ink"
              style={{
                fontSize: phase === 'shrinking' ? '2rem' : 'clamp(2.5rem, 7vw, 5.5rem)',
                transform: phase === 'shrinking' ? 'translateY(-30vh) scale(0.55)' : 'translateY(0)',
                opacity: phase === 'shrinking' ? 0 : 1,
                lineHeight: 1.05,
              }}
            >
              Education shouldn&apos;t be a{' '}
              <span className="serif-italic olive">pay-to-win</span> system.
            </h1>
          </div>
        )}

        {/* Main content */}
        <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-24">

          {/* Hero */}
          <header className={`space-y-8 pt-8 ${phase === 'done' ? '' : 'hidden-initial'}`}>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--rust)] animate-pulse" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] ink-muted">
                Our Mission
              </p>
            </div>
            <h1 className="serif text-5xl md:text-7xl ink leading-[1.05]">
              Education shouldn&apos;t be a{' '}
              <span className="serif-italic olive accent-underline">pay-to-win</span>{' '}
              system.
            </h1>
            <p className="serif-italic text-xl md:text-2xl ink-soft leading-relaxed max-w-2xl">
              But right now, it is. And I&apos;ve lived both sides of it.
            </p>
          </header>

          <div className={`content ${phase === 'done' ? '' : 'hidden-initial'}`}>

            {/* My Story */}
            <section className="mt-20 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[var(--paper-line)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] ink-muted">
                  My Story
                </p>
                <div className="h-px flex-1 bg-[var(--paper-line)]" />
              </div>

              <div className="space-y-6 text-[17px] ink-soft leading-[1.8]">
                <p className="first-letter:serif first-letter:text-5xl first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-none first-letter:ink">
                  Growing up, I watched my classmates walk into school with something I
                  didn&apos;t have — <span className="serif-italic ink">a tutor</span>.
                </p>
                <p>
                  Every Monday they&apos;d come in with worked solutions, practice papers,
                  and answers I was still struggling to figure out on my own. Not because
                  they were smarter. Not because they worked harder.
                </p>
                <p className="serif text-2xl md:text-3xl ink leading-snug py-2">
                  Because their parents could afford $100 an hour. Mine couldn&apos;t.
                </p>
                <p>
                  I remember asking my mum once. I remember the look on her face when she
                  had to say no. I never asked again.
                </p>
                <p>
                  So I did what kids in my position do — I taught myself. Late nights.
                  YouTube rabbit holes. PDFs bookmarked at 2am. Sometimes I caught up.
                  Sometimes I didn&apos;t. And every time report cards came around,
                  I&apos;d see the same gap between me and the kids who had help.
                </p>
                <p className="serif-italic text-xl ink">
                  It wasn&apos;t fair then. It isn&apos;t fair now.
                </p>
              </div>
            </section>

            {/* The Gap */}
            <section className="mt-20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive mb-6">
                The Gap
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-6 border-b border-[var(--paper-line)]">
                <div className="space-y-2">
                  <p className="serif text-6xl ink leading-none">
                    $100<span className="serif-italic text-2xl ink-muted">/hr</span>
                  </p>
                  <p className="text-sm ink-soft serif-italic">
                    what families pay for private tutoring
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="serif text-6xl olive leading-none">
                    $0<span className="serif-italic text-2xl ink-muted">/hr</span>
                  </p>
                  <p className="text-sm ink-soft serif-italic">
                    what everyone else has to work with
                  </p>
                </div>
              </div>
              <p className="mt-6 serif text-xl ink leading-relaxed">
                Same classroom. Same curriculum.{' '}
                <span className="serif-italic">Completely different outcomes.</span>
              </p>
            </section>

            {/* Pull quote */}
            <section className="mt-24 relative">
              <span className="serif absolute -top-10 -left-2 text-8xl olive opacity-30 leading-none">&ldquo;</span>
              <p className="serif text-3xl md:text-4xl ink leading-snug max-w-2xl pl-8">
                If I couldn&apos;t buy my way in,{' '}
                <span className="serif-italic olive">I&apos;d build the door myself.</span>
              </p>
              <p className="mt-4 pl-8 text-sm ink-muted serif-italic">— Why I started Locus</p>
            </section>

            {/* What This Is */}
            <section className="mt-24 space-y-8">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive">
                  What This Is
                </p>
                <h2 className="serif text-4xl md:text-5xl ink leading-[1.1]">
                  Real tutoring.{' '}
                  <span className="serif-italic">Zero cost.</span>{' '}
                  No catch.
                </h2>
                <p className="serif-italic text-lg ink-soft">
                  I&apos;m a university student, and I&apos;m giving away what I wish I had.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {[
                  {
                    title: 'Live Sessions',
                    desc: 'Weekly streams that break concepts down properly — not just slides being read.',
                    glyph: '∫',
                  },
                  {
                    title: 'Recordings',
                    desc: 'Miss it? Rewatch it. Every session stays up, forever.',
                    glyph: '▸',
                  },
                  {
                    title: 'Resources',
                    desc: 'Cheat sheets and study guides. Straight to the point. Save you hours.',
                    glyph: 'Σ',
                  },
                ].map(({ title, desc, glyph }) => (
                  <div
                    key={title}
                    className="relative bg-[color-mix(in_oklab,var(--paper)_60%,white_40%)] border border-[var(--paper-line)] rounded-sm p-6 hover:border-[var(--olive)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="serif olive text-4xl mb-3 leading-none">{glyph}</div>
                    <h3 className="serif text-xl ink mb-1.5">{title}</h3>
                    <p className="text-sm ink-soft leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* What It's Not */}
            <section className="mt-20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive mb-6">
                What It&apos;s Not
              </p>
              <div className="flex flex-wrap gap-3">
                {['Subscriptions', 'Hidden costs', 'Premium tiers', 'Free trials', 'Paywalls'].map(
                  (item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 border border-[var(--paper-line)] bg-[color-mix(in_oklab,var(--paper)_50%,white_50%)] rounded-full px-5 py-2"
                    >
                      <span className="rust text-base leading-none">✕</span>
                      <span className="serif-italic text-[15px] ink-soft">{item}</span>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* Why This Exists */}
            <section className="mt-24 relative py-12 border-y-2 border-[var(--ink)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] ink-muted mb-8">
                Why This Exists
              </p>
              <div className="space-y-2">
                <p className="serif text-5xl md:text-6xl ink leading-[1.05]">
                  Because ability isn&apos;t the issue.
                </p>
                <p className="serif-italic text-5xl md:text-6xl olive leading-[1.05]">
                  Access is.
                </p>
              </div>
              <p className="mt-8 text-lg ink-soft leading-relaxed max-w-xl">
                Your results shouldn&apos;t depend on what your parents can spend. And if I
                can do anything about that — even a little — I will.
              </p>
            </section>

            {/* How It Works */}
            <section className="mt-24">
              <div className="space-y-3 mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive">
                  How It Works
                </p>
                <h2 className="serif text-4xl md:text-5xl ink leading-[1.1]">
                  Three steps. <span className="serif-italic">That&apos;s it.</span>
                </h2>
              </div>
              <div className="space-y-8">
                {[
                  {
                    step: 'I.',
                    title: 'Join weekly live sessions',
                    desc: 'Show up online. Ask questions. Learn alongside other students in real time.',
                  },
                  {
                    step: 'II.',
                    title: 'Learn step-by-step',
                    desc: 'No skipping. No fluff. Concepts built from the ground up until they click.',
                  },
                  {
                    step: 'III.',
                    title: 'Rewatch + use resources',
                    desc: 'Every session recorded. Study guides always free. Revisit anything, anytime.',
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-6 items-start pb-8 border-b border-[var(--paper-line)] last:border-0">
                    <div className="serif-italic text-3xl olive leading-none tabular-nums pt-1 w-14 shrink-0">
                      {step}
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="serif text-2xl ink leading-snug">{title}</h3>
                      <p className="text-[15px] ink-soft leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* The Goal / CTA */}
            <section className="mt-24 text-center space-y-8 py-14 border-t-2 border-b-2 border-[var(--ink)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive">
                The Goal
              </p>
              <h2 className="serif text-4xl md:text-6xl ink leading-[1.1] max-w-2xl mx-auto">
                Help as many students as possible{' '}
                <span className="serif-italic olive">close the gap.</span>
              </h2>
              <p className="serif-italic text-xl ink-soft">
                That&apos;s it. That&apos;s the whole thing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-[var(--ink)] text-[var(--paper)] px-7 py-3.5 text-sm font-medium hover:-translate-y-0.5 transition-transform"
                >
                  Start learning — free
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="/calendar"
                  className="inline-flex items-center gap-2 border-2 border-[var(--ink)] text-[var(--ink)] px-7 py-3.5 text-sm font-medium hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-colors"
                >
                  See next session
                </a>
              </div>
            </section>

            <p className="mt-16 text-center serif-italic text-base ink-muted">
              Built by one student, for every student who shouldn&apos;t have to do this alone.
            </p>

          </div>
        </main>
      </div>
    </>
  )
}
