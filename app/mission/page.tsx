import { Navbar } from '@/components/navbar'

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-2xl px-4 pt-24 pb-16">
        <article className="space-y-8">
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Our Mission</p>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Quality education shouldn&apos;t cost $100 an hour
            </h1>
          </header>

          <div className="h-px bg-border" />

          <section className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
            <p>
              Private tutoring for QCE Maths Methods costs $60 to $150 per hour. For many students, 
              quality guidance is out of reach. Those who can afford it get ahead. Those who 
              can&apos;t are left behind.
            </p>
            <p>
              Your family&apos;s income shouldn&apos;t determine your academic success.
            </p>
          </section>

          <section className="rounded-xl bg-secondary/30 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">How it works</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white">1</span>
                <span>Weekly livestreams breaking down Methods concepts step by step</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white">2</span>
                <span>Every session recorded and uploaded for you to rewatch anytime</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-medium text-white">3</span>
                <span>Free resources, cheat sheets, and study guides</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
            <p>
              No sign-ups. No paywalls. No premium tiers. No &quot;free trial&quot; that expires.
            </p>
            <p>
              If you have knowledge that can help others, charging for it when you don&apos;t 
              need to creates unnecessary barriers. The goal is simple: help as many students 
              succeed as possible.
            </p>
          </section>

          <div className="rounded-xl bg-foreground p-5 text-center">
            <p className="mb-3 text-lg font-semibold text-white">100% free. Always.</p>
            <p className="mb-4 text-sm text-white/70">Just education for anyone who wants to learn</p>
            <a
              href="/"
              className="inline-flex rounded-lg bg-white px-5 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-white/90"
            >
              Start learning
            </a>
          </div>
        </article>
      </main>
    </div>
  )
}
