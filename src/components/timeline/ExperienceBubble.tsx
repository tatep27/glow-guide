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
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50',
    border: 'border-purple-300 dark:border-purple-700',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  volunteer: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50',
    border: 'border-green-300 dark:border-green-700',
    icon: 'text-green-600 dark:text-green-400',
  },
  work: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50',
    border: 'border-blue-300 dark:border-blue-700',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  award: {
    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/50',
    border: 'border-yellow-300 dark:border-yellow-700',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
}

export function ExperienceBubble({ experience, onClick }: ExperienceBubbleProps) {
  const dateRange = formatDateRange(experience.startDate, experience.endDate)
  const Icon = experienceIcons[experience.type]
  const colors = experienceColors[experience.type]

  return (
    <div
      className={`${colors.bg} border-2 ${colors.border} rounded-xl p-4 cursor-pointer hover:shadow-xl hover:scale-110 transition-all duration-300 max-w-[220px] min-w-[200px] transform hover:-translate-y-1`}
      onClick={onClick}
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

