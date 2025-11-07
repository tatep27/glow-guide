import type { Experience } from '@/types'
import { formatDateRange } from '@/lib/dateUtils'

interface ExperienceBubbleProps {
  experience: Experience
  onClick?: () => void
}

export function ExperienceBubble({ experience, onClick }: ExperienceBubbleProps) {
  const dateRange = formatDateRange(experience.startDate, experience.endDate)

  return (
    <div
      className="bg-card border-2 border-primary/30 rounded-lg p-3 cursor-pointer hover:shadow-lg hover:scale-105 transition-all max-w-[200px] min-w-[180px]"
      onClick={onClick}
    >
      <div className="space-y-1.5">
        <h3 className="font-semibold text-sm leading-tight">{experience.title}</h3>
        <p className="text-[10px] text-muted-foreground">{dateRange}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-tight">
          {experience.description}
        </p>
        <div className="flex flex-wrap gap-1 pt-1">
          {experience.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded"
            >
              {tag}
            </span>
          ))}
          {experience.tags.length > 2 && (
            <span className="text-[9px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
              +{experience.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

