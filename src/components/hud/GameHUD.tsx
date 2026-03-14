import { motion } from 'framer-motion'
import { AGENT_CONFIG } from '../sprites/types'
import { useAgentStatusMock } from '../sprites/useAgentStatus'

function AgentPanel() {
  const statuses = useAgentStatusMock()
  
  const stateConfig = {
    active: { icon: '●', class: 'active' },
    idle: { icon: '○', class: 'idle' },
    thinking: { icon: '◐', class: 'thinking' },
    offline: { icon: '◌', class: 'offline' },
  }

  return (
    <motion.div 
      className="hud-panel"
      initial={{ opacity: 0, x: -30, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <div className="panel-header">
        <span className="panel-icon">☰</span>
        <span>诸灵</span>
      </div>
      <div className="panel-content">
        {statuses.map(agent => {
          const config = AGENT_CONFIG[agent.id]
          const state = stateConfig[agent.state]
          return (
            <div key={agent.id} className="agent-row">
              <span className="agent-emoji">{config.emoji}</span>
              <span className="agent-name">{config.name}</span>
              <span className={`agent-state ${state.class}`}>
                {state.icon}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function SchedulePanel() {
  const schedules = [
    { time: '卯时', task: '晨间采集', done: true },
    { time: '巳时', task: '趋势洞察', done: false },
    { time: '未时', task: '周报整理', done: false },
  ]

  return (
    <motion.div 
      className="hud-panel"
      initial={{ opacity: 0, x: 30, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: 1.3 }}
    >
      <div className="panel-header">
        <span className="panel-icon">卷</span>
        <span>日程</span>
      </div>
      <div className="panel-content">
        {schedules.map((item, i) => (
          <div key={i} className="schedule-row">
            <span className="schedule-time">{item.time}</span>
            <span className={`schedule-task ${item.done ? 'done' : ''}`}>
              {item.task}
            </span>
            <span className="schedule-check">
              {item.done ? '✓' : '○'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function GameHUD() {
  return (
    <div className="hud-bottom">
      <AgentPanel />
      <SchedulePanel />
    </div>
  )
}

export default GameHUD
