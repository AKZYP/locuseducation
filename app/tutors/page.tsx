import { Navbar } from '@/components/navbar'

const TUTORS = [
  {
    name: 'Tutor Name',
    role: 'QCE Maths Methods',
    school: 'Year 12, Queensland',
    bio: 'Add a short bio here — your background, what you love about maths, and why you volunteer to help other students.',
    initials: 'TN',
    hue: '220',
  },
  {
    name: 'Tutor Name',
    role: 'QCE Maths Methods',
    school: 'Year 12, Queensland',
    bio: 'Add a short bio here — your background, what you love about maths, and why you volunteer to help other students.',
    initials: 'TN',
    hue: '160',
  },
  {
    name: 'Tutor Name',
    role: 'QCE Maths Methods',
    school: 'Year 12, Queensland',
    bio: 'Add a short bio here — your background, what you love about maths, and why you volunteer to help other students.',
    initials: 'TN',
    hue: '280',
  },
  {
    name: 'Tutor Name',
    role: 'QCE Maths Methods',
    school: 'Year 12, Queensland',
    bio: 'Add a short bio here — your background, what you love about maths, and why you volunteer to help other students.',
    initials: 'TN',
    hue: '30',
  },
]

export default function TutorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16">
        <header className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">Meet the team</p>
          <h1 className="text-2xl font-semibold text-foreground leading-tight">Our Tutors</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Volunteer tutors delivering free, high-quality QCE maths sessions every week.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TUTORS.map((tutor, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm"
            >
              {/* Avatar */}
              <div
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-semibold"
                style={{
                  backgroundColor: `hsl(${tutor.hue} 60% 92%)`,
                  color: `hsl(${tutor.hue} 60% 35%)`,
                }}
              >
                {tutor.initials}
              </div>

              <h2 className="text-[15px] font-semibold text-foreground">{tutor.name}</h2>
              <p className="mt-0.5 text-xs font-medium text-primary">{tutor.role}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{tutor.school}</p>

              <div className="my-3 h-px bg-border/50" />

              <p className="text-sm text-muted-foreground leading-relaxed">{tutor.bio}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
