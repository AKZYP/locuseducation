'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { LiveCountdown } from '@/components/live-countdown'
import { VideoGrid } from '@/components/video-grid'
import { MottoText } from '@/components/motto-text'
import { SUBJECTS } from '@/lib/types'
import type { Subject } from '@/lib/types'

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Methods')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16">
        <div className="mb-6">
          <MottoText />

          {/* Subject tabs — above the countdown */}
          <div className="mb-4 flex items-center gap-1 rounded-xl bg-secondary/50 p-1">
            {SUBJECTS.map((subject) => {
              const isActive = selectedSubject === subject
              const isComingSoon = subject !== 'Methods'
              return (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-foreground shadow-sm'
                      : isComingSoon
                        ? 'text-muted-foreground/50'
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {subject}
                  {isComingSoon && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-60">Soon</span>
                  )}
                </button>
              )
            })}
          </div>

          <LiveCountdown subject={selectedSubject} />
        </div>

        <VideoGrid subject={selectedSubject} />
      </main>
    </div>
  )
}
