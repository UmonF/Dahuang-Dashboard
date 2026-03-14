import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { getInsights } from '../data'

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'tech-ai', label: 'Tech & AI' },
  { key: 'game-ux', label: 'Game UX' },
  { key: 'design', label: '设计案例' },
]

function YuminGuo() {
  const allInsights = getInsights()
  const [activeTab, setActiveTab] = useState('all')

  const filtered = useMemo(() => {
    if (activeTab === 'all') return allInsights
    return allInsights.filter(i => i.category === activeTab)
  }, [allInsights, activeTab])

  return (
    <PageLayout title="羽民国" subtitle="四方采集" stamp="羽">
      <section className="sub-intro">
        <p className="intro-text">
          羽民国在其东南，其为人长头，身生羽。
        </p>
        <p className="intro-source">《山海经·海外南经》</p>
      </section>

      <section className="filter-bar">
        {TABS.map(tab => (
          <button 
            key={tab.key}
            className={`filter-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </section>

      <section className="entry-list">
        {filtered.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.sourceUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="entry-item entry-link"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
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
            {item.tags.length > 0 && (
              <div className="entry-tags">
                {item.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="entry-tag">{tag}</span>
                ))}
              </div>
            )}
          </motion.a>
        ))}
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 条</p>
      </footer>
    </PageLayout>
  )
}

export default YuminGuo
