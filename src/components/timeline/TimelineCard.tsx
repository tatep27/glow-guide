import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { Experience, Resource } from '@/types'
import { formatDateRange } from '@/lib/dateUtils'
import { format } from 'date-fns'
import { ExperienceDetailModal } from './ExperienceDetailModal'

interface TimelineCardProps {
  type: 'experience' | 'resource'
  data: Experience | Resource
  onClick?: () => void
  onResourceClick?: (resource: Resource) => void
}

// Color coding by type
const typeColors: Record<string, { bg: string; border: string }> = {
  // Experience types
  activity: {
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    border: 'border-purple-400 dark:border-purple-600',
  },
  volunteer: {
    bg: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30',
    border: 'border-green-400 dark:border-green-600',
  },
  work: {
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
    border: 'border-blue-400 dark:border-blue-600',
  },
  award: {
    bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30',
    border: 'border-yellow-400 dark:border-yellow-600',
  },
  // Resource types
  scholarship: {
    bg: 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30',
    border: 'border-blue-400 dark:border-blue-600',
  },
  paid: {
    bg: 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30',
    border: 'border-green-400 dark:border-green-600',
  },
  'club-fair': {
    bg: 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30',
    border: 'border-purple-400 dark:border-purple-600',
  },
  event: {
    bg: 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30',
    border: 'border-orange-400 dark:border-orange-600',
  },
  afterschool: {
    bg: 'bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30',
    border: 'border-pink-400 dark:border-pink-600',
  },
}

export function TimelineCard({ type, data, onClick, onResourceClick }: TimelineCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false)

  const colors = type === 'experience' 
    ? typeColors[(data as Experience).type]
    : typeColors[(data as Resource).type]

  const handleClick = () => {
    if (type === 'experience') {
      setShowDetailModal(true)
      onClick?.()
    } else {
      onResourceClick?.(data as Resource)
    }
  }

  return (
    <>
      <div className="relative">
        {/* Compact Card */}
        <Card
          className={`${colors.bg} ${colors.border} border-3 rounded-3xl p-4 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 w-[200px] shadow-lg`}
          onClick={handleClick}
          style={{ borderWidth: '3px' }}
        >
          <CardContent className="p-0">
            <div className="flex flex-col items-center text-center space-y-2">
              {/* Emoji */}
              {type === 'experience' && (data as Experience).emoji && (
                <div className="text-3xl">{(data as Experience).emoji}</div>
              )}
              {type === 'resource' && (
                <div className="text-3xl">
                  {(data as Resource).type === 'scholarship' && '💰'}
                  {(data as Resource).type === 'paid' && '💼'}
                  {(data as Resource).type === 'club-fair' && '🎪'}
                  {(data as Resource).type === 'event' && '📅'}
                  {(data as Resource).type === 'afterschool' && '🎨'}
                </div>
              )}
              
              {/* Type Label for Resources */}
              {type === 'resource' && (
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {(data as Resource).type === 'scholarship' && 'Scholarship'}
                  {(data as Resource).type === 'paid' && 'Paid Opportunity'}
                  {(data as Resource).type === 'club-fair' && 'Club Fair'}
                  {(data as Resource).type === 'event' && 'Event'}
                  {(data as Resource).type === 'afterschool' && 'Afterschool Program'}
                </div>
              )}
              
              {/* Title */}
              <h3 className="font-bold text-sm leading-tight text-foreground line-clamp-2">
                {data.title}
              </h3>
              
              {/* Date */}
              <p className="text-xs text-muted-foreground font-medium">
                {type === 'experience' 
                  ? formatDateRange((data as Experience).startDate, (data as Experience).endDate)
                  : (data as Resource).deadline 
                    ? format(new Date((data as Resource).deadline!), 'MMM yyyy')
                    : 'Apply by: ' + format(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), 'MMM yyyy') // Default to 90 days from now if no deadline
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal for Experiences */}
      {type === 'experience' && showDetailModal && (
        <ExperienceDetailModal
          experience={data as Experience}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  )
}

