'use client'

import { useState, useEffect, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { getResources } from '@/lib/supabase-store'
import { TOPICS, SUBJECTS } from '@/lib/types'
import type { Resource, Topic, Subject } from '@/lib/types'

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<Topic>('All Topics')
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Methods')
  const [showFilters, setShowFilters] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResources().then(data => {
      setResources(data)
      setLoading(false)
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

  return (
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
        </div>
      </main>
    </div>
  )
}
