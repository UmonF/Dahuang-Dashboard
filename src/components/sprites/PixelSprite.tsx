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

// 16×16 像素画 — 参考伊布进化系风格
// 关键：圆润轮廓、大眼睛、颜色层次（高光/主色/阴影）
const PIXEL_SPRITES: Record<string, { 
  pixels: string[]
  palette: Record<string, string>
}> = {
  baize: {
    // 白泽：白色狮子，圆润可爱，大眼睛
    palette: {
      '.': 'transparent',
      'o': '#2d2a26',     // outline - dark brown
      'w': '#faf8f5',     // white - highlight
      'm': '#e8e4db',     // cream - main body
      's': '#d4cfc4',     // shadow
      'g': '#c9a959',     // gold - horn
      'h': '#dfc978',     // gold highlight
      'r': '#c84b31',     // vermilion - eye
      'k': '#1a1a1a',     // black - pupil
      'p': '#f5cdc9',     // pink - inner ear
    },
    pixels: [
      '......ohho......',
      '.....ogggo......',
      '....owwwwwo.....',
      '...owwmmmwwo....',
      '..owwmmmmwwwo...',
      '..owmkwwwkwwo...',
      '..owmrwwwrmwo...',
      '..owmmmmmmmwo...',
      '...owmmpmmwo....',
      '...owmmmmmmwo...',
      '....owmmmmwo....',
      '....owmwwmwo....',
      '...owmo.omwo....',
      '...owo...owo....',
      '................',
      '................',
    ]
  },
  goumang: {
    // 句芒：绿色植物精灵，叶子头，圆脸
    palette: {
      '.': 'transparent',
      'o': '#2d2a26',     // outline
      'l': '#a5d6a7',     // light green - highlight
      'g': '#66bb6a',     // green - main
      'd': '#43a047',     // dark green - shadow
      'L': '#c8e6c9',     // pale green - leaf highlight
      'f': '#ffe4c9',     // flesh - face
      'h': '#ffeedd',     // face highlight
      'p': '#ffb5b5',     // pink - cheek
      'k': '#1a1a1a',     // black - eye
    },
    pixels: [
      '.....oLLo.......',
      '....oLllLo......',
      '...oLlggllo.....',
      '...olgggglo.....',
      '....ogggo.......',
      '...ohhhhho......',
      '..ohhhhhhhho....',
      '..ohkhhhhkho....',
      '..ohhphhhpho....',
      '..ohhhhhhhho....',
      '...ohhhhho......',
      '....ofhhfo......',
      '...ofo..ofo.....',
      '..ofo....ofo....',
      '................',
      '................',
    ]
  },
  yinglong: {
    // 应龙：青色龙，圆润身体，小翅膀
    palette: {
      '.': 'transparent',
      'o': '#2d2a26',     // outline
      'l': '#80cbc4',     // light cyan - highlight
      'c': '#4db6ac',     // cyan - main
      'd': '#00897b',     // dark cyan - shadow
      'w': '#faf8f5',     // white - belly
      'b': '#e8e4db',     // belly shadow
      'g': '#c9a959',     // gold - horn
      'h': '#dfc978',     // gold highlight
      'r': '#c84b31',     // red - whisker
      'k': '#1a1a1a',     // black - eye
    },
    pixels: [
      '..ohho......ohho',
      '.ohggo.....oggho',
      '.ollll....ollllo',
      '..occcoooooccco.',
      '..olcccccccclo..',
      '.olcckccckcclo..',
      '.olccrcccrccclo.',
      '.occcwwwwwccco..',
      '..occwwwwwcco...',
      '...occwwwcco....',
      '....occcccco....',
      '....occlcco.....',
      '....oco.oco.....',
      '...oco...oco....',
      '................',
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
            width={pixelSize + 0.5}  // 微小重叠消除缝隙
            height={pixelSize + 0.5}
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

// 状态指示器
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
        <PixelArtSVG agentId={agent} size={48} state={state} />
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
