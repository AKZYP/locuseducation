export interface Video {
  id: string
  title: string
  youtubeUrl: string
  topic: string
  unit: Unit
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
  unit: Unit
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

export const SUBJECTS = ['Methods', 'Specialist'] as const
export type Subject = typeof SUBJECTS[number]

export const UNITS = ['All Units', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4'] as const
export type Unit = typeof UNITS[number]

// Topics by Subject and Unit
export const METHODS_TOPICS: Record<string, string[]> = {
  'All Units': ['All Topics'],
  'Unit 1': [
    'Functions and graphs',
    'Linear functions',
    'Quadratic functions',
    'Polynomial functions',
    'Exponential functions',
    'Algebra and functions (transformations, notation)',
    'Probability basics (events, sample space)'
  ],
  'Unit 2': [
    'Exponential and logarithmic functions',
    'Log laws and equations',
    'Trigonometric functions',
    'Unit circle and trig graphs',
    'Introduction to calculus',
    'Derivatives of basic functions',
    'Tangents and rates of change'
  ],
  'Unit 3': [
    'Differentiation techniques (chain, product, quotient)',
    'Applications of derivatives (optimisation, motion)',
    'Further trigonometry (identities & equations)',
    'Exponential & log applications in modelling',
    'Normal distribution',
    'Statistical inference (intro)'
  ],
  'Unit 4': [
    'Integration techniques',
    'Definite integrals and area under curves',
    'Applications of integration',
    'Differential equations (growth/decay models)',
    'Confidence intervals',
    'Hypothesis testing'
  ]
}

export const SPECIALIST_TOPICS: Record<string, string[]> = {
  'All Units': ['All Topics'],
  'Unit 1': [
    'Further complex numbers',
    'Proof (mathematical reasoning techniques)',
    'Vectors in 2D',
    'Introduction to matrices',
    'Further functions and transformations'
  ],
  'Unit 2': [
    'Complex numbers (polar form, Argand plane)',
    'Vectors in 3D',
    'Matrices (operations & transformations)',
    'Trigonometry (advanced identities)',
    'Introduction to calculus extensions'
  ],
  'Unit 3': [
    'Advanced calculus (integration + differentiation extension)',
    'Vectors (applications in 3D geometry)',
    'Complex number applications',
    'Differential equations (extended modelling)',
    'Mechanics (motion, forces basics)'
  ],
  'Unit 4': [
    'Further vectors (lines, planes in 3D)',
    'Advanced complex numbers',
    'Further calculus applications',
    'Proof techniques (advanced reasoning)',
    'Mechanics (kinematics + dynamics applications)'
  ]
}

export const GENERAL_TOPICS: Record<string, string[]> = {
  'All Units': ['All Topics'],
  'Unit 1': [
    'Financial mathematics (interest, loans, taxes)',
    'Linear equations and graphs',
    'Measurement and error',
    'Algebraic manipulation',
    'Percentages and applications'
  ],
  'Unit 2': [
    'Statistics (data, graphs, distributions)',
    'Measures of centre and spread',
    'Probability',
    'Networks and graphs (shortest path, MST)',
    'Matrices (basic operations)'
  ],
  'Unit 3': [
    'Bivariate data analysis (correlation & regression)',
    'Time series analysis',
    'Sequences and recurrence relations',
    'Financial modelling (growth, loans)',
    'Network optimisation'
  ],
  'Unit 4': [
    'Earth geometry (lat/long, distance)',
    'Trigonometry applications (2D & 3D)',
    'Investment and annuities',
    'Loans and amortisation',
    'Matrices (transformations & applications)'
  ]
}

export const TOPICS_BY_SUBJECT: Record<Subject, Record<string, string[]>> = {
  'Methods': METHODS_TOPICS,
  'Specialist': SPECIALIST_TOPICS,
  'General': GENERAL_TOPICS
}

// Flat list of all unique topics for filtering
const allTopics = new Set<string>()
allTopics.add('All Topics')
Object.values(TOPICS_BY_SUBJECT).forEach(subjectTopics => {
  Object.values(subjectTopics).forEach(unitTopics => {
    unitTopics.forEach(topic => allTopics.add(topic))
  })
})
export const TOPICS = Array.from(allTopics)
export type Topic = typeof TOPICS[number]

// Calendar
export interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  color: EventColor
  description: string
  createdAt: string
}

export const EVENT_COLORS = {
  blue:   { label: 'Blue',   bg: '#dbeafe', text: '#1d4ed8' },
  purple: { label: 'Purple', bg: '#f3e8ff', text: '#7e22ce' },
  green:  { label: 'Green',  bg: '#dcfce7', text: '#15803d' },
  orange: { label: 'Orange', bg: '#ffedd5', text: '#c2410c' },
  red:    { label: 'Red',    bg: '#fee2e2', text: '#b91c1c' },
  pink:   { label: 'Pink',   bg: '#fce7f3', text: '#be185d' },
} as const

export type EventColor = keyof typeof EVENT_COLORS
