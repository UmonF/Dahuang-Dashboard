import { useState, useEffect, useRef, useCallback } from 'react'
import type { AgentState } from './types'

// 扇面上的关键地点
const LOCATIONS = {
  yumin: { x: 180, y: 220 },
  kunlun: { x: 340, y: 200 },
  lingshan: { x: 520, y: 190 },
  tanggu: { x: 720, y: 210 },
  center: { x: 500, y: 240 },
  upperLeft: { x: 250, y: 160 },
  upperRight: { x: 700, y: 150 },
  lowerCenter: { x: 480, y: 300 },
}

type LocationKey = keyof typeof LOCATIONS

// Agent 性格 & 偏好配置
const AGENT_BEHAVIOR = {
  baize: {
    homeBase: 'kunlun' as LocationKey,
    idlePattern: ['kunlun', 'center', 'kunlun', 'upperLeft', 'kunlun'] as LocationKey[],
    activePattern: ['kunlun', 'lingshan', 'kunlun', 'yumin', 'kunlun'] as LocationKey[],
    thinkingSpot: 'kunlun' as LocationKey,
    moveSpeed: 0.015,
    pauseDuration: [4000, 8000] as [number, number],
  },
  goumang: {
    homeBase: 'tanggu' as LocationKey,
    idlePattern: ['tanggu', 'lingshan', 'tanggu', 'center', 'tanggu', 'upperRight'] as LocationKey[],
    activePattern: ['tanggu', 'lingshan', 'center', 'kunlun', 'yumin', 'tanggu'] as LocationKey[],
    thinkingSpot: 'tanggu' as LocationKey,
    moveSpeed: 0.025,
    pauseDuration: [1500, 3500] as [number, number],
  },
  yinglong: {
    homeBase: 'center' as LocationKey,
    idlePattern: ['yumin', 'upperLeft', 'kunlun', 'center', 'lingshan', 'upperRight', 'tanggu', 'lowerCenter'] as LocationKey[],
    activePattern: ['yumin', 'kunlun', 'lingshan', 'tanggu', 'upperRight', 'center', 'upperLeft'] as LocationKey[],
    thinkingSpot: 'center' as LocationKey,
    moveSpeed: 0.02,
    pauseDuration: [2000, 4000] as [number, number],
  },
}

interface PathResult {
  x: number
  y: number
  direction: 'left' | 'right'
  isMoving: boolean
}

interface PathState {
  x: number
  y: number
  targetX: number
  targetY: number
  currentIndex: number
  isPaused: boolean
  direction: 'left' | 'right'
}

// 单独管理一个 agent 的路径
function createAgentPath(agentId: 'baize' | 'goumang' | 'yinglong') {
  const behavior = AGENT_BEHAVIOR[agentId]
  const home = LOCATIONS[behavior.homeBase]
  
  return {
    x: home.x,
    y: home.y,
    targetX: home.x,
    targetY: home.y,
    currentIndex: 0,
    isPaused: true,
    direction: 'right' as const,
  }
}

export function useAllAgentPaths(
  agents: Array<{ id: 'baize' | 'goumang' | 'yinglong'; state: AgentState }>
): Record<'baize' | 'goumang' | 'yinglong', PathResult> {
  
  const [paths, setPaths] = useState<Record<'baize' | 'goumang' | 'yinglong', PathState>>(() => ({
    baize: createAgentPath('baize'),
    goumang: createAgentPath('goumang'),
    yinglong: createAgentPath('yinglong'),
  }))

  const agentStates = useRef<Record<string, AgentState>>({})
  
  // 更新 agent 状态引用
  useEffect(() => {
    agents.forEach(a => {
      agentStates.current[a.id] = a.state
    })
  }, [agents])

  // 移动到下一个目标
  const moveToNext = useCallback((agentId: 'baize' | 'goumang' | 'yinglong') => {
    const state = agentStates.current[agentId] || 'idle'
    const behavior = AGENT_BEHAVIOR[agentId]
    
    const pattern = state === 'thinking' ? [behavior.thinkingSpot] 
      : state === 'active' ? behavior.activePattern 
      : behavior.idlePattern

    setPaths(prev => {
      const current = prev[agentId]
      const nextIndex = (current.currentIndex + 1) % pattern.length
      const nextLoc = LOCATIONS[pattern[nextIndex]]
      const randomX = nextLoc.x + (Math.random() - 0.5) * 30
      const randomY = nextLoc.y + (Math.random() - 0.5) * 20

      return {
        ...prev,
        [agentId]: {
          ...current,
          targetX: randomX,
          targetY: randomY,
          currentIndex: nextIndex,
          isPaused: false,
          direction: randomX > current.x ? 'right' : 'left',
        },
      }
    })
  }, [])

  // 动画循环
  useEffect(() => {
    let animationId: number
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      setPaths(prev => {
        const next = { ...prev }
        let changed = false

        for (const agentId of ['baize', 'goumang', 'yinglong'] as const) {
          const state = agentStates.current[agentId]
          if (state === 'offline') continue

          const current = prev[agentId]
          if (current.isPaused) continue

          const dx = current.targetX - current.x
          const dy = current.targetY - current.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 2) {
            next[agentId] = { ...current, x: current.targetX, y: current.targetY, isPaused: true }
            changed = true
          } else {
            const behavior = AGENT_BEHAVIOR[agentId]
            const speed = behavior.moveSpeed * deltaTime
            const ratio = Math.min(speed / distance, 1)
            
            next[agentId] = {
              ...current,
              x: current.x + dx * ratio,
              y: current.y + dy * ratio,
            }
            changed = true
          }
        }

        return changed ? next : prev
      })

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  // 暂停后计划下一次移动
  useEffect(() => {
    const timeouts: number[] = []

    for (const agentId of ['baize', 'goumang', 'yinglong'] as const) {
      const current = paths[agentId]
      const state = agentStates.current[agentId]
      
      if (!current.isPaused || state === 'offline' || state === 'thinking') continue

      const behavior = AGENT_BEHAVIOR[agentId]
      const [minPause, maxPause] = behavior.pauseDuration
      const pauseTime = minPause + Math.random() * (maxPause - minPause)

      const timeout = window.setTimeout(() => moveToNext(agentId), pauseTime)
      timeouts.push(timeout)
    }

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [paths.baize.isPaused, paths.goumang.isPaused, paths.yinglong.isPaused, moveToNext])

  // 状态变化时回到特定位置
  useEffect(() => {
    for (const agent of agents) {
      if (agent.state === 'thinking') {
        const behavior = AGENT_BEHAVIOR[agent.id]
        const spot = LOCATIONS[behavior.thinkingSpot]
        setPaths(prev => ({
          ...prev,
          [agent.id]: {
            ...prev[agent.id],
            targetX: spot.x,
            targetY: spot.y,
            isPaused: false,
          },
        }))
      }
    }
  }, [agents])

  return {
    baize: {
      x: paths.baize.x,
      y: paths.baize.y,
      direction: paths.baize.direction,
      isMoving: !paths.baize.isPaused,
    },
    goumang: {
      x: paths.goumang.x,
      y: paths.goumang.y,
      direction: paths.goumang.direction,
      isMoving: !paths.goumang.isPaused,
    },
    yinglong: {
      x: paths.yinglong.x,
      y: paths.yinglong.y,
      direction: paths.yinglong.direction,
      isMoving: !paths.yinglong.isPaused,
    },
  }
}
