import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface PageLayoutProps {
  title: string
  subtitle: string
  color: 'yuminGuo' | 'kunlunQiu' | 'lingShan' | 'tangGu'
  children: ReactNode
}

const colorMap = {
  yuminGuo: { bg: 'from-yuminGuo/20 to-yuminGuo/5', stamp: '🪶' },
  kunlunQiu: { bg: 'from-kunlunQiu/20 to-kunlunQiu/5', stamp: '🏔️' },
  lingShan: { bg: 'from-lingShan/20 to-lingShan/5', stamp: '⚗️' },
  tangGu: { bg: 'from-tangGu/20 to-tangGu/5', stamp: '🌅' },
}

function PageLayout({ title, subtitle, color, children }: PageLayoutProps) {
  const { bg, stamp } = colorMap[color]

  return (
    <motion.div
      className={`min-h-screen bg-gradient-to-b ${bg} bg-dahuang-paper`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-dahuang-paper/80 border-b border-dahuang-ink/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-sm text-dahuang-ink/50 hover:text-dahuang-ink transition-colors"
            >
              ← 返回大荒
            </Link>
            <div className="h-4 w-px bg-dahuang-ink/20" />
            <span className="text-xl">{stamp}</span>
            <h1 className="font-serif-cn text-xl">{title}</h1>
            <span className="text-xs text-dahuang-ink/40">{subtitle}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-dahuang-ink/5 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-dahuang-ink/30">
          大荒百景 · {title}
        </div>
      </footer>
    </motion.div>
  )
}

export default PageLayout
