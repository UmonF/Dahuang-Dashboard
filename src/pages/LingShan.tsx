import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { getExperiments, type Experiment } from '../data'

const statusLabels: Record<Experiment['status'], string> = {
  'idea': '💡 想法',
  'wip': '🔨 进行中',
  'done': '✅ 完成',
  'archived': '📦 归档',
}

const statusColors: Record<Experiment['status'], string> = {
  'idea': 'bg-yellow-100 text-yellow-800',
  'wip': 'bg-blue-100 text-blue-800',
  'done': 'bg-green-100 text-green-800',
  'archived': 'bg-gray-100 text-gray-800',
}

function LingShan() {
  const allExperiments = getExperiments()
  const [activeStatus, setActiveStatus] = useState<Experiment['status'] | 'all'>('all')

  const statuses: (Experiment['status'] | 'all')[] = ['all', 'wip', 'done', 'idea', 'archived']

  const filteredExperiments = useMemo(() => {
    if (activeStatus === 'all') return allExperiments
    return allExperiments.filter(item => item.status === activeStatus)
  }, [allExperiments, activeStatus])

  return (
    <PageLayout title="灵山" subtitle="交互实验 / Demo" color="lingShan">
      {/* Status Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              activeStatus === status
                ? 'bg-lingShan text-white'
                : 'bg-white/60 text-dahuang-ink/70 hover:bg-lingShan/20'
            }`}
          >
            {status === 'all' ? '全部' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredExperiments.map((exp, i) => (
          <motion.div
            key={exp.id}
            className="bg-white/60 rounded-lg overflow-hidden shadow-sm border border-lingShan/30 group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            {/* Cover */}
            <div className="h-40 bg-gradient-to-br from-lingShan/30 to-lingShan/10 flex items-center justify-center">
              <span className="text-6xl group-hover:scale-110 transition-transform">
                {exp.coverEmoji || '⚗️'}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[exp.status]}`}>
                  {statusLabels[exp.status]}
                </span>
                <span className="text-xs text-dahuang-ink/40">{exp.date}</span>
              </div>

              {/* Title */}
              <h3 className="font-serif-cn text-xl mb-2">{exp.title}</h3>

              {/* Description */}
              <p className="text-sm text-dahuang-ink/60 mb-4 line-clamp-2">
                {exp.description}
              </p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap mb-4">
                {exp.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-lingShan/20 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {exp.demoUrl && (
                  <a
                    href={exp.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-lingShan hover:underline"
                  >
                    🔗 Demo
                  </a>
                )}
                {exp.repoUrl && (
                  <a
                    href={exp.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-lingShan hover:underline"
                  >
                    📂 源码
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredExperiments.length === 0 && (
        <div className="text-center text-dahuang-ink/40 py-12">
          暂无实验项目
        </div>
      )}
    </PageLayout>
  )
}

export default LingShan
