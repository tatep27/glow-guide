import { Card, CardContent } from '@/components/ui/card'
import type { Resource } from '@/types'
import { formatDate, getDeadlineUrgency } from '@/lib/dateUtils'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

interface ResourcePreviewCardProps {
  resource: Resource
  onClick?: () => void
}

const urgencyColors = {
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
  soon: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
  upcoming: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
}

const typeLabels: Record<string, string> = {
  scholarship: 'Scholarship',
  afterschool: 'Afterschool',
  paid: 'Paid Opportunity',
  'club-fair': 'Club Fair',
  event: 'Event',
}

export function ResourcePreviewCard({ resource, onClick }: ResourcePreviewCardProps) {
  const urgency = getDeadlineUrgency(resource.deadline)
  const urgencyClass = urgency ? urgencyColors[urgency] : ''

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow w-full max-w-sm"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{resource.title}</h3>
              <Badge variant="outline" className="mt-1 text-xs">
                {typeLabels[resource.type]}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {resource.description}
          </p>
          {resource.deadline && (
            <div className={`flex items-center gap-2 text-xs px-2 py-1 rounded border ${urgencyClass}`}>
              <Calendar className="h-3 w-3" />
              <span>Due: {formatDate(resource.deadline)}</span>
            </div>
          )}
          {!resource.deadline && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Ongoing opportunity</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

