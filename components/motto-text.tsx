'use client'

import { useState, useEffect } from 'react'

// "Discounting premium education from $100/hr"
//  ^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^ ^^^^^^ ^^^^^^^
//  seg1 (12)    seg2 (17) bold    seg3   seg4 (7) → gets struck through
const SEG1 = 'Discounting '
const SEG2 = 'premium education'
const SEG3 = ' from '
const SEG4 = '$100/hr'
const FULL = SEG1 + SEG2 + SEG3 + SEG4

type Phase = 'typing' | 'striking' | 'revealed'

export function MottoText() {
  const [charCount, setCharCount] = useState(0)
  const [phase, setPhase] = useState<Phase>('typing')

  // Typewriter
  useEffect(() => {
    if (phase !== 'typing') return
    if (charCount < FULL.length) {
      const t = setTimeout(() => setCharCount(c => c + 1), 38)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setPhase('striking'), 350)
      return () => clearTimeout(t)
    }
  }, [charCount, phase])

  // After strike animates, reveal $0
  useEffect(() => {
    if (phase !== 'striking') return
    const t = setTimeout(() => setPhase('revealed'), 550)
    return () => clearTimeout(t)
  }, [phase])

  const s1End = SEG1.length                      // 12
  const s2End = s1End + SEG2.length              // 29
  const s3End = s2End + SEG3.length              // 35
  const s4End = s3End + SEG4.length              // 42

  const showSeg1 = FULL.slice(0, Math.min(charCount, s1End))
  const showSeg2 = charCount > s1End ? SEG2.slice(0, Math.min(charCount - s1End, SEG2.length)) : ''
  const showSeg3 = charCount > s2End ? SEG3.slice(0, Math.min(charCount - s2End, SEG3.length)) : ''
  const showSeg4 = charCount > s3End ? SEG4.slice(0, Math.min(charCount - s3End, SEG4.length)) : ''

  const isStriking = phase === 'striking' || phase === 'revealed'
  const isRevealed = phase === 'revealed'

  return (
    <p
      className="mb-4 text-3xl font-medium leading-tight text-foreground"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {showSeg1}
      {showSeg2 && (
        <em
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '1.15em',
            letterSpacing: '-0.01em',
            color: '#b45309',
          }}
        >
          {showSeg2}
        </em>
      )}
      {showSeg3}
      {showSeg4 && (
        <span className="relative inline-block">
          {showSeg4}
          {/* aggressive scribble */}
          <svg
            aria-hidden
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              left: '-6%',
              top: '-10%',
              width: '112%',
              height: '120%',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <path
              d="M 3 15 L 14 5 L 24 22 L 16 8 L 32 24 L 22 3 L 42 20 L 30 6 L 52 23 L 40 4 L 62 21 L 50 7 L 72 22 L 60 3 L 82 20 L 70 6 L 92 22 L 80 5 L 98 18 L 88 12 L 74 4 L 64 20 L 54 8 L 44 22 L 34 4 L 24 20 L 14 8 L 4 18"
              pathLength={100}
              stroke="#dc2626"
              strokeWidth={2.4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: isStriking ? 0 : 100,
                transition: 'stroke-dashoffset 0.55s cubic-bezier(0.5, 0, 0.5, 1)',
              }}
            />
          </svg>
        </span>
      )}
      {/* red arrow + $0 scales in after strike */}
      {showSeg4 === SEG4 && (
        <span
          style={{
            display: 'inline-block',
            marginLeft: '0.4em',
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'scale(1)' : 'scale(0.6)',
            transformOrigin: 'left center',
            transition: 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <span style={{ color: '#dc2626', fontWeight: 700, marginRight: '0.15em', fontSize: '0.9em' }}>→</span>
          <span style={{ fontSize: '1.6em', fontWeight: 700, letterSpacing: '-0.02em' }}>$0</span>
        </span>
      )}
      {/* blinking cursor while typing */}
      {phase === 'typing' && (
        <span className="animate-pulse">|</span>
      )}
    </p>
  )
}
