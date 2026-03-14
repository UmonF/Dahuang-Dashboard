import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { getDiaryEntries, type DiaryEntry } from '../data'
import { getContentById } from '../data/content'

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

function DiaryDetail() {
  const { id } = useParams<{ id: string }>()
  const allEntries = getDiaryEntries()
  const item = allEntries.find(e => e.id === id)
  const content = id ? getContentById(id) : null

  if (!item) {
    return (
      <div className="sub-page">
        <header className="sub-header">
          <Link to="/tanggu" className="back-link">
            <span className="back-arrow">←</span>
            返回汤谷
          </Link>
          <div className="header-center">
            <div className="header-stamp">暘</div>
            <div>
              <h1 className="header-title">未找到</h1>
            </div>
          </div>
          <div className="header-spacer" />
        </header>
        <main className="sub-content">
          <p>找不到这篇日记</p>
        </main>
      </div>
    )
  }

  return (
    <motion.div
      className="sub-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="sub-header">
        <Link to="/tanggu" className="back-link">
          <span className="back-arrow">←</span>
          返回汤谷
        </Link>
        <div className="header-center">
          <div className="header-stamp">暘</div>
          <div>
            <h1 className="header-title">日记</h1>
            <p className="header-subtitle">{MOOD_EMOJI[item.mood]} {MOOD_LABELS[item.mood]}</p>
          </div>
        </div>
        <div className="header-spacer" />
      </header>

      <main className="sub-content">
        <article className="detail-article diary-detail">
          <header className="detail-header">
            <div className="detail-meta">
              <span className="entry-date">{item.date?.replace(/-/g, '.')}</span>
              <span className="diary-mood">{MOOD_EMOJI[item.mood]} {MOOD_LABELS[item.mood]}</span>
              {item.weather && <span className="entry-source">{item.weather}</span>}
            </div>
            <h1 className="detail-title">{item.title}</h1>
          </header>

          <div className="detail-body markdown-content">
            {content?.content ? (
              <ReactMarkdown>{content.content}</ReactMarkdown>
            ) : (
              item.content && <p className="detail-content diary-content">{item.content}</p>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="detail-tags">
              {item.tags.map(tag => (
                <span key={tag} className="entry-tag">#{tag}</span>
              ))}
            </div>
          )}
        </article>
      </main>

      <footer className="sub-footer">
        <span>大荒百景</span>
        <span>汤谷</span>
      </footer>
    </motion.div>
  )
}

export default DiaryDetail
