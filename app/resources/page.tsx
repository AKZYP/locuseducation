'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Navbar } from '@/components/navbar'
import { PageGate } from '@/components/page-gate'
import { getResources, getSelectedQuestions } from '@/lib/supabase-store'
import { TOPICS, SUBJECTS } from '@/lib/types'
import type { Resource, Topic, Subject, QuestionSubmission } from '@/lib/types'

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<QuestionSubmission[]>([])
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<Topic>('All Topics')
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Methods')
  const [showFilters, setShowFilters] = useState(false)

  // Upload state
  const [uploadSubject, setUploadSubject] = useState<Subject>('Methods')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [uploadError, setUploadError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([getResources(), getSelectedQuestions()]).then(([r, q]) => {
      setResources(r)
      setSelectedQuestions(q)
    })
  }, [])

  const filteredResources = useMemo(() => {
    if (selectedSubject !== 'Methods') return []
    return resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(search.toLowerCase()) ||
        resource.description.toLowerCase().includes(search.toLowerCase())
      const matchesTopic = selectedTopic === 'All Topics' || resource.topic === selectedTopic
      return matchesSearch && matchesTopic
    })
  }, [resources, search, selectedTopic, selectedSubject])

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are accepted.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be under 5 MB.')
      return
    }
    setUploadError('')
    setUploadFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleUpload = async () => {
    if (!uploadFile) return
    setUploadStatus('loading')
    try {
      const form = new FormData()
      form.append('file', uploadFile)
      form.append('subject', uploadSubject)
      const res = await fetch('/api/upload-question', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error || 'Something went wrong.')
        setUploadStatus('error')
        return
      }
      setUploadStatus('success')
      setUploadFile(null)
    } catch {
      setUploadError('Something went wrong. Try again.')
      setUploadStatus('error')
    }
  }

  const resetUpload = () => {
    setUploadStatus('idle')
    setUploadFile(null)
    setUploadError('')
  }

  return (
    <PageGate page="resources">
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16">
        <div className="space-y-5">
          {/* Subject Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-secondary/50 p-1 overflow-x-auto scrollbar-hide">
            {SUBJECTS.map((subject) => {
              const isActive = selectedSubject === subject
              const isComingSoon = subject !== 'Methods'
              return (
                <button
                  key={subject}
                  onClick={() => !isComingSoon && setSelectedSubject(subject)}
                  disabled={isComingSoon}
                  className={`relative flex-1 min-w-[80px] rounded-lg py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-foreground shadow-sm'
                      : isComingSoon
                        ? 'cursor-not-allowed text-muted-foreground/50'
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {subject}
                  {isComingSoon && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-60">Soon</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Search and Filter Row */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-0 bg-secondary/50 py-2 pl-9 pr-3 sm:py-2.5 sm:pl-10 sm:pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                showFilters || selectedTopic !== 'All Topics'
                  ? 'bg-foreground text-white'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Filter</span>
              {selectedTopic !== 'All Topics' && (
                <span className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white/20 text-[10px] sm:text-xs">1</span>
              )}
            </button>
          </div>

          {/* Topic Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 rounded-xl bg-secondary/30 p-3">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedTopic === topic
                      ? 'bg-foreground text-white'
                      : 'bg-white text-muted-foreground hover:text-foreground shadow-sm'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}

          {/* Coming Soon State */}
          {selectedSubject !== 'Methods' ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="mb-1 font-medium text-foreground">{selectedSubject} coming soon</p>
              <p className="text-sm text-muted-foreground">We&apos;re working on adding {selectedSubject.toLowerCase()} maths resources</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="mb-1 font-medium text-foreground">No resources yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for study materials</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-border/50 transition-all duration-200 hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8">
                    <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <span className="mb-2 inline-block w-fit rounded-full bg-primary/8 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                    {resource.topic}
                  </span>

                  <h3 className="mb-1 text-sm font-semibold text-foreground">{resource.title}</h3>
                  <p className="mb-4 flex-1 text-xs text-muted-foreground leading-relaxed">{resource.description}</p>

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* This week's questions */}
          {selectedQuestions.length > 0 && (
            <div className="pt-2">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">This week&apos;s questions</span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
              <p className="mb-4 text-sm text-muted-foreground">Student-submitted questions we&apos;ll be covering in the upcoming session.</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedQuestions.map((q) => (
                  <a
                    key={q.id}
                    href={q.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-border/50 transition-all duration-200 hover:shadow-md hover:ring-border"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <svg className="h-4.5 w-4.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{q.fileName}</p>
                      <p className="text-xs text-muted-foreground">{q.subject}</p>
                    </div>
                    <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Submit a question */}
          <div className="pt-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Submit a question</span>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-foreground">Got a tricky question?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload a PDF with a single question — we&apos;ll pick some to cover in next week&apos;s session.
                </p>
              </div>

              {uploadStatus === 'success' ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
                    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Question submitted!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">We&apos;ll let you know if it gets picked for next week.</p>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="mt-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    Submit another
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Subject selector */}
                  <div className="flex gap-2">
                    {(['Methods', 'Specialist'] as Subject[]).map(s => (
                      <button
                        key={s}
                        onClick={() => setUploadSubject(s)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                          uploadSubject === s
                            ? 'bg-foreground text-white'
                            : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Dropzone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all duration-150 ${
                      dragOver
                        ? 'border-foreground bg-secondary/30'
                        : uploadFile
                          ? 'border-foreground/30 bg-secondary/20'
                          : 'border-border/60 hover:border-foreground/30 hover:bg-secondary/20'
                    }`}
                  >
                    {uploadFile ? (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <svg className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-foreground">{uploadFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024).toFixed(0)} KB · Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-foreground">Drop your PDF here</p>
                        <p className="text-xs text-muted-foreground">or click to browse · PDF only · max 5 MB · one question per file</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFileSelect(f)
                      e.target.value = ''
                    }}
                  />

                  {uploadError && (
                    <p className="text-xs text-red-500">{uploadError}</p>
                  )}

                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile || uploadStatus === 'loading'}
                    className="w-full rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {uploadStatus === 'loading' ? 'Uploading…' : 'Submit question'}
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
    </PageGate>
  )
}
