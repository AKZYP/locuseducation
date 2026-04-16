'use client'

import { useState, useEffect } from 'react'
import { getVideos, addVideo, deleteVideo } from '@/lib/supabase-store'
import { TOPICS, SUBJECTS } from '@/lib/types'
import type { Video, Topic, Subject } from '@/lib/types'

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    youtubeUrl: '',
    topic: 'Differentiation' as Topic,
    subject: 'Methods' as Subject,
    description: ''
  })

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setLoading(true)
    const data = await getVideos()
    setVideos(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.youtubeUrl) return
    
    await addVideo(form)
    await loadVideos()
    setForm({ title: '', youtubeUrl: '', topic: 'Differentiation', subject: 'Methods', description: '' })
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this video?')) {
      await deleteVideo(id)
      await loadVideos()
    }
  }

  const topicsForSelect = TOPICS.filter(t => t !== 'All Topics')

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Videos</h1>
          <p className="text-sm text-muted-foreground">{videos.length} total</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      {isAdding && (
        <div className="mb-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Add Video</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <input
                type="url"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                placeholder="YouTube URL"
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value as Subject })}
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value as Topic })}
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {topicsForSelect.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
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
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">No videos yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {videos.map((video) => (
              <div key={video.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground truncate">{video.title}</h3>
                    <span className="shrink-0 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {video.topic}
                    </span>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {video.subject}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{video.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
