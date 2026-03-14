import type { DataFile, Insight, ReadingNote, DiaryEntry, Experiment } from './types'

// 静态导入 JSON 数据
import insightsData from '../../data/feeds/insights.json'
import notesData from '../../data/reading/notes.json'
import diaryData from '../../data/diary/entries.json'
import experimentsData from '../../data/projects/experiments.json'

// 导出类型化数据
export const insights = insightsData as DataFile<Insight>
export const readingNotes = notesData as DataFile<ReadingNote>
export const diaryEntries = diaryData as DataFile<DiaryEntry>
export const experiments = experimentsData as DataFile<Experiment>

// 按日期排序（最新在前）
function sortByDateDesc<T extends { date?: string; createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.date || a.createdAt || ''
    const dateB = b.date || b.createdAt || ''
    return dateB.localeCompare(dateA)
  })
}

// 便捷获取函数（默认按日期最新排序）
export function getInsights(): Insight[] {
  return sortByDateDesc(insights.items)
}

export function getInsightsByCategory(category: Insight['category']): Insight[] {
  return sortByDateDesc(insights.items.filter(item => item.category === category))
}

export function getReadingNotes(): ReadingNote[] {
  return sortByDateDesc(readingNotes.items)
}

export function getNotesByCategory(category: ReadingNote['category']): ReadingNote[] {
  return sortByDateDesc(readingNotes.items.filter(item => item.category === category))
}

export function getDiaryEntries(): DiaryEntry[] {
  return sortByDateDesc(diaryEntries.items)
}

export function getDiaryByMood(mood: DiaryEntry['mood']): DiaryEntry[] {
  return sortByDateDesc(diaryEntries.items.filter(item => item.mood === mood))
}

export function getExperiments(): Experiment[] {
  return sortByDateDesc(experiments.items)
}

export function getExperimentsByStatus(status: Experiment['status']): Experiment[] {
  return sortByDateDesc(experiments.items.filter(item => item.status === status))
}

// 重新导出类型
export type { Insight, ReadingNote, DiaryEntry, Experiment, DataFile } from './types'
