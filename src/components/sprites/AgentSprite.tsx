import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { AgentState } from './types'

interface AgentSpriteProps {
  id: 'baize' | 'goumang' | 'yinglong'
  state: AgentState
  x: number
  y: number
  scale?: number
  direction?: 'left' | 'right'
  isMoving?: boolean
}

// 白泽 - 白色蓬松狮子，金角，金色项圈
// 16x16 像素基础
const BAIZE_FRAMES = {
  idle: [
    // Frame 1 - 静态
    {
      body: 'M4,6 L4,13 L5,14 L7,14 L7,13 L9,13 L9,14 L11,14 L12,13 L12,6 L11,5 L10,5 L10,4 L6,4 L6,5 L5,5 Z',
      mane: 'M3,5 L3,8 L4,9 L4,6 L5,5 L6,4 L6,3 L7,2 L9,2 L10,3 L10,4 L11,5 L12,6 L12,9 L13,8 L13,5 L12,4 L11,3 L10,2 L9,1 L7,1 L6,2 L5,3 L4,4 Z',
      horn: 'M8,1 L8,3 L9,3 L9,1 Z',
      eyes: 'M6,7 L6,8 L7,8 L7,7 Z M9,7 L9,8 L10,8 L10,7 Z',
      nose: 'M8,9 L8,10 L9,10 L9,9 Z',
      collar: 'M5,12 L5,13 L11,13 L11,12 Z',
    },
    // Frame 2 - 呼吸
    {
      body: 'M4,6 L4,14 L5,15 L7,15 L7,14 L9,14 L9,15 L11,15 L12,14 L12,6 L11,5 L10,5 L10,4 L6,4 L6,5 L5,5 Z',
      mane: 'M3,5 L3,9 L4,10 L4,6 L5,5 L6,4 L6,3 L7,2 L9,2 L10,3 L10,4 L11,5 L12,6 L12,10 L13,9 L13,5 L12,4 L11,3 L10,2 L9,1 L7,1 L6,2 L5,3 L4,4 Z',
      horn: 'M8,0 L8,3 L9,3 L9,0 Z',
      eyes: 'M6,7 L6,8 L7,8 L7,7 Z M9,7 L9,8 L10,8 L10,7 Z',
      nose: 'M8,9 L8,10 L9,10 L9,9 Z',
      collar: 'M5,13 L5,14 L11,14 L11,13 Z',
    },
  ],
  active: [
    {
      body: 'M4,5 L4,13 L5,14 L7,14 L7,13 L9,13 L9,14 L11,14 L12,13 L12,5 L11,4 L10,4 L10,3 L6,3 L6,4 L5,4 Z',
      mane: 'M2,4 L2,8 L3,9 L4,9 L4,5 L5,4 L6,3 L6,2 L7,1 L9,1 L10,2 L10,3 L11,4 L12,5 L12,9 L13,9 L14,8 L14,4 L13,3 L11,2 L10,1 L9,0 L7,0 L6,1 L5,2 L4,3 Z',
      horn: 'M8,0 L8,2 L9,2 L9,0 Z',
      eyes: 'M6,6 L6,7 L7,7 L7,6 Z M9,6 L9,7 L10,7 L10,6 Z',
      nose: 'M8,8 L8,9 L9,9 L9,8 Z',
      collar: 'M5,12 L5,13 L11,13 L11,12 Z',
    },
  ],
  thinking: [
    {
      body: 'M4,6 L4,13 L5,14 L7,14 L7,13 L9,13 L9,14 L11,14 L12,13 L12,6 L11,5 L10,5 L10,4 L6,4 L6,5 L5,5 Z',
      mane: 'M3,5 L3,8 L4,9 L4,6 L5,5 L6,4 L6,3 L7,2 L9,2 L10,3 L10,4 L11,5 L12,6 L12,9 L13,8 L13,5 L12,4 L11,3 L10,2 L9,1 L7,1 L6,2 L5,3 L4,4 Z',
      horn: 'M8,1 L8,3 L9,3 L9,1 Z',
      eyes: 'M6,7 L7,7 L7,8 L6,8 Z M10,7 L10,8 L9,8 L9,7 Z', // 眯眼
      nose: 'M8,9 L8,10 L9,10 L9,9 Z',
      collar: 'M5,12 L5,13 L11,13 L11,12 Z',
    },
  ],
}

