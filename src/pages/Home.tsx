import { motion } from 'framer-motion'
import FanCanvas from '../components/fan/FanCanvas'

function Home() {
  return (
    <div className="home">
      {/* Hero with Fan */}
      <section className="hero">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          大荒百景
        </motion.h1>
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          山 海 有 灵 · 万 物 知 名
        </motion.p>

        {/* 侧边竖排 */}
        <motion.div 
          className="hero-side"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          游戏化个人仪表盘
        </motion.div>

        {/* 印章 */}
        <motion.div 
          className="hero-seal"
          initial={{ opacity: 0, rotate: 15 }}
          animate={{ opacity: 0.7, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          荒
        </motion.div>
      </section>

      {/* 折扇舞台 */}
      <section className="fan-stage">
        <motion.div 
          className="fan-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <FanCanvas />
        </motion.div>
      </section>

      {/* Footer - 功能入口 */}
      <footer className="home-footer">
        <div className="footer-trackers">
          <motion.a 
            href="/cron" 
            className="tracker-link"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ color: '#C84B31' }}
          >
            <span className="tracker-icon">⟳</span>
            <span className="tracker-label">Cron Tasks</span>
          </motion.a>
          <motion.a 
            href="/tokens" 
            className="tracker-link"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            whileHover={{ color: '#C84B31' }}
          >
            <span className="tracker-icon">◈</span>
            <span className="tracker-label">Token Usage</span>
          </motion.a>
        </div>
        <span className="footer-year">2026</span>
      </footer>
    </div>
  )
}

export default Home
