export interface Video {
  id: string
  title: string
  youtubeUrl: string
  topic: string
  subject: Subject
  description: string
  dateAdded: string
  thumbnailUrl?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  fileUrl: string
  fileName: string
  topic: string
  subject: Subject
  dateAdded: string
}

export interface LiveStream {
  id: string
  title: string
  scheduledDate: string
  youtubeUrl?: string
  description: string
}

export const SUBJECTS = ['Methods', 'Specialist', 'General'] as const
export type Subject = typeof SUBJECTS[number]

export const TOPICS = [
  'All Topics',
  'Differentiation',
  'Integration',
  'Probability',
  'Functions',
  'Algebra',
  'Statistics',
  'Calculus Applications'
] as const

export type Topic = typeof TOPICS[number]
