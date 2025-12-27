import { SkillLevel } from '@prisma/client'

interface SkiLevelBadgeProps {
  level: SkillLevel
  size?: 'sm' | 'md'
  className?: string
}

export default function SkiLevelBadge({ level, size = 'md', className = '' }: SkiLevelBadgeProps) {
  const iconSize = size === 'sm' ? 12 : 16
  
  const getIcon = () => {
    switch (level) {
      case 'Beginner':
        // Green circle
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" className={className}>
            <circle cx="8" cy="8" r="7" fill="#22c55e" stroke="#2d5016" strokeWidth="1.5" opacity="0.9"/>
          </svg>
        )
      case 'Intermediate':
        // Blue square
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" className={className}>
            <rect x="2" y="2" width="12" height="12" fill="#3b82f6" stroke="#2d5016" strokeWidth="1.5" rx="1" opacity="0.9"/>
          </svg>
        )
      case 'Advanced':
        // Black diamond
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" className={className}>
            <path d="M 8 2 L 14 8 L 8 14 L 2 8 Z" fill="#2d5016" stroke="#2d5016" strokeWidth="1.5" opacity="0.9"/>
          </svg>
        )
      case 'Expert':
        // Double black diamond
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" className={className}>
            <path d="M 8 2 L 11 5 L 8 8 L 5 5 Z" fill="#2d5016" stroke="#2d5016" strokeWidth="1.5" opacity="0.9"/>
            <path d="M 8 8 L 11 11 L 8 14 L 5 11 Z" fill="#2d5016" stroke="#2d5016" strokeWidth="1.5" opacity="0.9"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <span className="inline-flex items-center gap-1" title={level}>
      {getIcon()}
      {size === 'md' && <span className="text-sm text-gray-700">{level}</span>}
    </span>
  )
}

