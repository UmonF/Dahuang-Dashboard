import { motion } from 'framer-motion'

export interface SegmentOption {
  key: string
  label: string
  emoji?: string
  count?: number
}

interface SegmentControlProps {
  options: SegmentOption[]
  value: string | null
  onChange: (key: string | null) => void
  showAll?: boolean
  allLabel?: string
}

function SegmentControl({ 
  options, 
  value, 
  onChange, 
  showAll = true,
  allLabel = '全部'
}: SegmentControlProps) {
  
  const allOptions = showAll 
    ? [{ key: '__all__', label: allLabel }, ...options]
    : options
  
  // 当前激活的 key：value 为 null 时显示 "全部"
  const activeKey = value === null ? '__all__' : value

  return (
    <div className="segment-control">
      {allOptions.map((opt) => {
        const isActive = opt.key === activeKey
        return (
          <button
            key={opt.key}
            className={`segment-btn ${isActive ? 'active' : ''}`}
            onClick={() => {
              // 点击 "全部" 时传 null，否则传具体 key
              onChange(opt.key === '__all__' ? null : opt.key)
            }}
            type="button"
          >
            {isActive && (
              <motion.span
                className="segment-bg"
                layoutId="segment-indicator"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="segment-label">
              {opt.emoji && <span className="segment-emoji">{opt.emoji}</span>}
              {opt.label}
              {opt.count !== undefined && (
                <span className="segment-count">{opt.count}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default SegmentControl
