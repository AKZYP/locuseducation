import { Navbar } from '@/components/navbar'
import { LiveCountdown } from '@/components/live-countdown'
import { VideoGrid } from '@/components/video-grid'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16">
        <div className="mb-6">
          <p className="mb-4 text-3xl font-semibold leading-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="line-through opacity-40">Discounting</span> premium education from $100/hr to $0
          </p>
          <LiveCountdown />
        </div>

        <VideoGrid />
      </main>
    </div>
  )
}
