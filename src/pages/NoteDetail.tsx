import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getReadingNotes, type ReadingNote } from '../data'

const CATEGORY_LABELS: Record<ReadingNote['category'], string> = {
  'folklore': '民俗',
  'science': '科学',
  'zhiguai': '志怪',
  'design': '设计',
  'tech': '技术',
  'other': '其他',
}

function NoteDetail() {
  const { id } = useParams<{ id: string }>()
  const allNotes = getReadingNotes()
  const item = allNotes.find(n => n.id === id)

  if (!item) {
    return (
      <div className="sub-page">
        <header className="sub-header">
          <Link to="/kunlun" className="back-link">
            <span className="back-arrow">←</span>
            返回昆仑丘
          </Link>
          <div className="header-center">
            <div className="header-stamp">崑</div>
            <div>
              <h1 className="header-title">未找到</h1>
            </div>
          </div>
          <div className="header-spacer" />
        </header>
        <main className="sub-content">
          <p>找不到这篇笔记</p>
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
        <Link to="/kunlun" className="back-link">
          <span className="back-arrow">←</span>
          返回昆仑丘
        </Link>
        <div className="header-center">
          <div className="header-stamp">崑</div>
          <div>
            <h1 className="header-title">读书笔记</h1>
            <p className="header-subtitle">{CATEGORY_LABELS[item.category]}</p>
          </div>
        </div>
        <div className="header-spacer" />
      </header>

      <main className="sub-content">
        <article className="detail-article">
          <header className="detail-header">
            <div className="detail-meta">
              <span className="entry-date">{item.date?.replace(/-/g, '.')}</span>
              <span className="entry-category">{CATEGORY_LABELS[item.category]}</span>
              {item.author && <span className="entry-source">{item.author}</span>}
            </div>
            <h1 className="detail-title">{item.title}</h1>
          </header>

          {item.summary && (
            <div className="detail-body">
              <p className="detail-content">{item.summary}</p>
            </div>
          )}

          {item.highlights.length > 0 && (
            <div className="detail-highlights">
              <h3 className="detail-section-title">摘录</h3>
              {item.highlights.map((h, i) => (
                <blockquote key={i} className="entry-quote">{h}</blockquote>
              ))}
            </div>
          )}

          {item.thoughts && (
            <div className="detail-thoughts">
              <h3 className="detail-section-title">感想</h3>
              <p className="detail-content">{item.thoughts}</p>
            </div>
          )}

          {item.rating && (
            <div className="detail-rating">
              {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
            </div>
          )}
        </article>
      </main>

      <footer className="sub-footer">
        <span>大荒百景</span>
        <span>昆仑丘</span>
      </footer>
    </motion.div>
  )
}

export default NoteDetail
