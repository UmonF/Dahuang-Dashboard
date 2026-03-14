import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { getDiaryEntries, type DiaryEntry } from '../data'

const moodLabels: Record<DiaryEntry['mood'], string> = {
  'sunny': '☀️ 晴朗',
  'cloudy': '☁️ 多云',
  'rainy': '🌧️ 雨天',
  'stormy': '⛈️ 暴风',
  'rainbow': '🌈 彩虹',
}

const moodColors: Record<DiaryEntry['mood'], string> = {
  'sunny': 'from-yellow-200 to-orange-200',
  'cloudy': 'from-gray-200 to-gray-300',
  'rainy': 'from-blue-200 to-blue-300',
  'stormy': 'from-purple-300 to-gray-400',
  'rainbow': 'from-pink-200 via-yellow-200 to-blue-200',
}

function TangGu() {
  const allEntries = getDiaryEntries()
  const [activeMood, setActiveMood] = useState<DiaryEntry['mood'] | 'all'>('all')

  const moods: (DiaryEntry['mood'] | 'all')[] = ['all', 'sunny', 'cloudy', 'rainy', 'stormy', 'rainbow']

  const filteredEntries = useMemo(() => {
    if (activeMood === 'all') return allEntries
    return allEntries.filter(item => item.mood === activeMood)
  }, [allEntries, activeMood])

  return (
    <PageLayout title="汤谷" subtitle="日记" color="tangGu">
      {/* Mood Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {moods.map(mood => (
          <button
            key={mood}
            onClick={() => setActiveMood(mood)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeMood === mood
                ? 'bg-tangGu text-white'
                : 'bg-white/60 text-dahuang-ink/70 hover:bg-tangGu/20'
            }`}
          >
            {mood === 'all' ? '全部' : moodLabels[mood]}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-tangGu/30" />

          {/* Entries */}
          {filteredEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="relative pl-12 pb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Timeline dot */}
              <div 
                className={`absolute left-2 w-5 h-5 rounded-full bg-gradient-to-br ${moodColors[entry.mood]} border-4 border-dahuang-paper shadow-sm`} 
              />
              
              {/* Entry card */}
              <div className="bg-white/60 rounded-lg p-6 shadow-sm border border-tangGu/30">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{moodLabels[entry.mood].split(' ')[0]}</span>
                  <time className="text-xs text-dahuang-ink/40">{entry.date}</time>
                  {entry.weather && (
                    <span className="text-xs text-dahuang-ink/40">· {entry.weather}</span>
                  )}
                </div>

                {/* Title */}
                {entry.title && (
                  <h3 className="font-serif-cn text-xl mb-3">{entry.title}</h3>
                )}

                {/* Content */}
                <div className="text-dahuang-ink/70 leading-relaxed whitespace-pre-line">
                  {entry.content}
                </div>

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {entry.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-tangGu/20 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center text-dahuang-ink/40 py-12">
          暂无日记
        </div>
      )}
    </PageLayout>
  )
}

export default TangGu
