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
      className="mb-4 text-3xl font-semibold leading-tight text-foreground"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {showSeg1}
      {showSeg2 && <strong>{showSeg2}</strong>}
      {showSeg3}
      {showSeg4 && (
        <span className="relative inline-block">
          {showSeg4}
          {/* animated strike line */}
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: '52%',
              height: '2px',
              background: 'currentColor',
              transition: 'width 0.45s ease',
              width: isStriking ? '100%' : '0%',
            }}
          />
        </span>
      )}
      {/* $0 fades in after strike */}
      {showSeg4 === SEG4 && (
        <span
          style={{
            marginLeft: '0.35em',
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          $0
        </span>
      )}
      {/* blinking cursor while typing */}
      {phase === 'typing' && (
        <span className="animate-pulse">|</span>
      )}
    </p>
  )
}
