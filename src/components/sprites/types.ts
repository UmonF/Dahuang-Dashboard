// Agent 状态类型
export type AgentState = 'active' | 'idle' | 'thinking' | 'offline'

export interface AgentStatus {
  id: 'baize' | 'goumang' | 'yinglong'
  state: AgentState
  lastSeen?: number
  currentTask?: string
}

export interface AgentPosition {
  x: number
  y: number
}

// Gateway 端口配置
export const GATEWAY_PORTS = {
  baize: 18789,
  goumang: 18789,  // 共享 gw1
  yinglong: 18800,
} as const

// Agent 配置 - 统一古风配色
export const AGENT_CONFIG = {
  baize: {
    name: '白泽',
    emoji: '🦁',
    role: '洞察万物',
    color: '#c4a882',      // 缟素金 - 呼应昆仑丘
    defaultPosition: { x: 280, y: 320 },
    section: 'kunlun',
  },
  goumang: {
    name: '句芒',
    emoji: '🌱',
    role: '生机守护',
    color: '#6b8e7a',      // 青玉色
    defaultPosition: { x: 520, y: 300 },
    section: 'tanggu',
  },
  yinglong: {
    name: '应龙',
    emoji: '🐉',
    role: '行云布雨',
    color: '#7fa8b8',      // 天青 - 呼应羽民国
    defaultPosition: { x: 400, y: 280 },
    roaming: true,
  },
} as const

// 状态动画配置
export const STATE_ANIMATIONS = {
  active: {
    frames: 8,
    fps: 12,
    loop: true,
    scale: 1.0,
  },
  idle: {
    frames: 4,
    fps: 4,
    loop: true,
    scale: 1.0,
  },
  thinking: {
    frames: 6,
    fps: 8,
    loop: true,
    scale: 1.0,
  },
  offline: {
    frames: 1,
    fps: 1,
    loop: false,
    scale: 0.9,
    opacity: 0.5,
  },
} as const
