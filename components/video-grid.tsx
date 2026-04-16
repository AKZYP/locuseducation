'use client'

import { useState, useEffect, useMemo } from 'react'
import { getVideos, extractYouTubeId } from '@/lib/supabase-store'
import { SUBJECTS, UNITS, TOPICS_BY_SUBJECT } from '@/lib/types'
import type { Video, Subject, Unit } from '@/lib/types'

export function VideoGrid() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Methods')
  const [selectedUnit, setSelectedUnit] = useState<Unit>('All Units')
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    setLoading(true)
    const data = await getVideos()
    setVideos(data)
    setLoading(false)
  }

  // Get available topics based on selected subject and unit
  const availableTopics = useMemo(() => {
    const topics = TOPICS_BY_SUBJECT[selectedSubject]
    if (!topics) return ['All Topics']
    return topics[selectedUnit] || ['All Topics']
  }, [selectedSubject, selectedUnit])

  // Reset topic when subject or unit changes
  useEffect(() => {
    setSelectedTopic('All Topics')
  }, [selectedSubject, selectedUnit])

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase())
      const matchesSubject = video.subject === selectedSubject
      const matchesUnit = selectedUnit === 'All Units' || video.unit === selectedUnit
      const matchesTopic = selectedTopic === 'All Topics' || video.topic === selectedTopic
      return matchesSearch && matchesSubject && matchesUnit && matchesTopic
    })
  }, [videos, search, selectedSubject, selectedUnit, selectedTopic])

  return (
    <div className="space-y-5">
      {/* Subject Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-secondary/50 p-1">
        {SUBJECTS.map((subject) => {
          const isActive = selectedSubject === subject
          return (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {subject}
            </button>
          )
        })}
      </div>

      {/* Search and Filter Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60"
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
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border-0 bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            showFilters || selectedUnit !== 'All Units' || selectedTopic !== 'All Topics'
              ? 'bg-foreground text-white'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
          {(selectedUnit !== 'All Units' || selectedTopic !== 'All Topics') && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
              {(selectedUnit !== 'All Units' ? 1 : 0) + (selectedTopic !== 'All Topics' ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Unit and Topic Filters */}
      {showFilters && (
        <div className="space-y-3 rounded-xl bg-secondary/30 p-3">
          {/* Unit Filter */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Unit</p>
            <div className="flex flex-wrap gap-2">
              {UNITS.map((unit) => (
                <button
                  key={unit}
                  onClick={() => setSelectedUnit(unit)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selectedUnit === unit
                      ? 'bg-foreground text-white'
                      : 'bg-white text-muted-foreground hover:text-foreground shadow-sm'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          
          {/* Topic Filter */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Topic</p>
            <div className="flex flex-wrap gap-2">
              {availableTopics.map((topic) => (
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
          </div>
        </div>
      )}

      {/* Video Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
          <p className="text-sm text-muted-foreground">Loading videos...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 py-20">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="mb-1 font-medium text-foreground">No videos yet</p>
          <p className="text-sm text-muted-foreground">
            {selectedUnit !== 'All Units' || selectedTopic !== 'All Topics'
              ? 'Try adjusting your filters'
              : 'Check back soon for new content'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => {
            const videoId = extractYouTubeId(video.youtubeUrl)
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              : '/placeholder.jpg'

            return (
              <a
                key={video.id}
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border/50 transition-all duration-200 hover:shadow-md hover:ring-primary/20"
              >
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  <img
                    src={thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors duration-200 group-hover:bg-foreground/5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
                      <svg className="ml-0.5 h-4 w-4 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {video.unit}
                    </span>
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground truncate max-w-[120px]">
                      {video.topic}
                    </span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-foreground line-clamp-2 leading-snug">{video.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{video.description}</p>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
