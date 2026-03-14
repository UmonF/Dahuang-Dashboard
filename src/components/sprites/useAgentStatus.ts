import { useState, useEffect, useCallback } from 'react'
import type { AgentStatus, AgentState } from './types'
import { GATEWAY_PORTS } from './types'

const POLL_INTERVAL = 30000 // 30秒轮询

async function fetchAgentState(agentId: 'baize' | 'goumang' | 'yinglong'): Promise<AgentState> {
  const port = GATEWAY_PORTS[agentId]
  
  try {
    const healthRes = await fetch(`http://localhost:${port}/health`, {
      signal: AbortSignal.timeout(5000),
    })
    
    if (!healthRes.ok) {
      return 'offline'
    }

    // 尝试获取详细状态
    try {
      const statusRes = await fetch(`http://localhost:${port}/status`, {
        signal: AbortSignal.timeout(5000),
      })
      
      if (statusRes.ok) {
        const status = await statusRes.json()
        // 检查是否有活跃的 session
        const hasActiveRun = status.sessions?.some((s: { isRunning?: boolean }) => s.isRunning)
        if (hasActiveRun) {
          return 'active'
        }
      }
    } catch {
      // status 端点可能不存在，忽略
    }

    return 'idle'
  } catch {
    return 'offline'
  }
}

export function useAgentStatus(): AgentStatus[] {
  const [statuses, setStatuses] = useState<AgentStatus[]>([
    { id: 'baize', state: 'idle' },
    { id: 'goumang', state: 'idle' },
    { id: 'yinglong', state: 'idle' },
  ])

  const updateStatuses = useCallback(async () => {
    const [baizeState, goumangState, yinglongState] = await Promise.all([
      fetchAgentState('baize'),
      fetchAgentState('goumang'),
      fetchAgentState('yinglong'),
    ])

    setStatuses([
      { id: 'baize', state: baizeState, lastSeen: Date.now() },
      { id: 'goumang', state: goumangState, lastSeen: Date.now() },
      { id: 'yinglong', state: yinglongState, lastSeen: Date.now() },
    ])
  }, [])

  useEffect(() => {
    // 初始获取
    updateStatuses()

    // 定时轮询
    const interval = setInterval(updateStatuses, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [updateStatuses])

  return statuses
}

// 默认状态 - 确保始终有值
const DEFAULT_STATUSES: AgentStatus[] = [
  { id: 'baize', state: 'idle' },
  { id: 'goumang', state: 'idle' },
  { id: 'yinglong', state: 'idle' },
]

// 开发模式：模拟状态
export function useAgentStatusMock(): AgentStatus[] {
  const [statuses, setStatuses] = useState<AgentStatus[]>([
    { id: 'baize', state: 'active' },
    { id: 'goumang', state: 'idle' },
    { id: 'yinglong', state: 'active' },
  ])

  // 模拟状态变化
  useEffect(() => {
    const states: AgentState[] = ['active', 'idle', 'thinking']
    
    const interval = setInterval(() => {
      setStatuses(prev => {
        // 防御性检查
        if (!prev || prev.length === 0) return DEFAULT_STATUSES
        
        return prev.map(agent => ({
          ...agent,
          state: Math.random() > 0.7 
            ? states[Math.floor(Math.random() * states.length)]
            : agent.state,
          lastSeen: Date.now(),
        }))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // 确保返回有效数组
  return statuses && statuses.length > 0 ? statuses : DEFAULT_STATUSES
}
