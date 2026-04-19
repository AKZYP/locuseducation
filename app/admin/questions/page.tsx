'use client'

import { useState, useEffect } from 'react'
import { getQuestionSubmissions, setQuestionStatus } from '@/lib/supabase-store'
import type { QuestionSubmission } from '@/lib/types'

type StatusTab = 'pending' | 'selected' | 'archived'

export default function AdminQuestionsPage() {
  const [submissions, setSubmissions] = useState<QuestionSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<StatusTab>('pending')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const data = await getQuestionSubmissions()
    setSubmissions(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, status: QuestionSubmission['status']) => {
    await setQuestionStatus(id, status)
    setSubmissions(prev => prev.map(q => q.id === id ? { ...q, status } : q))
  }

  const visible = submissions.filter(q => q.status === tab)
  const counts = {
    pending: submissions.filter(q => q.status === 'pending').length,
    selected: submissions.filter(q => q.status === 'selected').length,
    archived: submissions.filter(q => q.status === 'archived').length,
  }

  const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
    Methods:   { bg: '#dbeafe', text: '#1d4ed8' },
    Specialist: { bg: '#f3e8ff', text: '#7e22ce' },
  }

  const tabs: { key: StatusTab; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'selected', label: 'Selected' },
    { key: 'archived', label: 'Archived' },
  ]

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Student Questions</h1>
          <p className="text-sm text-muted-foreground">{submissions.length} total · {counts.pending} pending review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-lg bg-secondary/50 p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
              tab === t.key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
            {counts[t.key] > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                tab === t.key ? 'bg-secondary text-foreground' : 'bg-white/60 text-muted-foreground'
              }`}>
                {counts[t.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-white shadow-sm ring-1 ring-border/50">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">No {tab} submissions</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {visible.map((q) => {
              const colors = SUBJECT_COLORS[q.subject]
              const date = new Date(q.uploadedAt).toLocaleDateString('en-AU', {
                day: 'numeric', month: 'short', year: 'numeric'
              })
              return (
                <div key={q.id} className="flex items-center justify-between px-4 py-3 gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{q.fileName}</p>
                      <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: colors?.bg, color: colors?.text }}
                    >
                      {q.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={q.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View
                    </a>
                    {tab === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(q.id, 'selected')}
                          className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-foreground/90"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => updateStatus(q.id, 'archived')}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Archive
                        </button>
                      </>
                    )}
                    {tab === 'selected' && (
                      <button
                        onClick={() => updateStatus(q.id, 'archived')}
                        className="rounded-lg bg-secondary/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Unselect
                      </button>
                    )}
                    {tab === 'archived' && (
                      <button
                        onClick={() => updateStatus(q.id, 'pending')}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
