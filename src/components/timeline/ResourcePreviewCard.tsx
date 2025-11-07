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
  upcoming: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
}

const typeColors: Record<string, { bg: string; border: string; badge: string }> = {
  scholarship: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-300 dark:border-blue-700',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  },
  afterschool: {
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-300 dark:border-pink-700',
    badge: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-700',
  },
  paid: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-300 dark:border-green-700',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
  },
  'club-fair': {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-300 dark:border-purple-700',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-700',
  },
  event: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-300 dark:border-orange-700',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
  },
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
  const typeColor = typeColors[resource.type] || {
    bg: 'bg-gray-50 dark:bg-gray-950/30',
    border: 'border-gray-300 dark:border-gray-700',
    badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }

  return (
    <Card 
      className={`cursor-pointer hover:shadow-xl transition-all w-full border-2 ${typeColor.border} ${typeColor.bg}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-xl">{resource.title}</h3>
              <Badge className={`${typeColor.badge} border`}>
                {typeLabels[resource.type]}
              </Badge>
            </div>
          </div>
          <p className="text-base text-muted-foreground leading-relaxed">
            {resource.description}
          </p>
          {resource.deadline && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded border font-medium ${urgencyClass}`}>
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

