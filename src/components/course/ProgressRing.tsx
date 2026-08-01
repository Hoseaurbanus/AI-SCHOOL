interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
}

export default function ProgressRing({
  progress,
  size = 60,
  strokeWidth = 4,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  const getColor = () => {
    if (progress >= 80) return "#10B981"
    if (progress >= 50) return "#3B82F6"
    if (progress >= 25) return "#F59E0B"
    return "#64748B"
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(59,130,246,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute text-xs font-bold font-display"
        style={{ color: getColor() }}
      >
        {progress}%
      </span>
    </div>
  )
}