// 句芒 - 绿色圆鸟，金色卷曲头饰，嘴叼小草
const GOUMANG_FRAMES = {
  idle: [
    {
      body: 'M5,6 L5,12 L6,13 L10,13 L11,12 L11,6 L10,5 L9,5 L9,4 L7,4 L7,5 L6,5 Z',
      belly: 'M6,9 L6,12 L10,12 L10,9 Z',
      crest: 'M7,2 L7,4 L8,5 L9,4 L9,2 L10,1 L10,0 L9,0 L8,1 L7,1 Z',
      eyes: 'M6,7 L6,8 L7,8 L7,7 Z M9,7 L9,8 L10,8 L10,7 Z',
      beak: 'M8,9 L7,10 L8,11 L9,10 Z',
      leaf: 'M9,10 L10,9 L11,9 L12,10 L11,10 Z',
      feet: 'M6,13 L6,15 L7,15 L7,14 L8,14 L8,13 Z M9,13 L9,14 L10,14 L10,15 L11,15 L11,13 Z',
      wing: 'M4,8 L3,9 L3,10 L4,11 L5,10 L5,8 Z M11,8 L12,9 L13,10 L13,9 L12,8 L11,8 Z',
    },
    {
      body: 'M5,7 L5,13 L6,14 L10,14 L11,13 L11,7 L10,6 L9,6 L9,5 L7,5 L7,6 L6,6 Z',
      belly: 'M6,10 L6,13 L10,13 L10,10 Z',
      crest: 'M7,3 L7,5 L8,6 L9,5 L9,3 L10,2 L10,1 L9,1 L8,2 L7,2 Z',
      eyes: 'M6,8 L6,9 L7,9 L7,8 Z M9,8 L9,9 L10,9 L10,8 Z',
      beak: 'M8,10 L7,11 L8,12 L9,11 Z',
      leaf: 'M9,11 L10,10 L11,10 L12,11 L11,11 Z',
      feet: 'M6,14 L6,16 L7,16 L7,15 L8,15 L8,14 Z M9,14 L9,15 L10,15 L10,16 L11,16 L11,14 Z',
      wing: 'M3,9 L2,10 L2,11 L3,12 L5,11 L5,9 Z M11,9 L12,10 L14,11 L14,10 L13,9 L11,9 Z',
    },
  ],
  active: [
    {
      body: 'M5,5 L5,11 L6,12 L10,12 L11,11 L11,5 L10,4 L9,4 L9,3 L7,3 L7,4 L6,4 Z',
      belly: 'M6,8 L6,11 L10,11 L10,8 Z',
      crest: 'M7,1 L7,3 L8,4 L9,3 L9,1 L10,0 L9,-1 L8,0 L7,0 Z',
      eyes: 'M6,6 L6,7 L7,7 L7,6 Z M9,6 L9,7 L10,7 L10,6 Z',
      beak: 'M8,8 L7,9 L8,10 L9,9 Z',
      leaf: 'M9,9 L10,8 L11,8 L12,9 L11,9 Z',
      feet: 'M6,12 L6,14 L7,14 L7,13 Z M10,12 L10,13 L11,14 L11,12 Z',
      wing: 'M3,6 L1,8 L1,9 L3,10 L5,9 L5,7 Z M11,6 L13,8 L15,9 L15,8 L13,6 L11,6 Z',
    },
  ],
  thinking: [
    {
      body: 'M5,6 L5,12 L6,13 L10,13 L11,12 L11,6 L10,5 L9,5 L9,4 L7,4 L7,5 L6,5 Z',
      belly: 'M6,9 L6,12 L10,12 L10,9 Z',
      crest: 'M7,2 L7,4 L8,5 L9,4 L9,2 L10,1 L10,0 L9,0 L8,1 L7,1 Z',
      eyes: 'M6,7 L7,7 L7,8 L6,8 Z M10,7 L10,8 L9,8 L9,7 Z',
      beak: 'M8,9 L7,10 L8,11 L9,10 Z',
      feet: 'M6,13 L6,15 L7,15 L7,14 L8,14 L8,13 Z M9,13 L9,14 L10,14 L10,15 L11,15 L11,13 Z',
      wing: 'M4,8 L3,9 L3,10 L4,11 L5,10 L5,8 Z M11,8 L12,9 L13,10 L13,9 L12,8 L11,8 Z',
    },
  ],
}

