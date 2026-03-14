import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import SegmentControl from '../components/ui/SegmentControl'
import { getExperiments, type Experiment } from '../data'

const STATUS_LABELS: Record<Experiment['status'], string> = {
  'idea': '想法',
  'wip': '进行中',
  'done': '完成',
  'archived': '归档',
}

const STATUS_EMOJI: Record<Experiment['status'], string> = {
  'idea': '💡',
  'wip': '🔧',
  'done': '✅',
  'archived': '📦',
}

function LingShan() {
  const allExperiments = getExperiments()
  const [activeStatus, setActiveStatus] = useState<string | null>(null)

  // 计算每个状态的数量
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allExperiments.forEach(e => {
      counts[e.status] = (counts[e.status] || 0) + 1
    })
    return counts
  }, [allExperiments])

  // 获取实际存在的状态
  const options = Object.entries(statusCounts).map(([key, count]) => ({
    key,
    label: STATUS_LABELS[key as Experiment['status']] || key,
    emoji: STATUS_EMOJI[key as Experiment['status']],
    count,
  }))

  const filtered = useMemo(() => {
    if (!activeStatus) return allExperiments
    return allExperiments.filter(e => e.status === activeStatus)
  }, [allExperiments, activeStatus])

  return (
    <PageLayout title="灵山" subtitle="百工之所" stamp="靈">
      <section className="sub-intro">
        <p className="intro-text">
          灵山，十巫从此升降。
        </p>
        <p className="intro-source">《山海经·海内西经》</p>
      </section>

      <SegmentControl
        options={options}
        value={activeStatus}
        onChange={setActiveStatus}
        allLabel="全部"
      />

      <section className="project-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.article
              key={item.id}
              layout
              className="project-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
            >
              <div className="project-header">
                <span className={`project-status ${item.status}`}>
                  {STATUS_EMOJI[item.status]} {STATUS_LABELS[item.status]}
                </span>
              </div>
              <h3 className="project-title">{item.title}</h3>
              <p className="project-desc">{item.description}</p>
              <div className="project-tags">
                {item.tags.map(tag => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 个项目</p>
      </footer>
    </PageLayout>
  )
}

export default LingShan
