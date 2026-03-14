import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SegmentControl from '../components/ui/SegmentControl'
import { getReadingNotes, type ReadingNote } from '../data'

const CATEGORY_LABELS: Record<ReadingNote['category'], string> = {
  'folklore': '民俗',
  'science': '科学',
  'zhiguai': '志怪',
  'history': '历史',
  'design': '设计',
  'tech': '技术',
  'other': '其他',
}

function KunlunQiu() {
  const allNotes = getReadingNotes()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // 从 URL 读取 tab，默认显示全部
  const activeCategory = searchParams.get('tab') || 'all'

  // 计算每个分类的数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allNotes.forEach(n => {
      counts[n.category] = (counts[n.category] || 0) + 1
    })
    return counts
  }, [allNotes])

  // 获取实际存在的分类
  const options = Object.entries(categoryCounts).map(([key, count]) => ({
    key,
    label: CATEGORY_LABELS[key as ReadingNote['category']] || key,
    count,
  }))

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return allNotes
    return allNotes.filter(n => n.category === activeCategory)
  }, [allNotes, activeCategory])

  const handleTabChange = (key: string | null) => {
    const newTab = key || 'all'
    setSearchParams({ tab: newTab }, { replace: true })
  }

  return (
    <PageLayout title="昆仑丘" subtitle="百川之源" stamp="崑">
      <section className="sub-intro">
        <p className="intro-text">
          昆仑之丘，是实惟帝之下都。
        </p>
        <p className="intro-source">《山海经·海内西经》</p>
      </section>

      <SegmentControl
        options={options}
        value={activeCategory === 'all' ? null : activeCategory}
        onChange={handleTabChange}
        allLabel="全部"
      />

      <section className="entry-list">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
            >
              <Link
                to={`/kunlun/${item.id}?from=${activeCategory}`}
                className="entry-item entry-link"
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
                {item.highlights && item.highlights.length > 0 && (
                  <blockquote className="entry-quote">
                    "{item.highlights[0]}"
                  </blockquote>
                )}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 篇</p>
      </footer>
    </PageLayout>
  )
}

export default KunlunQiu
