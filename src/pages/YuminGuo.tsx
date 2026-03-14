import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { getInsights, type Insight } from '../data'

const categoryLabels: Record<Insight['category'], string> = {
  'tech-ai': 'Tech & AI',
  'game-ux': 'Game UX',
  'design': '设计',
}

const sourceEmojis: Record<string, string> = {
  'Twitter': '🐦',
  'Blog': '📝',
  'Paper': '📄',
  'Newsletter': '📬',
  'Video': '🎬',
}

function YuminGuo() {
  const allInsights = getInsights()
  const [activeCategory, setActiveCategory] = useState<Insight['category'] | 'all'>('all')

  const categories: (Insight['category'] | 'all')[] = ['all', 'tech-ai', 'game-ux', 'design']

  const filteredInsights = useMemo(() => {
    if (activeCategory === 'all') return allInsights
    return allInsights.filter(item => item.category === activeCategory)
  }, [allInsights, activeCategory])

  return (
    <PageLayout title="羽民国" subtitle="Feeds 资讯库" color="yuminGuo">
      {/* Category Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeCategory === cat
                ? 'bg-yuminGuo text-white'
                : 'bg-white/60 text-dahuang-ink/70 hover:bg-yuminGuo/20'
            }`}
          >
            {cat === 'all' ? '全部' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInsights.map((insight, i) => (
          <motion.div
            key={insight.id}
            className="bg-white/60 rounded-lg p-6 shadow-sm border border-yuminGuo/30 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-2 py-1 bg-yuminGuo/20 rounded-full">
                {categoryLabels[insight.category]}
              </span>
              <span className="text-xs text-dahuang-ink/40">{insight.date}</span>
            </div>

            {/* Title */}
            <h3 className="font-serif-cn text-lg mb-2 line-clamp-2">{insight.title}</h3>

            {/* Summary */}
            <p className="text-sm text-dahuang-ink/70 mb-4 line-clamp-3">
              {insight.summary}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-dahuang-ink/50">
                <span>{sourceEmojis[insight.source] || '🔗'}</span>
                <span>{insight.source}</span>
              </div>
              {insight.sourceUrl && (
                <a
                  href={insight.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-yuminGuo hover:underline"
                >
                  阅读原文 →
                </a>
              )}
            </div>

            {/* Tags */}
            {insight.tags.length > 0 && (
              <div className="flex gap-1 mt-3 flex-wrap">
                {insight.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 bg-dahuang-ink/5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredInsights.length === 0 && (
        <div className="text-center text-dahuang-ink/40 py-12">
          暂无资讯
        </div>
      )}
    </PageLayout>
  )
}

export default YuminGuo
