import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { getExperiments, type Experiment } from '../data'

const STATUS_LABELS: Record<Experiment['status'], string> = {
  'idea': '想法',
  'wip': '进行中',
  'done': '完成',
  'archived': '归档',
}

function LingShan() {
  const allExperiments = getExperiments()
  const [activeStatus, setActiveStatus] = useState<string | null>(null)

  // 获取实际存在的状态
  const existingStatuses = [...new Set(allExperiments.map(e => e.status))]

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

      <section className="filter-bar">
        <button 
          className={`filter-btn ${!activeStatus ? 'active' : ''}`}
          onClick={() => setActiveStatus(null)}
        >
          全部
        </button>
        {existingStatuses.map(status => (
          <button 
            key={status}
            className={`filter-btn ${activeStatus === status ? 'active' : ''}`}
            onClick={() => setActiveStatus(status)}
          >
            {STATUS_LABELS[status as Experiment['status']] || status}
          </button>
        ))}
      </section>

      <section className="project-grid">
        {filtered.map((item, i) => (
          <motion.article
            key={item.id}
            className="project-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="project-header">
              <span className={`project-status ${item.status}`}>
                {STATUS_LABELS[item.status]}
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
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 个项目</p>
      </footer>
    </PageLayout>
  )
}

export default LingShan
