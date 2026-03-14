import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SegmentControl from '../components/ui/SegmentControl'
import { getInsights } from '../data'

// 默认 tab（首次访问时）
const DEFAULT_TAB = 'game-ux'

function YuminGuo() {
  const allInsights = getInsights()
  const [searchParams, setSearchParams] = useSearchParams()
  
  // 从 URL 读取 tab，首次访问默认 game-ux
  const activeTab = searchParams.get('tab') || DEFAULT_TAB

  // 计算每个分类的数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allInsights.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1
    })
    return counts
  }, [allInsights])

  // 顺序：All, Game UX, AI News, 设计案例
  const options = [
    { key: 'game-ux', label: 'Game UX', count: categoryCounts['game-ux'] || 0 },
    { key: 'tech-ai', label: 'AI News', count: categoryCounts['tech-ai'] || 0 },
    { key: 'design', label: '设计案例', count: categoryCounts['design'] || 0 },
  ].filter(opt => opt.count > 0)

  const filtered = useMemo(() => {
    if (activeTab === 'all') return allInsights
    return allInsights.filter(i => i.category === activeTab)
  }, [allInsights, activeTab])

  const handleTabChange = (key: string | null) => {
    const newTab = key || 'all'
    setSearchParams({ tab: newTab }, { replace: true })
  }

  return (
    <PageLayout title="羽民国" subtitle="四方采集" stamp="羽">
      <section className="sub-intro">
        <p className="intro-text">
          羽民国在其东南，其为人长头，身生羽。
        </p>
        <p className="intro-source">《山海经·海外南经》</p>
      </section>

      <SegmentControl
        options={options}
        value={activeTab === 'all' ? null : activeTab}
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
              transition={{ delay: i * 0.02, duration: 0.2 }}
            >
              <Link
                to={`/yumin/${item.id}?from=${activeTab}`}
                className="entry-item entry-link"
              >
                <div className="entry-header">
                  <span className="entry-date">{item.date?.replace(/-/g, '.')}</span>
                  <span className="entry-type">
                    {item.category === 'tech-ai' ? 'AI' : item.category === 'game-ux' ? 'UX' : 'Design'}
                  </span>
                  {item.source && <span className="entry-source">{item.source}</span>}
                </div>
                <h3 className="entry-title">{item.title}</h3>
                {item.summary && (
                  <p className="entry-excerpt">{item.summary}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="entry-tags">
                    {item.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="entry-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 条</p>
      </footer>
    </PageLayout>
  )
}

export default YuminGuo
