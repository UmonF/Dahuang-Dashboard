import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import SegmentControl from '../components/ui/SegmentControl'
import { getDiaryEntries, type DiaryEntry } from '../data'

const MOOD_LABELS: Record<DiaryEntry['mood'], string> = {
  'calm': '平静',
  'reflective': '沉思',
  'curious': '好奇',
  'productive': '高效',
  'accomplished': '成就',
  'anxious': '焦虑',
  'tired': '疲惫',
}

const MOOD_EMOJI: Record<DiaryEntry['mood'], string> = {
  'calm': '😌',
  'reflective': '💭',
  'curious': '🤔',
  'productive': '⚡',
  'accomplished': '✨',
  'anxious': '😰',
  'tired': '😴',
}

function TangGu() {
  const allEntries = getDiaryEntries()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const activeMood = searchParams.get('tab') || 'all'

  // 计算每个心情的数量
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allEntries.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1
    })
    return counts
  }, [allEntries])

  // 获取实际存在的心情
  const options = Object.entries(moodCounts).map(([key, count]) => ({
    key,
    label: MOOD_LABELS[key as DiaryEntry['mood']] || key,
    emoji: MOOD_EMOJI[key as DiaryEntry['mood']],
    count,
  }))

  const filtered = useMemo(() => {
    if (activeMood === 'all') return allEntries
    return allEntries.filter(e => e.mood === activeMood)
  }, [allEntries, activeMood])

  const handleTabChange = (key: string | null) => {
    const newTab = key || 'all'
    setSearchParams({ tab: newTab }, { replace: true })
  }

  return (
    <PageLayout title="汤谷" subtitle="日出之所" stamp="暘">
      <section className="sub-intro">
        <p className="intro-text">
          汤谷上有扶桑，十日所浴。
        </p>
        <p className="intro-source">《山海经·海外东经》</p>
      </section>

      <SegmentControl
        options={options}
        value={activeMood === 'all' ? null : activeMood}
        onChange={handleTabChange}
        allLabel="全部"
      />

      <section className="timeline">
        <AnimatePresence mode="popLayout">
          {filtered.map((item, i) => (
            <motion.article
              key={item.id}
              layout
              className="timeline-item"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
            >
              <div className="timeline-date">
                <time>{item.date?.replace(/-/g, '.')}</time>
                <span className="timeline-mood">
                  {MOOD_EMOJI[item.mood]} {MOOD_LABELS[item.mood] || item.mood}
                </span>
              </div>
              <Link to={`/tanggu/${item.id}?from=${activeMood}`} className="timeline-content">
                <h3 className="timeline-title">{item.title}</h3>
                {item.content && (
                  <p className="timeline-text">{item.content}</p>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="entry-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="entry-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 篇</p>
      </footer>
    </PageLayout>
  )
}

export default TangGu
