import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AgentSprite } from '../sprites/AgentSprite'
import { useAgentStatusMock } from '../sprites/useAgentStatus'
import { useAllAgentPaths } from '../sprites/useAgentPath'

const sections = [
  { id: 'yumin', name: '羽民国', sub: '四方采集', path: '/yumin' },
  { id: 'kunlun', name: '昆仑丘', sub: '百川之源', path: '/kunlun' },
  { id: 'lingshan', name: '灵山', sub: '巫咸登降', path: '/lingshan' },
  { id: 'tanggu', name: '汤谷', sub: '日出之地', path: '/tanggu' },
]

function FanCanvas() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const agents = useAgentStatusMock()
  const paths = useAllAgentPaths(agents)

  const go = (path: string) => {
    setClosing(true)
    setTimeout(() => navigate(path), 400)
  }

  // 扇形参数 - 放大
  const width = 1000
  const height = 500
  const cx = width / 2
  const cy = height + 80
  const r1 = 100
  const r2 = 480
  const a1 = -155
  const a2 = -25
  const total = a2 - a1
  const each = total / sections.length

  const rad = (d: number) => (d * Math.PI) / 180

  const fanPath = () => {
    const r1_ = rad(a1), r2_ = rad(a2)
    return `M${cx + r1 * Math.cos(r1_)},${cy + r1 * Math.sin(r1_)} 
            L${cx + r2 * Math.cos(r1_)},${cy + r2 * Math.sin(r1_)} 
            A${r2},${r2} 0 0,1 ${cx + r2 * Math.cos(r2_)},${cy + r2 * Math.sin(r2_)} 
            L${cx + r1 * Math.cos(r2_)},${cy + r1 * Math.sin(r2_)} 
            A${r1},${r1} 0 0,0 ${cx + r1 * Math.cos(r1_)},${cy + r1 * Math.sin(r1_)}Z`
  }

  const sectionPath = (i: number) => {
    const s = a1 + i * each, e = s + each
    const sr = rad(s), er = rad(e)
    return `M${cx + r1 * Math.cos(sr)},${cy + r1 * Math.sin(sr)} 
            L${cx + r2 * Math.cos(sr)},${cy + r2 * Math.sin(sr)} 
            A${r2},${r2} 0 0,1 ${cx + r2 * Math.cos(er)},${cy + r2 * Math.sin(er)} 
            L${cx + r1 * Math.cos(er)},${cy + r1 * Math.sin(er)} 
            A${r1},${r1} 0 0,0 ${cx + r1 * Math.cos(sr)},${cy + r1 * Math.sin(sr)}Z`
  }

  const labelPos = (i: number) => {
    const mid = rad(a1 + (i + 0.5) * each)
    const d = r1 + (r2 - r1) * 0.55
    return { 
      x: cx + d * Math.cos(mid), 
      y: cy + d * Math.sin(mid),
      angle: a1 + (i + 0.5) * each + 90
    }
  }

  const bones = Array.from({ length: 5 }, (_, i) => {
    const d = a1 + i * each
    const r = rad(d)
    return { 
      x1: cx + r1 * Math.cos(r), 
      y1: cy + r1 * Math.sin(r), 
      x2: cx + r2 * Math.cos(r), 
      y2: cy + r2 * Math.sin(r) 
    }
  })

  return (
    <motion.div
      style={{ width, height: height - 20 }}
      animate={{ opacity: closing ? 0 : 1, scale: closing ? 0.95 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          {/* 纸张渐变 */}
          <radialGradient id="paper-grad" cx="50%" cy="100%">
            <stop offset="0%" stopColor="#FAF8F5" />
            <stop offset="60%" stopColor="#F5F1EB" />
            <stop offset="100%" stopColor="#EDE7DD" />
          </radialGradient>

          {/* 扇面裁剪 */}
          <clipPath id="fan-clip">
            <path d={fanPath()} />
          </clipPath>

          {/* 柔和阴影 */}
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#2C2C2C" floodOpacity="0.08" />
          </filter>

          {/* 水墨晕染 */}
          <filter id="ink-blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* 扇面主体 */}
        <g filter="url(#soft-shadow)">
          <path d={fanPath()} fill="url(#paper-grad)" />
          
          {/* 扇面内容 */}
          <g clipPath="url(#fan-clip)">
            {/* 淡墨远山 - 上层，极淡 */}
            <path 
              d="M100,140 Q200,95 320,120 Q440,65 560,100 Q680,50 800,85 Q900,55 980,90 L980,220 L100,220 Z" 
              fill="#9C9C9C"
              opacity="0.06"
            />

            {/* 中景山峦 */}
            <path 
              d="M80,220 Q180,170 280,195 Q380,135 480,175 Q580,115 680,160 Q780,105 880,150 Q960,120 1020,160 L1020,320 L80,320 Z" 
              fill="#5C5C5C"
              opacity="0.08"
            />

            {/* 近景 - 稍浓 */}
            <path 
              d="M60,320 Q160,270 260,295 Q360,235 460,275 Q560,215 660,260 Q760,200 860,245 Q940,210 1020,250 L1020,450 L60,450 Z" 
              fill="#2C2C2C"
              opacity="0.1"
            />

            {/* 水纹 - 底部 */}
            <g opacity="0.04">
              {[0, 1, 2].map(i => (
                <path 
                  key={i}
                  d={`M${140 + i * 50},${390 + i * 15} Q${380 + i * 40},${370 + i * 18} ${620 + i * 25},${385 + i * 15} Q${820 + i * 15},${365 + i * 22} ${940 - i * 40},${380 + i * 18}`}
                  stroke="#2C2C2C"
                  strokeWidth="0.5"
                  fill="none"
                />
              ))}
            </g>
          </g>

          {/* 扇面边缘 */}
          <path d={fanPath()} fill="none" stroke="#C9A959" strokeWidth="0.5" opacity="0.3" />
        </g>

        {/* 扇骨 */}
        <g>
          {bones.map((b, i) => (
            <line 
              key={i} 
              x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} 
              stroke="#A08060"
              strokeWidth="1.5"
              opacity="0.6"
            />
          ))}
          {/* 扇轴 */}
          <circle cx={cx} cy={cy} r="5" fill="#8B7355" />
        </g>

        {/* 地名标签 */}
        {sections.map((s, i) => {
          const p = labelPos(i)
          const active = hovered === s.id
          return (
            <g 
              key={s.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => go(s.path)}
            >
              {/* 点击区域 */}
              <path d={sectionPath(i)} fill="transparent" />
              
              {/* 地名 - 竖排 */}
              <g transform={`translate(${p.x}, ${p.y})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: '"ZCOOL XiaoWei", "Noto Serif SC", serif',
                    fontSize: 18,
                    fontWeight: 400,
                    letterSpacing: '0.15em',
                    fill: active ? '#C84B31' : '#2C2C2C',
                    transition: 'fill 0.2s',
                  }}
                >
                  {s.name}
                </text>
                <text
                  y="22"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontFamily: '"Noto Serif SC", serif',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    fill: '#9C9C9C',
                  }}
                >
                  {s.sub}
                </text>
              </g>

              {/* Hover 下划线 */}
              {active && (
                <motion.line
                  x1={p.x - 25}
                  y1={p.y + 32}
                  x2={p.x + 25}
                  y2={p.y + 32}
                  stroke="#C84B31"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </g>
          )
        })}

        {/* 印章 - 扇面右下 */}
        <g transform="translate(780, 360)" opacity="0.6">
          <rect x="-14" y="-14" width="28" height="28" fill="none" stroke="#C84B31" strokeWidth="1" />
          <text 
            textAnchor="middle" 
            dominantBaseline="middle"
            style={{ 
              fontFamily: '"ZCOOL XiaoWei", serif',
              fontSize: 14,
              fill: '#C84B31'
            }}
          >
            荒
          </text>
        </g>

        {/* Agent Sprites - 使用动态路径 */}
        {agents.map(agent => {
          const path = paths[agent.id]
          return (
            <AgentSprite
              key={agent.id}
              id={agent.id}
              state={agent.state}
              x={path.x}
              y={path.y}
              scale={5}
              direction={path.direction}
              isMoving={path.isMoving}
            />
          )
        })}
      </svg>
    </motion.div>
  )
}

export default FanCanvas
