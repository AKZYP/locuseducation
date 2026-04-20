'use client'

import { useEffect, useRef, useState } from 'react'
import { Navbar } from '@/components/navbar'

type Phase = 'typing' | 'shrinking' | 'done'

const TYPING_TEXT     = "Education shouldn\u2019t be a pay-to-win system."
const TYPING_SPEED    = 52
const SEG_PREFIX_END  = 25
const SEG_HIGHLIGHT_END = 35

const SIDE_EQUATIONS_LEFT = [
  { top: '14%', text: 'f(x) = ax² + bx + c' },
  { top: '32%', text: '∫ sin(x) dx = −cos(x) + C' },
  { top: '56%', text: 'lim  (1 + 1/n)ⁿ = e' },
  { top: '78%', text: 'P(A ∩ B) = P(A)·P(B)' },
]

const SIDE_EQUATIONS_RIGHT = [
  { top: '8%',  text: 'dy/dx = 2x + 3' },
  { top: '26%', text: 'a² + b² = c²' },
  { top: '48%', text: "f'(x) = lim (f(x+h)−f(x))/h" },
  { top: '68%', text: 'Σⁿ k = n(n+1)/2' },
  { top: '88%', text: 'y = mx + b' },
]

export function MissionClient() {
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === 'undefined') return 'typing'
    return sessionStorage.getItem('mission-intro-seen') ? 'done' : 'typing'
  })
  const [displayed, setDisplayed] = useState('')
  const [cursorOn, setCursorOn] = useState(true)
  const eqsRef = useRef<HTMLSpanElement[]>([])

  // Mouse parallax on floating equations
  useEffect(() => {
    if (phase !== 'done') return
    const onMouse = (e: MouseEvent) => {
      const dx = (e.clientX / window.innerWidth  - 0.5) * 16
      const dy = (e.clientY / window.innerHeight - 0.5) * 10
      eqsRef.current.forEach((el, i) => {
        if (!el) return
        const factor = (i % 3 === 0 ? 1 : i % 3 === 1 ? 0.6 : 0.3)
        el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`
      })
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    return () => window.removeEventListener('mousemove', onMouse)
  }, [phase])

  // Scroll-reveal IntersectionObserver
  useEffect(() => {
    if (phase !== 'done') return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(el => { if (el.isIntersecting) el.target.classList.add('in-view') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el))

    // Timeline line draw
    const lineObs = new IntersectionObserver(
      (entries) => entries.forEach(el => { if (el.isIntersecting) el.target.classList.add('in-view') }),
      { threshold: 0.2 }
    )
    document.querySelectorAll('.timeline-line, .not-group, .stat-counter').forEach(el => lineObs.observe(el))

    return () => { observer.disconnect(); lineObs.disconnect() }
  }, [phase])

  // Typewriter intro
  useEffect(() => {
    if (phase === 'done') return
    let i = 0
    let blinkId: ReturnType<typeof setInterval>
    const typer = setInterval(() => {
      i++
      setDisplayed(TYPING_TEXT.slice(0, i))
      if (i >= TYPING_TEXT.length) {
        clearInterval(typer)
        blinkId = setInterval(() => setCursorOn(v => !v), 450)
        setTimeout(() => {
          clearInterval(blinkId)
          setCursorOn(false)
          setPhase('shrinking')
          setTimeout(() => {
            sessionStorage.setItem('mission-intro-seen', '1')
            setPhase('done')
          }, 1000)
        }, 900)
      }
    }, TYPING_SPEED)
    return () => { clearInterval(typer); clearInterval(blinkId) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function renderTypedText() {
    const n = displayed.length
    const prefix    = displayed.slice(0, Math.min(n, SEG_PREFIX_END))
    const highlight = n > SEG_PREFIX_END    ? displayed.slice(SEG_PREFIX_END, Math.min(n, SEG_HIGHLIGHT_END)) : ''
    const suffix    = n > SEG_HIGHLIGHT_END ? displayed.slice(SEG_HIGHLIGHT_END, n) : ''
    return (
      <>
        {prefix}
        {highlight && <span className="serif-italic olive">{highlight}</span>}
        {suffix}
        {phase !== 'done' && cursorOn && <span className="tw-cursor">|</span>}
      </>
    )
  }

  return (
    <>
      <style>{`
        :root {
          --paper:      #faf7ef;
          --paper-line: #e5dfd0;
          --ink:        #1c1a17;
          --ink-soft:   #5a5349;
          --ink-muted:  #8b8375;
          --olive:      #6b7f4e;
          --olive-soft: #93a178;
          --rust:       #b8562b;
          --reveal-dur: 0.7s;
        }

        .notebook {
          background-color: var(--paper);
          background-image: repeating-linear-gradient(
            transparent 0px, transparent 31px,
            var(--paper-line) 31px, var(--paper-line) 32px
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

        /* ── Typewriter cursor ── */
        .tw-cursor {
          display: inline-block;
          font-weight: 300;
          color: var(--ink);
          margin-left: 1px;
        }

        /* ── Intro overlay ── */
        .intro-overlay {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--paper);
          background-image: repeating-linear-gradient(
            transparent 0px, transparent 31px,
            var(--paper-line) 31px, var(--paper-line) 32px
          );
          transition: opacity 800ms cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .intro-title {
          text-align: center;
          max-width: 80vw;
          transition:
            transform 1000ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity   800ms cubic-bezier(0.22, 1, 0.36, 1),
            font-size 1000ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }

        /* ── Content reveal ── */
        @keyframes content-rise {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .content-hidden { opacity: 0; pointer-events: none; }
        .content-reveal { animation: content-rise 1s cubic-bezier(0.22, 1, 0.36, 1) 100ms both; }

        /* ── Accent underline ── */
        @keyframes intro-underline {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
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
          animation: intro-underline 900ms cubic-bezier(0.22, 1, 0.36, 1) 300ms both;
        }

        /* ── Floating equations ── */
        @keyframes float-drift {
          0%, 100% { transform: translate(0, 0) rotate(-0.5deg); }
          50%      { transform: translate(8px, -7px) rotate(0.5deg); }
        }
        @keyframes eq-in-left {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 0.45; transform: translateX(0); }
        }
        @keyframes eq-in-right {
          from { opacity: 0; transform: translateX(32px); }
          to   { opacity: 0.45; transform: translateX(0); }
        }
        .floating-eq {
          position: absolute;
          font-family: var(--font-serif), Georgia, serif;
          font-style: italic;
          color: var(--ink-muted);
          font-size: 15px;
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .floating-eq.from-left {
          animation:
            eq-in-left 1.1s cubic-bezier(0.22,1,0.36,1) both,
            float-drift 16s ease-in-out 1.1s infinite;
        }
        .floating-eq.from-right {
          animation:
            eq-in-right 1.1s cubic-bezier(0.22,1,0.36,1) both,
            float-drift 16s ease-in-out 1.1s infinite;
        }

        /* ── Scroll reveals — 4 directions ── */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity var(--reveal-dur) cubic-bezier(0.22, 1, 0.36, 1),
            transform var(--reveal-dur) cubic-bezier(0.22, 1, 0.36, 1);
        }
        .scroll-reveal.from-left  { transform: translateX(-40px); }
        .scroll-reveal.from-right { transform: translateX(40px); }
        .scroll-reveal.scale-in   { transform: scale(0.94); }
        .scroll-reveal.in-view    { opacity: 1; transform: translateY(0) translateX(0) scale(1); }

        /* ── Chapter label ── */
        .chapter-label {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chapter-label::before {
          content: '';
          height: 1px;
          flex: 1;
          background: var(--paper-line);
        }
        .chapter-label::after {
          content: '';
          height: 1px;
          flex: 1;
          background: var(--paper-line);
        }

        /* ── Stat counter numbers ── */
        .stat-counter { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .stat-counter.in-view { opacity: 1; transform: translateY(0); }
        .stat-number {
          background: linear-gradient(135deg, var(--ink) 0%, var(--olive) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Highlight marker animation ── */
        @keyframes marker-in {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        .highlight-marker {
          position: relative;
          display: inline;
        }
        .highlight-marker::after {
          content: '';
          position: absolute;
          left: -2px; right: -2px; bottom: 0;
          height: 0.4em;
          background: color-mix(in oklab, var(--olive) 22%, transparent);
          z-index: -1;
          transform-origin: left;
          transform: scaleX(0);
        }
        .in-view .highlight-marker::after {
          animation: marker-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
        }

        /* ── What It's Not ── */
        .not-x-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
        }
        .not-group.in-view .not-x-line-1 {
          animation: draw-x 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
        }
        .not-group.in-view .not-x-line-2 {
          animation: draw-x 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.35s both;
        }
        @keyframes draw-x {
          to { stroke-dashoffset: 0; }
        }
        .not-item {
          opacity: 0;
          transform: translateX(-12px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .not-group.in-view .not-item:nth-child(1) { opacity: 1; transform: none; transition-delay: 0.05s; }
        .not-group.in-view .not-item:nth-child(2) { opacity: 1; transform: none; transition-delay: 0.12s; }
        .not-group.in-view .not-item:nth-child(3) { opacity: 1; transform: none; transition-delay: 0.19s; }
        .not-group.in-view .not-item:nth-child(4) { opacity: 1; transform: none; transition-delay: 0.26s; }
        .not-group.in-view .not-item:nth-child(5) { opacity: 1; transform: none; transition-delay: 0.33s; }

        /* ── Timeline ── */
        .timeline-line {
          position: relative;
        }
        .timeline-line::before {
          content: '';
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--paper-line);
          transform-origin: top;
          transform: scaleY(0);
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .timeline-line.in-view::before { transform: scaleY(1); }

        .timeline-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid var(--olive);
          background: var(--paper);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .timeline-dot:hover { background: var(--olive); border-color: var(--olive); }
        .timeline-dot:hover .timeline-step { color: var(--paper); }

        .timeline-step {
          font-family: var(--font-serif), Georgia, serif;
          font-style: italic;
          font-size: 14px;
          color: var(--olive);
          transition: color 0.3s ease;
        }

        /* ── Pull quote ── */
        .pull-quote-bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--olive);
          transform-origin: top;
          transform: scaleY(0);
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;
        }
        .scroll-reveal.in-view .pull-quote-bar { transform: scaleY(1); }

        /* ── Big stat inline ── */
        .ink-stat {
          display: inline-block;
          padding: 0 4px;
          background: color-mix(in oklab, var(--olive) 12%, transparent);
          border-radius: 2px;
          transition: background 0.3s ease;
        }
        .ink-stat:hover { background: color-mix(in oklab, var(--olive) 22%, transparent); }

        /* ── CTA button ── */
        .cta-primary {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ink);
          color: var(--paper);
          padding: 14px 28px;
          font-size: 14px;
          font-weight: 500;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cta-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--olive);
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cta-primary:hover::after { transform: translateX(0); }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(28,26,23,0.18); }
        .cta-primary span { position: relative; z-index: 1; }

        .cta-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid var(--ink);
          color: var(--ink);
          padding: 14px 28px;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .cta-outline:hover {
          background: var(--ink);
          color: var(--paper);
          transform: translateY(-2px);
        }

        /* ── Doodles ── */
        .doodle {
          position: absolute;
          pointer-events: none;
          opacity: 0.35;
          color: var(--ink-muted);
        }

        /* ── Reading progress ── */
        .reading-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: var(--olive);
          z-index: 100;
          transform-origin: left;
          transition: transform 0.1s linear;
        }

        /* ── Hover card lift ── */
        .card-hover {
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.28s ease,
                      box-shadow 0.28s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(28,26,23,0.09);
        }

        .mission-root { min-height: 100vh; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="notebook mission-root relative overflow-hidden">
        {/* Reading progress bar */}
        <ReadingProgress />

        <Navbar />

        {/* Floating equations */}
        <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
          {SIDE_EQUATIONS_LEFT.map((eq, i) => (
            <span
              key={`l-${i}`}
              ref={el => { if (el) eqsRef.current[i] = el }}
              className="floating-eq from-left"
              style={{ top: eq.top, left: '3%', animationDelay: `${i * 1.3}s, ${i * 1.3}s` }}
            >
              {eq.text}
            </span>
          ))}
          {SIDE_EQUATIONS_RIGHT.map((eq, i) => (
            <span
              key={`r-${i}`}
              ref={el => { if (el) eqsRef.current[SIDE_EQUATIONS_LEFT.length + i] = el }}
              className="floating-eq from-right"
              style={{ top: eq.top, right: '3%', animationDelay: `${i * 1.6}s, ${i * 1.6}s` }}
            >
              {eq.text}
            </span>
          ))}

          {/* Doodle: Triangle */}
          <svg className="doodle hidden lg:block" style={{ top: '10%', left: '2%' }} width="140" height="110" viewBox="0 0 140 110" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M10 95 L70 10 L130 95 Z" />
            <path d="M70 10 L70 95" strokeDasharray="3 3" />
            <text x="4"   y="108" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">A</text>
            <text x="130" y="108" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">B</text>
            <text x="64"  y="8"   fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">C</text>
          </svg>

          {/* Doodle: Circle */}
          <svg className="doodle hidden lg:block" style={{ bottom: '8%', right: '2%' }} width="130" height="130" viewBox="0 0 130 130" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="65" cy="65" r="55" />
            <path d="M65 65 L118 50" />
            <circle cx="65" cy="65" r="2" fill="currentColor" />
            <text x="85" y="52" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">r</text>
          </svg>

          {/* Doodle: Parabola */}
          <svg className="doodle hidden lg:block" style={{ top: '48%', right: '4%' }} width="120" height="90" viewBox="0 0 120 90" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M5 85 Q60 -20 115 85" />
            <path d="M5 85 L115 85" strokeDasharray="3 3" />
            <text x="50" y="14" fontSize="10" fill="currentColor" stroke="none" fontStyle="italic">y = x²</text>
          </svg>

          {/* Doodle: Sine wave */}
          <svg className="doodle hidden lg:block" style={{ top: '28%', left: '1%' }} width="100" height="50" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 25 C10 5, 20 5, 30 25 S50 45, 60 25 S80 5, 90 25" />
            <text x="30" y="45" fontSize="9" fill="currentColor" stroke="none" fontStyle="italic">sin(x)</text>
          </svg>
        </div>

        {/* Typewriter intro overlay */}
        {phase !== 'done' && (
          <div
            className="intro-overlay"
            style={{ opacity: phase === 'shrinking' ? 0 : 1 }}
          >
            <h1
              className="intro-title serif ink"
              style={{
                fontSize:  phase === 'shrinking' ? '2rem' : 'clamp(3rem, 8vw, 6.5rem)',
                transform: phase === 'shrinking' ? 'translateY(-32vh) scale(0.52)' : 'translateY(0)',
                opacity:   phase === 'shrinking' ? 0 : 1,
                lineHeight: 1.08,
              }}
            >
              {renderTypedText()}
            </h1>
          </div>
        )}

        {/* ── Main content ── */}
        <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-32">

          {/* ── Hero ── */}
          <header className={`space-y-8 pt-8 ${phase === 'done' ? 'content-reveal' : 'content-hidden'}`}>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--rust)] animate-pulse" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] ink-muted">Our Mission</p>
            </div>
            <h1 className="serif text-5xl md:text-7xl ink leading-[1.05]">
              Education shouldn&apos;t be a{' '}
              <span className="serif-italic olive accent-underline">pay-to-win</span>{' '}
              system.
            </h1>
            <p className="serif-italic text-xl md:text-2xl ink-soft leading-relaxed max-w-2xl">
              But right now, it is. And I&apos;ve lived both sides of it.
            </p>
            {/* Scroll cue */}
            <div className="flex items-center gap-2 pt-4">
              <div className="scroll-cue-dot" aria-hidden />
              <p className="text-[11px] ink-muted uppercase tracking-[0.16em]">Scroll to read</p>
            </div>
            <style>{`
              .scroll-cue-dot {
                width: 6px; height: 6px;
                border-radius: 50%;
                background: var(--olive);
                animation: bounce-dot 1.6s ease-in-out infinite;
              }
              @keyframes bounce-dot {
                0%, 100% { transform: translateY(0); opacity: 1; }
                50% { transform: translateY(5px); opacity: 0.5; }
              }
            `}</style>
          </header>

          <div className={phase === 'done' ? 'content-reveal' : 'content-hidden'}>

            {/* ── My Story ── */}
            <section className="mt-24 space-y-10">
              <div className="chapter-label scroll-reveal">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] ink-muted">My Story</p>
              </div>

              <p className="serif-italic text-sm ink-muted -mt-4 scroll-reveal" style={{ transitionDelay: '0.05s' }}>by Rishabh Patel</p>

              {/* Opening stat */}
              <div className="scroll-reveal space-y-2" style={{ transitionDelay: '0.08s' }}>
                <p className="text-[17px] ink-soft leading-7">
                  I used to charge{' '}
                  <span className="serif ink font-semibold ink-stat">$70 to $100 an hour</span>{' '}
                  per student.
                </p>
                <div className="my-6 border-l-2 border-[var(--olive)] pl-5">
                  <p className="serif text-2xl md:text-3xl ink leading-snug">
                    At one point I had enough students to make{' '}
                    <span className="olive">$500+ a week</span>{' '}
                    for 7–8 hours of work.
                  </p>
                </div>
              </div>

              {/* Drop */}
              <p className="serif text-3xl md:text-4xl ink leading-snug scroll-reveal from-left">
                Then I dropped all of it.
              </p>

              {/* Grade 12 */}
              <div className="space-y-5 text-[17px] ink-soft leading-7 scroll-reveal" style={{ transitionDelay: '0.06s' }}>
                <p>When I was in grade 12, I had a tutor.</p>
                <p>
                  In all honesty, while it helped, I didn&apos;t benefit that much from the teaching.
                  It was mainly the <span className="serif-italic ink">idea</span> that I was paying that forced me to lock in.
                </p>
              </div>

              <p className="serif text-2xl md:text-3xl ink leading-snug scroll-reveal from-right">
                Then I became the tutor.
              </p>

              <div className="space-y-5 text-[17px] ink-soft leading-7 scroll-reveal">
                <p>
                  I had proof I was good at this.{' '}
                  <span className="serif ink font-semibold ink-stat">99.85 ATAR.</span>{' '}
                  Being a high school teacher is something I hope to start doing when I&apos;m older.
                  I could explain things clearly, and students gave positive feedback.
                </p>
                <p>
                  But every time a student paid me, it felt awkward.{' '}
                  <span className="serif-italic ink">Transactional.</span>
                </p>
                <p>The more I thought about it, the less I liked the model.</p>
                <p>I didn&apos;t want to spend my limited free time helping a small number of people who could afford it.</p>
                <p>I&apos;d rather help more people for a fraction of the price.</p>
              </div>

              {/* FREE.99 */}
              <div className="py-8 border-y border-[var(--paper-line)] scroll-reveal scale-in">
                <p className="serif text-5xl md:text-6xl ink leading-none tracking-tight">
                  $FREE.99
                </p>
                <p className="mt-3 text-sm ink-muted serif-italic">
                  ($0 — and yeah, 0 isn&apos;t technically a fraction of an integer, but you get the point.)
                </p>
              </div>

              <div className="space-y-5 text-[17px] ink-soft leading-7 scroll-reveal">
                <p className="serif text-2xl md:text-3xl ink">So I dropped it.</p>
                <p>Believe me, it was some of the easiest money I could make.</p>
                <p className="serif-italic text-[15px] ink-muted">I just didn&apos;t want to keep making it that way.</p>
              </div>
            </section>

            {/* ── Pull quote ── */}
            <section className="mt-16 scroll-reveal">
              <div className="relative pl-8">
                <div className="pull-quote-bar" />
                <span className="serif absolute -top-8 -left-1 text-8xl olive opacity-25 leading-none select-none">&ldquo;</span>
                <p className="serif text-3xl md:text-4xl ink leading-snug max-w-2xl">
                  If I could take easy money from this system,{' '}
                  <span className="serif-italic olive">I can also be the one to break it.</span>
                </p>
                <p className="mt-5 text-sm ink-muted serif-italic">— Why I started Locus</p>
              </div>
            </section>

            {/* ── What This Is ── */}
            <section className="mt-28 space-y-8">
              <div className="space-y-3 scroll-reveal">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive">What This Is</p>
                <h2 className="serif text-4xl md:text-5xl ink leading-[1.1]">
                  Real tutoring.{' '}
                  <span className="serif-italic">Zero cost.</span>{' '}
                  No catch.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {[
                  { title: 'Live Sessions', desc: 'Weekly streams that break concepts down properly — not just slides being read.', glyph: '∫', href: '/calendar' },
                  { title: 'Recordings',    desc: 'Miss it? Rewatch it. Every session stays up, forever.',                         glyph: '▸', href: '/' },
                  { title: 'Resources',     desc: 'Cheat sheets and study guides. Straight to the point. Save you hours.',          glyph: 'Σ', href: '/resources' },
                ].map(({ title, desc, glyph, href }, i) => (
                  <a
                    key={title}
                    href={href}
                    className="scroll-reveal card-hover relative bg-[color-mix(in_oklab,var(--paper)_60%,white_40%)] border border-[var(--paper-line)] rounded-sm p-6 hover:border-[var(--olive)] block"
                    style={{ transitionDelay: `${i * 0.12}s` }}
                  >
                    <div className="serif olive text-4xl mb-3 leading-none">{glyph}</div>
                    <h3 className="serif text-xl ink mb-1.5">{title}</h3>
                    <p className="text-sm ink-soft leading-relaxed">{desc}</p>
                    <span className="mt-4 text-xs ink-muted flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more <span aria-hidden>→</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* ── What It's Not ── */}
            <section className="mt-24 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] rust mb-8 scroll-reveal">What It&apos;s Not</p>
              <div className="not-group scroll-reveal relative max-w-xs mx-auto">
                <div className="space-y-1 py-2">
                  {['Subscriptions', 'Hidden costs', 'Premium tiers', 'Free trials', 'Paywalls'].map((item) => (
                    <p key={item} className="not-item serif text-3xl md:text-4xl ink-soft">{item}</p>
                  ))}
                </div>
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <line className="not-x-line not-x-line-1" x1="2" y1="2" x2="98" y2="98" stroke="var(--rust)" strokeWidth="1.5" strokeLinecap="round" />
                  <line className="not-x-line not-x-line-2" x1="98" y1="2" x2="2" y2="98" stroke="var(--rust)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </section>

            {/* ── Why This Exists ── */}
            <section className="mt-28 relative py-14 border-y-2 border-[var(--ink)] scroll-reveal scale-in">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] ink-muted mb-8">Why This Exists</p>
              <div className="space-y-2">
                <p className="serif text-5xl md:text-6xl ink leading-[1.05] highlight-marker">
                  Because ability isn&apos;t the issue.
                </p>
                <p className="serif-italic text-5xl md:text-6xl olive leading-[1.05]">Access is.</p>
              </div>
              <p className="mt-8 text-lg ink-soft leading-relaxed max-w-xl">
                Your results shouldn&apos;t depend on what your parents can spend. And if I can do anything about that — even a little — I will.
              </p>
            </section>

            {/* ── How It Works (timeline) ── */}
            <section className="mt-28">
              <div className="space-y-3 mb-12 scroll-reveal">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive">How It Works</p>
                <h2 className="serif text-4xl md:text-5xl ink leading-[1.1]">
                  Three steps. <span className="serif-italic">That&apos;s it.</span>
                </h2>
              </div>

              <div className="timeline-line pl-0 space-y-0">
                {[
                  { step: 'I',   title: 'Join weekly live sessions', desc: 'Show up online. Ask questions. Learn alongside other students in real time.' },
                  { step: 'II',  title: 'Learn step-by-step',        desc: 'No skipping. No fluff. Concepts built from the ground up until they click.' },
                  { step: 'III', title: 'Rewatch + use resources',   desc: 'Every session recorded. Study guides always free. Revisit anything, anytime.' },
                ].map(({ step, title, desc }, i) => (
                  <div
                    key={step}
                    className="scroll-reveal flex gap-6 items-start pb-10 last:pb-0"
                    style={{ transitionDelay: `${i * 0.14}s` }}
                  >
                    <div className="timeline-dot shrink-0 mt-1">
                      <span className="timeline-step">{step}</span>
                    </div>
                    <div className="space-y-1.5 pt-2 pb-8 border-b border-[var(--paper-line)] last:border-0 w-full">
                      <h3 className="serif text-2xl ink leading-snug">{title}</h3>
                      <p className="text-[15px] ink-soft leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── CTA ── */}
            <section className="mt-28 text-center space-y-8 py-16 border-t-2 border-b-2 border-[var(--ink)] scroll-reveal">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] olive">The Goal</p>
              <h2 className="serif text-4xl md:text-6xl ink leading-[1.1] max-w-2xl mx-auto">
                Help as many students as possible{' '}
                <span className="serif-italic olive">close the gap.</span>
              </h2>
              <p className="serif-italic text-xl ink-soft">That&apos;s it. That&apos;s the whole thing.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <a href="/" className="cta-primary">
                  <span>Start learning — free</span>
                  <span aria-hidden>→</span>
                </a>
                <a href="/calendar" className="cta-outline">
                  See next session
                </a>
              </div>
            </section>

            <p className="mt-16 text-center serif-italic text-base ink-muted scroll-reveal">
              Built by one student, for every student who shouldn&apos;t have to do this alone.
            </p>

          </div>
        </main>
      </div>
    </>
  )
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? scrolled / total : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div
      className="reading-progress"
      style={{ transform: `scaleX(${progress})`, width: '100%' }}
      aria-hidden
    />
  )
}
