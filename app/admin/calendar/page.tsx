'use client'

import { useState, useEffect } from 'react'
import { getCalendarEvents, addCalendarEvent, deleteCalendarEvent } from '@/lib/supabase-store'
import { EVENT_COLORS } from '@/lib/types'
import type { CalendarEvent, EventColor } from '@/lib/types'

const COLOR_KEYS = Object.keys(EVENT_COLORS) as EventColor[]

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({
    title: '',
    date: '',
    color: 'blue' as EventColor,
    description: '',
  })

  useEffect(() => {
    loadEvents()
  }, [])

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
    setForm({ title: '', date: '', color: 'blue', description: '' })
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
                placeholder="Title (e.g. Unit 3 Differentiation)"
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
              placeholder="Description (optional)"
              className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {/* Color picker */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Colour</p>
              <div className="flex gap-2">
                {COLOR_KEYS.map(key => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, color: key })}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                      form.color === key ? 'ring-2 ring-offset-2 ring-foreground/40' : ''
                    }`}
                    style={{ backgroundColor: EVENT_COLORS[key].bg }}
                    title={EVENT_COLORS[key].label}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: EVENT_COLORS[key].text }}
                    />
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
                    style={{ backgroundColor: EVENT_COLORS[event.color].text }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-foreground truncate">{event.title}</h3>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: EVENT_COLORS[event.color].bg,
                          color: EVENT_COLORS[event.color].text,
                        }}
                      >
                        {EVENT_COLORS[event.color].label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-AU', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
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
