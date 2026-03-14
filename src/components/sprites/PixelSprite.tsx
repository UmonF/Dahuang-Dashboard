import { motion } from 'framer-motion'
import React, { useState } from 'react'
import type { AgentState } from './types'
import { AGENT_CONFIG, STATE_ANIMATIONS } from './types'

interface PixelSpriteProps {
  agentId: 'baize' | 'goumang' | 'yinglong'
  state: AgentState
  position: { x: number; y: number }
  onClick?: () => void
}

// 16×16 像素画 SVG 数据
// 设计风格：GBA/NDS 时代 Q 版像素画，3-4色，大眼睛，黑色轮廓
const PIXEL_SPRITES: Record<string, { 
  pixels: string[]  // 16 rows, each is a 16-char string
  palette: Record<string, string>
}> = {
  baize: {
    // 白泽：白色狮子，金角，红眼
    palette: {
      '.': 'transparent',
      'o': '#1a1a1a',     // outline - black
      'w': '#f8f6f1',     // white - main body
      's': '#e8e4db',     // shadow - light gray
      'g': '#c9a959',     // gold - horn
      'r': '#c84b31',     // vermilion - eye
      'p': '#ffb5b5',     // pink - inner ear/nose
    },
    pixels: [
      '................',
      '......ogo.......',
      '.....ogggo......',
      '....owwwwwo.....',
      '...owwwwwwwo....',
      '..owwswwwswwo...',
      '..owsrwwwrswwo..',
      '..owwwwpwwwwwo..',
      '..owwwwwwwwwwo..',
      '...owwswswwo....',
      '...owwwwwwwo....',
      '....owwwwwo.....',
      '...owwoowwwo....',
      '...owo..owo.....',
      '..owo....owo....',
      '................',
    ]
  },
  goumang: {
    // 句芒：绿色植物精灵，叶子头发
    palette: {
      '.': 'transparent',
      'o': '#1a1a1a',     // outline
      'g': '#7cb342',     // green - main
      'd': '#558b2f',     // dark green - shadow
      'l': '#aed581',     // light green - highlight
      'y': '#c9a959',     // yellow - eyes
      'p': '#ffcc80',     // peach - face
    },
    pixels: [
      '......ooo.......',
      '.....olllo......',
      '....ollllo......',
      '...ogllllgo.....',
      '...oggggggo.....',
      '..ogggdgggggo...',
      '..oggdgggdggo...',
      '..opppppppppo...',
      '..opyppppyppo...',
      '..opppppppppo...',
      '...opppppppo....',
      '....oppppo......',
      '.....oppo.......',
      '....opo.opo.....',
      '...opo...opo....',
      '................',
    ]
  },
  yinglong: {
    // 应龙：青色东方龙，有翅膀
    palette: {
      '.': 'transparent',
      'o': '#1a1a1a',     // outline
      'c': '#4db6ac',     // cyan - main body
      'd': '#00897b',     // dark cyan - shadow
      'l': '#80cbc4',     // light cyan - highlight
      'w': '#f8f6f1',     // white - belly
      'r': '#c84b31',     // red - eye/whisker
      'g': '#c9a959',     // gold - horn
    },
    pixels: [
      '..og..........og',
      '.oggo........ogd',
      '.olllo......olll',
      '..occcoooooccco.',
      '..occccccccccco.',
      '..occdcccccdcco.',
      '.occcrccccrcccco',
      '.occcccwwccccco.',
      '.occccwwwwcccco.',
      '..occccwwcccco..',
      '...occcccccco...',
      '....occccccco...',
      '.....occccco....',
      '.....oco.oco....',
      '....oco...oco...',
      '................',
    ]
  },
}

// 渲染像素画 SVG
const PixelArtSVG = ({ 
  agentId, 
  size = 48,
  state,
}: { 
  agentId: string
  size?: number
  state: AgentState
}) => {
  const sprite = PIXEL_SPRITES[agentId]
  if (!sprite) return null

  const pixelSize = size / 16
  const pixels: React.ReactElement[] = []

  sprite.pixels.forEach((row: string, y: number) => {
    row.split('').forEach((cell: string, x: number) => {
      if (cell !== '.' && sprite.palette[cell]) {
        pixels.push(
          <rect
            key={`${x}-${y}`}
            x={x * pixelSize}
            y={y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={sprite.palette[cell]}
          />
        )
      }
    })
  })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        imageRendering: 'pixelated',
        filter: state === 'offline' ? 'grayscale(60%) brightness(0.9)' : 'none',
        transition: 'filter 0.3s',
      }}
    >
      {pixels}
    </svg>
  )
}

// 状态指示器组件
const StateIndicator = ({ state }: { state: AgentState }) => {
  if (state === 'active') {
    return (
      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
        style={{ backgroundColor: '#6b8e7a' }}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    )
  }
  
  if (state === 'thinking') {
    return (
      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2"
        animate={{ 
          y: [0, -2, 0], 
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs opacity-80">💭</span>
      </motion.div>
    )
  }
  
  return null
}

// 像素动画帧
const PixelFrames = ({ agent, state }: { agent: string; state: AgentState }) => {
  const animConfig = STATE_ANIMATIONS[state]
  
  const getAnimationStyle = () => {
    switch (state) {
      case 'active':
        return {
          y: [0, -3, 0],
          scale: [1, 1.02, 1],
        }
      case 'thinking':
        return {
          rotate: [-1, 1, -1],
          y: [0, -1, 0],
        }
      case 'idle':
        return {
          y: [0, -1, 0],
          scale: [1, 1.01, 1],
        }
      case 'offline':
        return {
          opacity: 0.4,
          scale: 0.95,
          y: 2,
        }
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center relative"
      animate={getAnimationStyle()}
      transition={{
        duration: state === 'offline' ? 0.3 : animConfig.frames / animConfig.fps,
        repeat: animConfig.loop ? Infinity : 0,
        ease: 'easeInOut',
      }}
    >
      <div className="relative">
        {/* 像素画 SVG */}
        <PixelArtSVG agentId={agent} size={48} state={state} />
        
        {/* 状态指示器 */}
        <StateIndicator state={state} />
      </div>

      {/* 地面阴影 */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2"
        style={{
          width: '28px',
          height: '6px',
          background: 'radial-gradient(ellipse, rgba(45,42,38,0.15) 0%, transparent 70%)',
          opacity: state === 'offline' ? 0.3 : 0.8,
          transition: 'opacity 0.3s',
        }}
      />
    </motion.div>
  )
}

function PixelSprite({ agentId, state, position, onClick }: PixelSpriteProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = AGENT_CONFIG[agentId]

  return (
    <motion.div
      className="absolute cursor-pointer pointer-events-auto"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 20 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isHovered ? 1.15 : 1, 
        opacity: 1,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <PixelFrames agent={agentId} state={state} />

      {/* Hover 名牌 */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: -4, scale: 0.9 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : -4,
          scale: isHovered ? 1 : 0.9,
        }}
        transition={{ duration: 0.15 }}
      >
        <div 
          className="px-2.5 py-1 rounded-sm text-xs font-serif-cn shadow-ink"
          style={{ 
            backgroundColor: 'rgba(247,243,235,0.95)',
            color: '#2d2a26',
            border: `1px solid ${config.color}60`,
            letterSpacing: '0.05em',
          }}
        >
          {config.name}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PixelSprite
