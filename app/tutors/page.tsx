import { Navbar } from '@/components/navbar'
import { PageGate } from '@/components/page-gate'

const SUBJECT_STYLES: Record<string, { bg: string; text: string }> = {
  'Methods':   { bg: '#dbeafe', text: '#1d4ed8' },
  'Specialist': { bg: '#f3e8ff', text: '#7e22ce' },
  'Physics':   { bg: '#ffedd5', text: '#c2410c' },
  'Chemistry': { bg: '#dcfce7', text: '#15803d' },
}

const TUTORS = [
  {
    name: 'Tutor Name',
    uni: 'University Name',
    degree: 'Bachelor of Something',
    subjects: ['Methods', 'Specialist'],
    bio: 'Add a short bio here — your degree, what you enjoy about these subjects, and why you volunteer to help QCE students.',
    initials: 'TN',
    hue: '220',
  },
  {
    name: 'Tutor Name',
    uni: 'University Name',
    degree: 'Bachelor of Something',
    subjects: ['Physics', 'Chemistry'],
    bio: 'Add a short bio here — your degree, what you enjoy about these subjects, and why you volunteer to help QCE students.',
    initials: 'TN',
    hue: '160',
  },
  {
    name: 'Tutor Name',
    uni: 'University Name',
    degree: 'Bachelor of Something',
    subjects: ['Methods'],
    bio: 'Add a short bio here — your degree, what you enjoy about these subjects, and why you volunteer to help QCE students.',
    initials: 'TN',
    hue: '280',
  },
  {
    name: 'Tutor Name',
    uni: 'University Name',
    degree: 'Bachelor of Something',
    subjects: ['Specialist', 'Physics'],
    bio: 'Add a short bio here — your degree, what you enjoy about these subjects, and why you volunteer to help QCE students.',
    initials: 'TN',
    hue: '30',
  },
  {
    name: 'Tutor Name',
    uni: 'University Name',
    degree: 'Bachelor of Something',
    subjects: ['Chemistry'],
    bio: 'Add a short bio here — your degree, what you enjoy about these subjects, and why you volunteer to help QCE students.',
    initials: 'TN',
    hue: '340',
  },
  {
    name: 'Tutor Name',
    uni: 'University Name',
    degree: 'Bachelor of Something',
    subjects: ['Methods', 'Physics'],
    bio: 'Add a short bio here — your degree, what you enjoy about these subjects, and why you volunteer to help QCE students.',
    initials: 'TN',
    hue: '190',
  },
]

export default function TutorsPage() {
  return (
    <PageGate page="tutors">
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16">
        <header className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Meet the team</p>
          <h1 className="text-2xl font-semibold text-foreground leading-tight">Our Tutors</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            University students volunteering their time to deliver free QCE tutoring.
          </p>
        </header>

        <div className="mb-6">
          <a
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Interested in becoming a tutor?
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TUTORS.map((tutor, i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-base font-semibold"
                  style={{
                    backgroundColor: `hsl(${tutor.hue} 60% 92%)`,
                    color: `hsl(${tutor.hue} 60% 35%)`,
                  }}
                >
                  {tutor.initials}
                </div>

                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-foreground">{tutor.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{tutor.degree}</p>
                  <p className="text-xs text-muted-foreground">{tutor.uni}</p>
                </div>
              </div>

              {/* Subject badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tutor.subjects.map(s => (
                  <span
                    key={s}
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ backgroundColor: SUBJECT_STYLES[s].bg, color: SUBJECT_STYLES[s].text }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tutor.bio}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
    </PageGate>
  )
}
