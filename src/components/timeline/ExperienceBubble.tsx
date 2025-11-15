import type { Experience } from '@/types'
import { formatDateRange } from '@/lib/dateUtils'
import { Sparkles, Users, Briefcase, Award } from 'lucide-react'

interface ExperienceBubbleProps {
  experience: Experience
  onClick?: () => void
}

const experienceIcons: Record<Experience['type'], typeof Sparkles> = {
  activity: Sparkles,
  volunteer: Users,
  work: Briefcase,
  award: Award,
}

const experienceColors: Record<Experience['type'], { bg: string; border: string; icon: string }> = {
  activity: {
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    border: 'border-purple-400 dark:border-purple-600',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  volunteer: {
    bg: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30',
    border: 'border-green-400 dark:border-green-600',
    icon: 'text-green-600 dark:text-green-400',
  },
  work: {
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
    border: 'border-blue-400 dark:border-blue-600',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  award: {
    bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30',
    border: 'border-yellow-400 dark:border-yellow-600',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
}

export function ExperienceBubble({ experience, onClick }: ExperienceBubbleProps) {
  const dateRange = formatDateRange(experience.startDate, experience.endDate)
  const Icon = experienceIcons[experience.type]
  const colors = experienceColors[experience.type]

  return (
    <div
      className={`${colors.bg} border-3 ${colors.border} rounded-3xl p-5 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 max-w-[280px] min-w-[240px] transform hover:-translate-y-2 shadow-lg`}
      onClick={onClick}
      style={{ borderWidth: '3px' }}
    >
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
            <Icon className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-sm leading-tight text-foreground">{experience.title}</h3>
        </div>
        <p className="text-[10px] text-muted-foreground font-medium">{dateRange}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
          {experience.description}
        </p>
        <div className="flex flex-wrap gap-1 pt-1">
          {experience.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-2 py-0.5 bg-white/60 dark:bg-black/30 text-foreground rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {experience.tags.length > 2 && (
            <span className="text-[9px] px-2 py-0.5 bg-white/40 dark:bg-black/20 text-muted-foreground rounded-full">
              +{experience.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

