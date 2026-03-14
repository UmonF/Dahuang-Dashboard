import { motion } from 'framer-motion'
import { useState } from 'react'
import type { AgentState } from './types'
import { AGENT_CONFIG, STATE_ANIMATIONS } from './types'

interface PixelSpriteProps {
  agentId: 'baize' | 'goumang' | 'yinglong'
  state: AgentState
  position: { x: number; y: number }
  onClick?: () => void
}

// 状态指示器组件
const StateIndicator = ({ state }: { state: AgentState }) => {
  if (state === 'active') {
    return (
      <motion.div
        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
        style={{ backgroundColor: '#6b8e7a' }} // jade green
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

// 像素动画帧 - 用 Framer Motion 模拟
const PixelFrames = ({ agent, state }: { agent: string; state: AgentState }) => {
  const config = AGENT_CONFIG[agent as keyof typeof AGENT_CONFIG]
  const animConfig = STATE_ANIMATIONS[state]
  
  // 基于状态的动画变体
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
      {/* Sprite 容器 - 像素风格 */}
      <div 
        className="relative"
        style={{
          imageRendering: 'pixelated',
          filter: state === 'offline' ? 'grayscale(60%) brightness(0.9)' : 'none',
          transition: 'filter 0.3s',
        }}
      >
        {/* Agent emoji */}
        <span 
          className="select-none"
          style={{ 
            fontSize: '28px',
            textShadow: '0 2px 4px rgba(45,42,38,0.15)',
          }}
        >
          {config.emoji}
        </span>
        
        {/* 状态指示器 */}
        <StateIndicator state={state} />
      </div>

      {/* 地面阴影 */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2"
        style={{
          width: '22px',
          height: '5px',
          background: 'radial-gradient(ellipse, rgba(45,42,38,0.12) 0%, transparent 70%)',
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
      className="absolute cursor-pointer"
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
      {/* Sprite 本体 */}
      <PixelFrames agent={agentId} state={state} />

      {/* Hover 名牌 - 更精致 */}
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
