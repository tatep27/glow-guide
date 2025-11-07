import { Card, CardContent } from '@/components/ui/card'
import type { Experience } from '@/types'
import { formatDateRange } from '@/lib/dateUtils'
import { Badge } from '@/components/ui/badge'

interface ExperienceCardProps {
  experience: Experience
  onClick?: () => void
}

export function ExperienceCard({ experience, onClick }: ExperienceCardProps) {
  const dateRange = formatDateRange(experience.startDate, experience.endDate)

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow w-full max-w-sm"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg">{experience.title}</h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
              {dateRange}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {experience.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {experience.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {experience.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{experience.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

