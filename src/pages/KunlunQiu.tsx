import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { getReadingNotes, type ReadingNote } from '../data'

const CATEGORY_LABELS: Record<ReadingNote['category'], string> = {
  'folklore': '民俗',
  'science': '科学',
  'zhiguai': '志怪',
  'design': '设计',
  'tech': '技术',
  'other': '其他',
}

function KunlunQiu() {
  const allNotes = getReadingNotes()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // 获取实际存在的分类
  const existingCategories = [...new Set(allNotes.map(n => n.category))]

  const filtered = useMemo(() => {
    if (!activeCategory) return allNotes
    return allNotes.filter(n => n.category === activeCategory)
  }, [allNotes, activeCategory])

  return (
    <PageLayout title="昆仑丘" subtitle="百川之源" stamp="崑">
      <section className="sub-intro">
        <p className="intro-text">
          昆仑之丘，是实惟帝之下都。
        </p>
        <p className="intro-source">《山海经·海内西经》</p>
      </section>

      <section className="filter-bar">
        <button 
          className={`filter-btn ${!activeCategory ? 'active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          全部
        </button>
        {existingCategories.map(cat => (
          <button 
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </section>

      <section className="entry-list">
        {filtered.map((item, i) => (
          <motion.article
            key={item.id}
            className="entry-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="entry-header">
              <span className="entry-date">{item.date?.replace(/-/g, '.')}</span>
              <span className="entry-category">
                {CATEGORY_LABELS[item.category] || item.category}
              </span>
              {item.author && <span className="entry-source">{item.author}</span>}
            </div>
            <h3 className="entry-title">{item.title}</h3>
            {item.summary && (
              <p className="entry-excerpt">{item.summary}</p>
            )}
            {item.highlights.length > 0 && (
              <blockquote className="entry-quote">
                "{item.highlights[0]}"
              </blockquote>
            )}
          </motion.article>
        ))}
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 篇</p>
      </footer>
    </PageLayout>
  )
}

export default KunlunQiu
