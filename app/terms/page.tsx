import { Navbar } from '@/components/navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 pt-24 pb-16">
        <article className="space-y-8">
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Legal</p>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Terms &amp; Privacy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Last updated April 2025</p>
          </header>

          <div className="h-px bg-border" />

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">What we collect</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              When you sign up for notifications, we store your email address. That&apos;s it.
              No passwords, no tracking, no cookies beyond what Next.js needs to serve the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">What we use it for</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              We use your email to send reminders before Locus live sessions.
              One email per session — no newsletters, no promotions, no third-party sharing.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Opting out</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              You can remove yourself from the list at any time — no questions asked.
            </p>
            <a
              href="/unsubscribe"
              className="inline-flex rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary/70"
            >
              Unsubscribe
            </a>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Who we are</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Locus Education is a student-run initiative providing free QCE tutoring in Queensland,
              Australia. We are not a registered business. If you have any questions, reach out via the
              contact details on our social pages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Changes</h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              If we change how we use your data, we&apos;ll update this page and the date above.
              Continuing to be subscribed after a change means you accept the updated terms.
            </p>
          </section>
        </article>
      </main>
    </div>
  )
}
