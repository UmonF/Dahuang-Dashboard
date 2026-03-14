import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { getReadingNotes, type ReadingNote } from '../data'

const categoryLabels: Record<ReadingNote['category'], string> = {
  'folklore': '民俗',
  'science': '科学',
  'zhiguai': '志怪',
  'design': '设计',
  'tech': '技术',
  'other': '其他',
}

const categoryEmojis: Record<ReadingNote['category'], string> = {
  'folklore': '🏮',
  'science': '🔬',
  'zhiguai': '👻',
  'design': '🎨',
  'tech': '💻',
  'other': '📚',
}

function KunlunQiu() {
  const allNotes = getReadingNotes()
  const [activeCategory, setActiveCategory] = useState<ReadingNote['category'] | 'all'>('all')

  const categories: (ReadingNote['category'] | 'all')[] = ['all', 'zhiguai', 'folklore', 'design', 'tech', 'science', 'other']

  const filteredNotes = useMemo(() => {
    if (activeCategory === 'all') return allNotes
    return allNotes.filter(item => item.category === activeCategory)
  }, [allNotes, activeCategory])

  return (
    <PageLayout title="昆仑丘" subtitle="读书笔记" color="kunlunQiu">
      {/* Category Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-1 ${
              activeCategory === cat
                ? 'bg-kunlunQiu text-white'
                : 'bg-white/60 text-dahuang-ink/70 hover:bg-kunlunQiu/20'
            }`}
          >
            {cat !== 'all' && <span>{categoryEmojis[cat]}</span>}
            {cat === 'all' ? '全部' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Notes List */}
      <div className="space-y-6 max-w-3xl">
        {filteredNotes.map((note, i) => (
          <motion.article
            key={note.id}
            className="bg-white/60 rounded-lg p-8 shadow-sm border border-kunlunQiu/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{categoryEmojis[note.category]}</span>
              <div>
                <span className="text-xs px-2 py-1 bg-kunlunQiu/20 rounded-full">
                  {categoryLabels[note.category]}
                </span>
                <span className="text-xs text-dahuang-ink/40 ml-2">{note.date}</span>
              </div>
              {note.rating && (
                <div className="ml-auto text-yellow-500">
                  {'★'.repeat(note.rating)}{'☆'.repeat(5 - note.rating)}
                </div>
              )}
            </div>

            {/* Title & Author */}
            <h2 className="font-serif-cn text-2xl mb-2">{note.title}</h2>
            {note.author && (
              <p className="text-sm text-dahuang-ink/50 mb-4">— {note.author}</p>
            )}

            {/* Summary */}
            <p className="text-dahuang-ink/70 leading-relaxed mb-4">
              {note.summary}
            </p>

            {/* Highlights */}
            {note.highlights.length > 0 && (
              <div className="border-l-2 border-kunlunQiu/40 pl-4 space-y-2 mb-4">
                {note.highlights.map((highlight, j) => (
                  <p key={j} className="text-sm text-dahuang-ink/60 italic">
                    "{highlight}"
                  </p>
                ))}
              </div>
            )}

            {/* Thoughts */}
            {note.thoughts && (
              <div className="bg-kunlunQiu/10 rounded p-4 text-sm">
                <span className="text-dahuang-ink/40">💭 </span>
                {note.thoughts}
              </div>
            )}
          </motion.article>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center text-dahuang-ink/40 py-12">
          暂无笔记
        </div>
      )}
    </PageLayout>
  )
}

export default KunlunQiu
