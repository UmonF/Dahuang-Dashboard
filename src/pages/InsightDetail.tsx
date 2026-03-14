import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { getInsights } from '../data'
import { getContentById } from '../data/content'

function InsightDetail() {
  const { id } = useParams<{ id: string }>()
  const allInsights = getInsights()
  const item = allInsights.find(i => i.id === id)
  const content = id ? getContentById(id) : null

  if (!item) {
    return (
      <div className="sub-page">
        <header className="sub-header">
          <Link to="/yumin" className="back-link">
            <span className="back-arrow">←</span>
            返回羽民国
          </Link>
          <div className="header-center">
            <div className="header-stamp">羽</div>
            <div>
              <h1 className="header-title">未找到</h1>
            </div>
          </div>
          <div className="header-spacer" />
        </header>
        <main className="sub-content">
          <p>找不到这条资讯</p>
        </main>
      </div>
    )
  }

  const typeLabel = item.category === 'tech-ai' ? 'Tech & AI' 
    : item.category === 'game-ux' ? 'Game UX' 
    : '设计案例'

  return (
    <motion.div
      className="sub-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="sub-header">
        <Link to="/yumin" className="back-link">
          <span className="back-arrow">←</span>
          返回羽民国
        </Link>
        <div className="header-center">
          <div className="header-stamp">羽</div>
          <div>
            <h1 className="header-title">资讯详情</h1>
            <p className="header-subtitle">{typeLabel}</p>
          </div>
        </div>
        <div className="header-spacer" />
      </header>

      <main className="sub-content">
        <article className="detail-article">
          <header className="detail-header">
            <div className="detail-meta">
              <span className="entry-date">{item.date?.replace(/-/g, '.')}</span>
              <span className="entry-type">
                {item.category === 'tech-ai' ? 'AI' : item.category === 'game-ux' ? 'UX' : 'Design'}
              </span>
              {item.source && <span className="entry-source">{item.source}</span>}
            </div>
            <h1 className="detail-title">{item.title}</h1>
          </header>

          <div className="detail-body markdown-content">
            {content?.content ? (
              <ReactMarkdown>{content.content}</ReactMarkdown>
            ) : (
              <p className="detail-content">{item.summary}</p>
            )}
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className="detail-tags">
              {item.tags.map(tag => (
                <span key={tag} className="entry-tag">{tag}</span>
              ))}
            </div>
          )}

          {item.sourceUrl && (
            <footer className="detail-footer">
              <a 
                href={item.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="detail-link"
              >
                查看原文 →
              </a>
            </footer>
          )}
        </article>
      </main>

      <footer className="sub-footer">
        <span>大荒百景</span>
        <span>羽民国</span>
      </footer>
    </motion.div>
  )
}

export default InsightDetail
