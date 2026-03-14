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

// 便捷获取函数
export function getInsights(): Insight[] {
  return insights.items
}

export function getInsightsByCategory(category: Insight['category']): Insight[] {
  return insights.items.filter(item => item.category === category)
}

export function getReadingNotes(): ReadingNote[] {
  return readingNotes.items
}

export function getNotesByCategory(category: ReadingNote['category']): ReadingNote[] {
  return readingNotes.items.filter(item => item.category === category)
}

export function getDiaryEntries(): DiaryEntry[] {
  return diaryEntries.items
}

export function getDiaryByMood(mood: DiaryEntry['mood']): DiaryEntry[] {
  return diaryEntries.items.filter(item => item.mood === mood)
}

export function getExperiments(): Experiment[] {
  return experiments.items
}

export function getExperimentsByStatus(status: Experiment['status']): Experiment[] {
  return experiments.items.filter(item => item.status === status)
}

// 重新导出类型
export type { Insight, ReadingNote, DiaryEntry, Experiment, DataFile } from './types'
