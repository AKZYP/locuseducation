import { Navbar } from '@/components/navbar'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 pt-24 pb-16">
        <header className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Get in touch</p>
          <h1 className="text-2xl font-semibold text-foreground leading-tight">Contact Us</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Interested in volunteering as a tutor, or have a question? Reach out to us.
          </p>
        </header>

        <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Email</p>
            <p className="text-sm text-muted-foreground italic">Coming soon</p>
          </div>
        </div>
      </main>
    </div>
  )
}
