import { Navbar } from '@/components/navbar'
import { PageGate } from '@/components/page-gate'

const portals = [
  {
    subject: 'Methods',
    slug: 'methods',
    description: 'QCE Maths Methods',
    color: 'bg-blue-50',
    dot: 'bg-blue-500',
  },
  {
    subject: 'Specialist',
    slug: 'specialist',
    description: 'QCE Specialist Maths',
    color: 'bg-purple-50',
    dot: 'bg-purple-500',
  },
]

export default function NotifyPage() {
  return (
    <PageGate page="notify">
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-lg px-4 pt-24 pb-16">
        <div className="space-y-6">
          <header>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Notifications</p>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              Stay in the loop
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick the subject you want notifications for.
            </p>
          </header>

          <div className="h-px bg-border" />

          <div className="space-y-3">
            {portals.map((p) => (
              <a
                key={p.slug}
                href={`/notify/${p.slug}`}
                className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50 transition-all duration-200 hover:shadow-md hover:ring-border"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${p.dot}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.subject}</p>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
    </PageGate>
  )
}