// 应龙 - 有翼青龙，蛇形身体
const YINGLONG_FRAMES = {
  idle: [
    {
      body: 'M2,8 L2,10 L3,11 L5,11 L6,10 L8,10 L9,11 L11,11 L12,10 L14,10 L14,8 L13,7 L11,7 L10,8 L8,8 L7,7 L5,7 L4,8 Z',
      head: 'M1,7 L1,10 L2,11 L4,11 L5,10 L5,7 L4,6 L2,6 Z',
      horn: 'M3,4 L3,6 L4,6 L4,4 Z M2,5 L2,6 L3,6 L3,5 Z',
      eyes: 'M2,8 L2,9 L3,9 L3,8 Z',
      wingL: 'M5,4 L4,5 L4,7 L5,7 L6,5 L7,4 L7,3 L6,3 Z',
      wingR: 'M11,4 L10,5 L10,7 L11,7 L12,5 L13,4 L13,3 L12,3 Z',
      tail: 'M14,8 L15,7 L16,7 L16,9 L15,10 L14,10 Z',
    },
    {
      body: 'M2,9 L2,11 L3,12 L5,12 L6,11 L8,11 L9,12 L11,12 L12,11 L14,11 L14,9 L13,8 L11,8 L10,9 L8,9 L7,8 L5,8 L4,9 Z',
      head: 'M1,8 L1,11 L2,12 L4,12 L5,11 L5,8 L4,7 L2,7 Z',
      horn: 'M3,5 L3,7 L4,7 L4,5 Z M2,6 L2,7 L3,7 L3,6 Z',
      eyes: 'M2,9 L2,10 L3,10 L3,9 Z',
      wingL: 'M5,5 L4,6 L4,8 L5,8 L6,6 L7,5 L7,4 L6,4 Z',
      wingR: 'M11,5 L10,6 L10,8 L11,8 L12,6 L13,5 L13,4 L12,4 Z',
      tail: 'M14,9 L15,8 L16,8 L16,10 L15,11 L14,11 Z',
    },
  ],
  active: [
    {
      body: 'M2,7 L2,9 L3,10 L5,10 L6,9 L8,9 L9,10 L11,10 L12,9 L14,9 L14,7 L13,6 L11,6 L10,7 L8,7 L7,6 L5,6 L4,7 Z',
      head: 'M1,6 L1,9 L2,10 L4,10 L5,9 L5,6 L4,5 L2,5 Z',
      horn: 'M3,3 L3,5 L4,5 L4,3 Z M2,4 L2,5 L3,5 L3,4 Z',
      eyes: 'M2,7 L2,8 L3,8 L3,7 Z',
      wingL: 'M5,2 L3,4 L3,6 L5,6 L7,4 L8,2 L8,1 L6,1 Z',
      wingR: 'M11,2 L9,4 L9,6 L11,6 L13,4 L14,2 L14,1 L12,1 Z',
      tail: 'M14,7 L15,6 L16,6 L16,8 L15,9 L14,9 Z',
    },
  ],
  thinking: [
    {
      body: 'M2,8 L2,10 L3,11 L5,11 L6,10 L8,10 L9,11 L11,11 L12,10 L14,10 L14,8 L13,7 L11,7 L10,8 L8,8 L7,7 L5,7 L4,8 Z',
      head: 'M1,7 L1,10 L2,11 L4,11 L5,10 L5,7 L4,6 L2,6 Z',
      horn: 'M3,4 L3,6 L4,6 L4,4 Z M2,5 L2,6 L3,6 L3,5 Z',
      eyes: 'M2,8 L3,8 L3,9 L2,9 Z',
      wingL: 'M5,4 L4,5 L4,7 L5,7 L6,5 L7,4 L7,3 L6,3 Z',
      wingR: 'M11,4 L10,5 L10,7 L11,7 L12,5 L13,4 L13,3 L12,3 Z',
      tail: 'M14,8 L15,7 L16,7 L16,9 L15,10 L14,10 Z',
    },
  ],
}

