'use client'

import { useState, useEffect } from 'react'
import { getResources, addResource, deleteResource } from '@/lib/supabase-store'
import { TOPICS, SUBJECTS } from '@/lib/types'
import type { Resource, Topic, Subject } from '@/lib/types'

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileName: '',
    topic: 'Differentiation' as Topic,
    subject: 'Methods' as Subject
  })

  useEffect(() => {
    loadResources()
  }, [])

  const loadResources = async () => {
    setLoading(true)
    const data = await getResources()
    setResources(data)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.fileUrl) return
    
    await addResource(form)
    await loadResources()
    setForm({ title: '', description: '', fileUrl: '', fileName: '', topic: 'Differentiation', subject: 'Methods' })
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this resource?')) {
      await deleteResource(id)
      await loadResources()
    }
  }

  const topicsForSelect = TOPICS.filter(t => t !== 'All Topics')

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Resources</h1>
          <p className="text-sm text-muted-foreground">{resources.length} total</p>
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
          <h2 className="mb-4 text-sm font-semibold text-foreground">Add Resource</h2>
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
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="url"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                placeholder="File URL (Google Drive, Dropbox, etc.)"
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
              <input
                type="text"
                value={form.fileName}
                onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                placeholder="File name (e.g. cheat-sheet.pdf)"
                className="w-full rounded-lg border-0 bg-secondary/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
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
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">No resources yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground truncate">{resource.title}</h3>
                    <span className="shrink-0 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {resource.topic}
                    </span>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {resource.subject}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground truncate">{resource.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(resource.id)}
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
