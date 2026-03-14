import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageLayoutProps {
  title: string
  subtitle: string
  stamp?: string
  color?: 'yuminGuo' | 'kunlunQiu' | 'lingShan' | 'tangGu'
  children: ReactNode
}

const colorMap = {
  yuminGuo: { bg: 'from-yuminGuo/20 to-yuminGuo/5', defaultStamp: '羽' },
  kunlunQiu: { bg: 'from-kunlunQiu/20 to-kunlunQiu/5', defaultStamp: '崑' },
  lingShan: { bg: 'from-lingShan/20 to-lingShan/5', defaultStamp: '靈' },
  tangGu: { bg: 'from-tangGu/20 to-tangGu/5', defaultStamp: '暘' },
}

function PageLayout({ title, subtitle, stamp, color, children }: PageLayoutProps) {
  // 优先用 stamp，否则从 color 推断
  const displayStamp = stamp || (color ? colorMap[color].defaultStamp : '印')

  return (
    <motion.div
      className="sub-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="sub-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">←</span>
          返回大荒
        </Link>
        <div className="header-center">
          <div className="header-stamp">{displayStamp}</div>
          <div>
            <h1 className="header-title">{title}</h1>
            <p className="header-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="header-spacer" />
      </header>

      {/* Content */}
      <main className="sub-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="sub-footer">
        <span>大荒百景</span>
        <span>{title}</span>
      </footer>
    </motion.div>
  )
}

export default PageLayout
