import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import { getDiaryEntries, type DiaryEntry } from '../data'

const MOOD_LABELS: Record<DiaryEntry['mood'], string> = {
  'sunny': '晴朗',
  'cloudy': '多云',
  'rainy': '雨天',
  'stormy': '暴风',
  'rainbow': '彩虹',
}

const MOOD_EMOJI: Record<DiaryEntry['mood'], string> = {
  'sunny': '☀️',
  'cloudy': '☁️',
  'rainy': '🌧️',
  'stormy': '⛈️',
  'rainbow': '🌈',
}

function TangGu() {
  const allEntries = getDiaryEntries()
  const [activeMood, setActiveMood] = useState<string | null>(null)

  // 获取实际存在的心情
  const existingMoods = [...new Set(allEntries.map(e => e.mood))]

  const filtered = useMemo(() => {
    if (!activeMood) return allEntries
    return allEntries.filter(e => e.mood === activeMood)
  }, [allEntries, activeMood])

  return (
    <PageLayout title="汤谷" subtitle="日出之所" stamp="暘">
      <section className="sub-intro">
        <p className="intro-text">
          汤谷上有扶桑，十日所浴。
        </p>
        <p className="intro-source">《山海经·海外东经》</p>
      </section>

      <section className="filter-bar">
        <button 
          className={`filter-btn ${!activeMood ? 'active' : ''}`}
          onClick={() => setActiveMood(null)}
        >
          全部
        </button>
        {existingMoods.map(mood => (
          <button 
            key={mood}
            className={`filter-btn ${activeMood === mood ? 'active' : ''}`}
            onClick={() => setActiveMood(mood)}
          >
            {MOOD_EMOJI[mood as DiaryEntry['mood']]} {MOOD_LABELS[mood as DiaryEntry['mood']] || mood}
          </button>
        ))}
      </section>

      <section className="timeline">
        {filtered.map((item, i) => (
          <motion.article
            key={item.id}
            className="timeline-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="timeline-date">
              <time>{item.date?.replace(/-/g, '.')}</time>
              <span className="timeline-mood">
                {MOOD_EMOJI[item.mood]} {MOOD_LABELS[item.mood] || item.mood}
              </span>
            </div>
            <Link to={`/tanggu/${item.id}`} className="timeline-content">
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
      </section>

      <footer className="page-footer">
        <p className="footer-note">共 {filtered.length} 篇</p>
      </footer>
    </PageLayout>
  )
}

export default TangGu
