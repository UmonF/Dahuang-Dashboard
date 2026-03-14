// 数据类型定义

export interface Insight {
  id: string
  title: string
  summary: string
  source: string
  sourceUrl?: string
  category: 'tech-ai' | 'game-ux' | 'design'
  tags: string[]
  date: string
  createdAt: string
}

export interface ReadingNote {
  id: string
  title: string
  author?: string
  category: 'folklore' | 'science' | 'zhiguai' | 'design' | 'tech' | 'other'
  summary: string
  highlights: string[]
  thoughts?: string
  rating?: number
  date: string
  createdAt: string
}

export interface DiaryEntry {
  id: string
  date: string
  mood: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'rainbow'
  title?: string
  content: string
  tags?: string[]
  weather?: string
  createdAt: string
}

export interface Experiment {
  id: string
  title: string
  description: string
  status: 'idea' | 'wip' | 'done' | 'archived'
  tags: string[]
  demoUrl?: string
  repoUrl?: string
  coverEmoji?: string
  date: string
  createdAt: string
}

export interface DataFile<T> {
  version: string
  updatedAt: string
  items: T[]
}
