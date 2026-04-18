'use client'

import { useState, useEffect } from 'react'
import { getCalendarEvents, addCalendarEvent, deleteCalendarEvent, getScheduleSubjects, setScheduleSubject } from '@/lib/supabase-store'
import { SUBJECT_COLORS, QCE_SUBJECTS } from '@/lib/types'
import type { CalendarEvent, QCESubject } from '@/lib/types'

const DAY_LABEL: Record<QCESubject, string> = {
  Methods: 'Monday',
  Specialist: 'Tuesday',
  Physics: 'Wednesday',
  Chemistry: 'Thursday',
}

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [activeSubjects, setActiveSubjects] = useState<Record<string, boolean>>({
    Methods: true, Specialist: true, Physics: false, Chemistry: false,
  })
  const [togglingSubject, setTogglingSubject] = useState<QCESubject | null>(null)
  const [form, setForm] = useState({
    title: '',
    date: '',
    subject: 'Methods' as QCESubject,
    description: '',
  })

  useEffect(() => {
    Promise.all([loadEvents(), getScheduleSubjects().then(setActiveSubjects)])
  }, [])

  const handleSubjectToggle = async (subject: QCESubject) => {
    setTogglingSubject(subject)
    const next = !activeSubjects[subject]
    await setScheduleSubject(subject, next)
    setActiveSubjects(prev => ({ ...prev, [subject]: next }))
    setTogglingSubject(null)
  }

  const loadEvents = async () => {
    setLoading(true)
    const data = await getCalendarEvents()
    setEvents(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.date) return
    await addCalendarEvent(form)
    await loadEvents()
    setForm({ title: '', date: '', subject: 'Methods', description: '' })
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event?')) {
      await deleteCalendarEvent(id)
      await loadEvents()
    }
  }

  return (
    <div>
      {/* Weekly subject toggles */}
      <div className="mb-6 rounded-xl bg-white shadow-sm ring-1 ring-border/50 p-5">
        <h2 className="mb-1 text-sm font-semibold text-foreground">Weekly Schedule</h2>
        <p className="mb-4 text-xs text-muted-foreground">Toggle subjects on or off — changes apply to the public calendar immediately.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QCE_SUBJECTS.map(subject => {
            const isActive = !!activeSubjects[subject]
            const colors = SUBJECT_COLORS[subject]
            const isToggling = togglingSubject === subject
            return (
              <button
                key={subject}
                onClick={() => handleSubjectToggle(subject)}
                disabled={isToggling}
                className="flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200"
                style={{
                  borderColor: isActive ? colors.text + '40' : '#e2e8f0',
                  backgroundColor: isActive ? colors.shade : '#f8fafc',
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isActive ? colors.text : '#94a3b8' }}
                  >
                    {subject}
                  </span>
                  {/* Toggle pill */}
                  <div
                    className="relative h-4 w-7 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: isActive ? colors.text : '#cbd5e1' }}
                  >
                    <div
                      className="absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform duration-200"
                      style={{ transform: isActive ? 'translateX(14px)' : 'translateX(2px)' }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {DAY_LABEL[subject]} · 5:00 pm
                </span>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? colors.text : '#94a3b8' }}
                >
                  {isToggling ? 'Saving...' : isActive ? 'Active' : 'Off'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Schedule</h1>
          <p className="text-sm text-muted-foreground">{events.length} events</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add event
        </button>
      </div>

      {isAdding && (
        <div className="mb-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Add Event</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Title (e.g. Differentiation Techniques)"
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="What's being covered (e.g. Chain rule, product rule, optimisation problems)"
              className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {/* Subject picker */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Subject</p>
              <div className="flex flex-wrap gap-2">
                {QCE_SUBJECTS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, subject: s })}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-150"
                    style={{
                      backgroundColor: form.subject === s ? SUBJECT_COLORS[s].bg : '#f1f5f9',
                      color: form.subject === s ? SUBJECT_COLORS[s].text : '#94a3b8',
                      outline: form.subject === s ? `2px solid ${SUBJECT_COLORS[s].text}` : 'none',
                      outlineOffset: '2px',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-lg bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-border/50">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">No events yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: SUBJECT_COLORS[event.subject].text }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground truncate">{event.title}</h3>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: SUBJECT_COLORS[event.subject].bg,
                          color: SUBJECT_COLORS[event.subject].text,
                        }}
                      >
                        {event.subject}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-AU', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                      })}
                      {event.description && ` — ${event.description}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="ml-4 shrink-0 text-xs text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