const SPRITE_COLORS = {
  baize: {
    body: '#F5F1EB',
    mane: '#FAFAFA',
    horn: '#C9A959',
    eyes: '#2C2C2C',
    nose: '#D4A5A5',
    collar: '#C9A959',
  },
  goumang: {
    body: '#8FBC8F',
    belly: '#B8D4B8',
    crest: '#C9A959',
    eyes: '#2C2C2C',
    beak: '#D4A5A5',
    leaf: '#5A8A58',
    feet: '#C9A959',
    wing: '#6B8E6B',
  },
  yinglong: {
    body: '#7FA8B8',
    head: '#8FB8C8',
    horn: '#C9A959',
    eyes: '#2C2C2C',
    wingL: '#A8C8D8',
    wingR: '#A8C8D8',
    tail: '#6B98A8',
  },
}

const FPS = {
  idle: 1.5,
  active: 3,
  thinking: 2,
  offline: 1,
}

export function AgentSprite({ id, state, x, y, scale = 5, direction = 'right', isMoving = false }: AgentSpriteProps) {
  const [frame, setFrame] = useState(0)
  
  const allFrames = id === 'baize' ? BAIZE_FRAMES 
    : id === 'goumang' ? GOUMANG_FRAMES 
    : YINGLONG_FRAMES
    
  const frames = allFrames[state === 'offline' ? 'idle' : state] || allFrames.idle
  const colors = SPRITE_COLORS[id]
  const fps = FPS[state]

  useEffect(() => {
    if (frames.length <= 1) return
    
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % frames.length)
    }, 1000 / fps)
    
    return () => clearInterval(interval)
  }, [frames.length, fps])

  const currentFrame = frames[frame]
  const isOffline = state === 'offline'
  const flipX = direction === 'left'

  // 渲染各部分
  const renderParts = () => {
    return Object.entries(currentFrame).map(([part, path]) => (
      <path 
        key={part}
        d={path}
        fill={(colors as Record<string, string>)[part] || '#888'}
        style={{ imageRendering: 'pixelated' }}
      />
    ))
  }

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isOffline ? 0.3 : 1,
        y: isMoving ? [0, -2, 0] : 0, // 移动时轻微弹跳
      }}
      transition={{ 
        opacity: { duration: 0.3 },
        y: { duration: 0.3, repeat: isMoving ? Infinity : 0 },
      }}
    >
      {/* 阴影 */}
      <ellipse 
        cx={x} 
        cy={y + 8 * scale / 2 + 4} 
        rx={8 * scale / 2.5} 
        ry={8 * scale / 10} 
        fill="rgba(0,0,0,0.06)" 
      />
      
      {/* Sprite - 支持翻转 */}
      <g transform={`translate(${flipX ? x + 8 * scale / 2 : x - 8 * scale / 2}, ${y - 8 * scale / 2}) scale(${flipX ? -scale : scale}, ${scale})`}>
        {renderParts()}
      </g>

      {/* 状态指示 - 思考时的小气泡 */}
      {state === 'thinking' && (
        <motion.g
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <circle cx={x + 10 * scale / 2} cy={y - 8 * scale / 2 - 8} r="3" fill="#9C9C9C" />
          <circle cx={x + 8 * scale / 2} cy={y - 8 * scale / 2} r="2" fill="#9C9C9C" />
        </motion.g>
      )}
    </motion.g>
  )
}
