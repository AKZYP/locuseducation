'use client'

import { useState, useEffect } from 'react'
import { getLiveStream, saveLiveStream } from '@/lib/supabase-store'
import type { LiveStream } from '@/lib/types'

export default function AdminLivestreamPage() {
  const [stream, setStream] = useState<LiveStream | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    scheduledDate: '',
    scheduledTime: '',
    youtubeUrl: '',
    description: ''
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadLiveStream()
  }, [])

  const loadLiveStream = async () => {
    setLoading(true)
    const data = await getLiveStream()
    if (data) {
      setStream(data)
      const date = new Date(data.scheduledDate)
      setForm({
        title: data.title,
        scheduledDate: date.toISOString().split('T')[0],
        scheduledTime: date.toTimeString().slice(0, 5),
        youtubeUrl: data.youtubeUrl || '',
        description: data.description
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const scheduledDate = new Date(`${form.scheduledDate}T${form.scheduledTime}`).toISOString()

    const updatedStream = {
      title: form.title,
      scheduledDate,
      youtubeUrl: form.youtubeUrl,
      description: form.description
    }

    const saved = await saveLiveStream(updatedStream)
    if (saved) {
      setStream(saved)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const generateWhatsAppMessage = () => {
    if (!form.title || !form.scheduledDate || !form.scheduledTime) {
      return null
    }

    const date = new Date(`${form.scheduledDate}T${form.scheduledTime}`)
    const dateStr = date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
    const timeStr = date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true })

    const message = `🎓 ${form.title}

📅 ${dateStr} at ${timeStr}
${form.description ? `📝 ${form.description}\n` : ''}
🔗 Watch live: ${form.youtubeUrl || 'Link TBA'}

See you there! 🚀`

    return message
  }

  const copyToClipboard = () => {
    const message = generateWhatsAppMessage()
    if (message) {
      navigator.clipboard.writeText(message)
      // Optional: show feedback
      const btn = document.activeElement as HTMLButtonElement
      const originalText = btn.textContent
      btn.textContent = 'Copied!'
      setTimeout(() => {
        btn.textContent = originalText
      }, 1500)
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-foreground">Livestream</h1>
        <p className="text-sm text-muted-foreground">Configure next session</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        </div>
      ) : (
      <>
      <div className="max-w-xl rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Weekly Methods Session: Topic"
              className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Date</label>
              <input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Time</label>
              <input
                type="time"
                value={form.scheduledTime}
                onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">YouTube URL</label>
            <input
              type="url"
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What will be covered?"
              rows={2}
              className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
              >
                Save
              </button>
              {saved && (
                <span className="text-xs text-green-600">Saved</span>
              )}
            </div>
            {generateWhatsAppMessage() && (
              <button
                type="button"
                onClick={copyToClipboard}
                className="w-full rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#22c35e]"
              >
                Copy WhatsApp message
              </button>
            )}
          </div>
        </form>
      </div>

      {form.title && (
        <div className="mt-5 max-w-xl space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">WhatsApp Message Preview</p>
            <div className="rounded-xl bg-[#ECE5DD] p-4 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap break-words">
              {generateWhatsAppMessage() || 'Fill in title, date, and time to preview'}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Site Preview</p>
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border/50">
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">Next Session</p>
              <h3 className="text-sm font-semibold text-foreground">{form.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{form.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {form.scheduledDate && form.scheduledTime
                  ? new Date(`${form.scheduledDate}T${form.scheduledTime}`).toLocaleString()
                  : 'Date and time not set'}
              </p>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  )
}
