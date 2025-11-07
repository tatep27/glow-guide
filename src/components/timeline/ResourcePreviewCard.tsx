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
      className="cursor-pointer hover:shadow-lg transition-all w-full"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-xl">{resource.title}</h3>
              <Badge variant="outline" className="text-sm">
                {typeLabels[resource.type]}
              </Badge>
            </div>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {resource.description}
          </p>
          {resource.deadline && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded border ${urgencyClass}`}>
              <Calendar className="h-4 w-4" />
              <span>Due: {formatDate(resource.deadline)}</span>
            </div>
          )}
          {!resource.deadline && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Ongoing opportunity</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

