import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelSprite from './PixelSprite'
import { useAgentStatusMock } from './useAgentStatus'
import { AGENT_CONFIG } from './types'
import type { AgentStatus } from './types'

interface AgentSpritesProps {
  containerWidth: number
  containerHeight: number
}

// 应龙漫游路径生成 - 更平滑
function useRoamingPath(baseX: number, baseY: number) {
  const [position, setPosition] = useState({ x: baseX, y: baseY })
  
  useEffect(() => {
    const roam = () => {
      const angle = Math.random() * Math.PI * 2
      const radius = 20 + Math.random() * 40
      setPosition({
        x: baseX + Math.cos(angle) * radius,
        y: baseY + Math.sin(angle) * radius,
      })
    }

    const interval = setInterval(roam, 4000)
    return () => clearInterval(interval)
  }, [baseX, baseY])

  return position
}

interface StatusPopupProps {
  agent: AgentStatus
  position: { x: number; y: number }
  onClose: () => void
}

function StatusPopup({ agent, position, onClose }: StatusPopupProps) {
  const config = AGENT_CONFIG[agent.id]
  
  const stateConfig = {
    active: { label: '活跃中', color: '#6b8e7a', icon: '●' },
    idle: { label: '待机', color: '#c4a882', icon: '○' },
    thinking: { label: '思考中', color: '#9a8bb3', icon: '◐' },
    offline: { label: '离线', color: '#8a7a6a', icon: '○' },
  }

  const state = stateConfig[agent.state]

  // 计算弹窗位置，避免超出边界
  const popupX = position.x > 600 ? position.x - 200 : position.x + 30
  const popupY = position.y < 100 ? position.y + 20 : position.y - 30

  return (
    <motion.div
      className="absolute z-50 pointer-events-auto"
      style={{ left: popupX, top: popupY }}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div 
        className="glass-panel rounded-lg p-4 min-w-[200px]"
        style={{ 
          borderColor: `${config.color}40`,
        }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-dahuang-ink/5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{config.emoji}</span>
            <div>
              <span 
                className="font-calligraphy text-base"
                style={{ color: '#2d2a26', letterSpacing: '0.08em' }}
              >
                {config.name}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-dahuang-ink-light hover:text-dahuang-ink transition-colors text-sm w-6 h-6 flex items-center justify-center rounded hover:bg-dahuang-ink/5"
          >
            ✕
          </button>
        </div>
        
        {/* 状态信息 */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span style={{ color: state.color }}>{state.icon}</span>
            <span className="text-dahuang-ink">{state.label}</span>
          </div>
          
          {agent.lastSeen && (
            <div className="text-xs text-dahuang-ink-light flex items-center gap-1.5">
              <span className="opacity-50">最后活动</span>
              <span>{new Date(agent.lastSeen).toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
          )}
          
          {agent.currentTask && (
            <div 
              className="text-xs mt-3 p-2.5 rounded"
              style={{ 
                backgroundColor: 'rgba(45,42,38,0.03)',
                color: '#5c5347',
              }}
            >
              {agent.currentTask}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function AgentSprites({ containerWidth, containerHeight }: AgentSpritesProps) {
  const statuses = useAgentStatusMock()
  const [selectedAgent, setSelectedAgent] = useState<AgentStatus | null>(null)

  // 计算基础位置 - 适配 400 高度的扇面
  const positions = useMemo(() => {
    const centerX = containerWidth / 2
    const centerY = containerHeight * 0.9

    return {
      baize: { 
        x: centerX - 55,
        y: centerY - 150,
      },
      goumang: { 
        x: centerX + 70,
        y: centerY - 135,
      },
      yinglong: { 
        x: centerX + 5,
        y: centerY - 170,
      },
    }
  }, [containerWidth, containerHeight])

  // 应龙漫游位置
  const yinglongPos = useRoamingPath(positions.yinglong.x, positions.yinglong.y)

  const getPosition = (agentId: 'baize' | 'goumang' | 'yinglong') => {
    if (agentId === 'yinglong') return yinglongPos
    return positions[agentId]
  }

  // 点击外部关闭弹窗
  const handleBackdropClick = () => {
    setSelectedAgent(null)
  }

  return (
    <>
      <div className="absolute inset-0 pointer-events-none">
        {statuses.map(agent => (
          <PixelSprite
            key={agent.id}
            agentId={agent.id}
            state={agent.state}
            position={getPosition(agent.id)}
            onClick={() => setSelectedAgent(
              selectedAgent?.id === agent.id ? null : agent
            )}
          />
        ))}
      </div>

      {/* 状态弹窗 */}
      <AnimatePresence>
        {selectedAgent && (
          <>
            {/* 背景遮罩 - 点击关闭 */}
            <motion.div
              className="absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleBackdropClick}
            />
            <StatusPopup
              agent={selectedAgent}
              position={getPosition(selectedAgent.id)}
              onClose={() => setSelectedAgent(null)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AgentSprites
