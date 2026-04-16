'use client'

import type { Video, Resource, LiveStream } from './types'

const VIDEOS_KEY = 'methods-free-videos'
const RESOURCES_KEY = 'methods-free-resources'
const LIVESTREAM_KEY = 'methods-free-livestream'

// Sample data for initial load
const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to Differentiation',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topic: 'Differentiation',
    subject: 'Methods',
    description: 'Understanding the basics of derivatives and rate of change.',
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    title: 'Integration by Parts',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topic: 'Integration',
    subject: 'Methods',
    description: 'Learn the integration by parts technique with worked examples.',
    dateAdded: '2024-01-22'
  },
  {
    id: '3',
    title: 'Probability Distributions',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topic: 'Probability',
    subject: 'Methods',
    description: 'Normal and binomial distributions explained clearly.',
    dateAdded: '2024-01-29'
  },
  {
    id: '4',
    title: 'Chain Rule Deep Dive',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topic: 'Differentiation',
    subject: 'Methods',
    description: 'Mastering the chain rule with complex functions.',
    dateAdded: '2024-02-05'
  },
  {
    id: '5',
    title: 'Quadratic Functions',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topic: 'Functions',
    subject: 'Methods',
    description: 'Everything you need to know about parabolas and quadratics.',
    dateAdded: '2024-02-12'
  },
  {
    id: '6',
    title: 'Definite Integrals & Area',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topic: 'Integration',
    subject: 'Methods',
    description: 'Calculating areas under curves using definite integrals.',
    dateAdded: '2024-02-19'
  }
]

const sampleResources: Resource[] = [
  {
    id: '1',
    title: 'Differentiation Formula Sheet',
    description: 'All differentiation rules and formulas on one page.',
    fileUrl: '/resources/diff-formulas.pdf',
    fileName: 'diff-formulas.pdf',
    topic: 'Differentiation',
    subject: 'Methods',
    dateAdded: '2024-01-10'
  },
  {
    id: '2',
    title: 'Integration Cheat Sheet',
    description: 'Common integrals and integration techniques.',
    fileUrl: '/resources/integration-cheat.pdf',
    fileName: 'integration-cheat.pdf',
    topic: 'Integration',
    subject: 'Methods',
    dateAdded: '2024-01-17'
  },
  {
    id: '3',
    title: 'Probability Tables',
    description: 'Z-tables and probability distribution tables.',
    fileUrl: '/resources/prob-tables.pdf',
    fileName: 'prob-tables.pdf',
    topic: 'Probability',
    subject: 'Methods',
    dateAdded: '2024-01-24'
  }
]

const sampleLiveStream: LiveStream = {
  id: '1',
  title: 'Weekly Methods Session: Calculus Applications',
  scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  description: 'This week we tackle real-world calculus applications in QCE.'
}

export function getVideos(): Video[] {
  if (typeof window === 'undefined') return sampleVideos
  const stored = localStorage.getItem(VIDEOS_KEY)
  if (!stored) {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(sampleVideos))
    return sampleVideos
  }
  return JSON.parse(stored)
}

export function saveVideos(videos: Video[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos))
}

export function addVideo(video: Omit<Video, 'id' | 'dateAdded'>) {
  const videos = getVideos()
  const newVideo: Video = {
    ...video,
    id: Date.now().toString(),
    dateAdded: new Date().toISOString().split('T')[0]
  }
  videos.unshift(newVideo)
  saveVideos(videos)
  return newVideo
}

export function deleteVideo(id: string) {
  const videos = getVideos().filter(v => v.id !== id)
  saveVideos(videos)
}

export function getResources(): Resource[] {
  if (typeof window === 'undefined') return sampleResources
  const stored = localStorage.getItem(RESOURCES_KEY)
  if (!stored) {
    localStorage.setItem(RESOURCES_KEY, JSON.stringify(sampleResources))
    return sampleResources
  }
  return JSON.parse(stored)
}

export function saveResources(resources: Resource[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources))
}

export function addResource(resource: Omit<Resource, 'id' | 'dateAdded'>) {
  const resources = getResources()
  const newResource: Resource = {
    ...resource,
    id: Date.now().toString(),
    dateAdded: new Date().toISOString().split('T')[0]
  }
  resources.unshift(newResource)
  saveResources(resources)
  return newResource
}

export function deleteResource(id: string) {
  const resources = getResources().filter(r => r.id !== id)
  saveResources(resources)
}

export function getLiveStream(): LiveStream | null {
  if (typeof window === 'undefined') return sampleLiveStream
  const stored = localStorage.getItem(LIVESTREAM_KEY)
  if (!stored) {
    localStorage.setItem(LIVESTREAM_KEY, JSON.stringify(sampleLiveStream))
    return sampleLiveStream
  }
  return JSON.parse(stored)
}

export function saveLiveStream(stream: LiveStream) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LIVESTREAM_KEY, JSON.stringify(stream))
}

export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}
