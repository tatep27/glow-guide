import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Resource } from '@/types'
import { ResourcePreviewCard } from './ResourcePreviewCard'

interface ResourceGroupPreviewProps {
  type: string
  resources: Resource[]
  position: number // Position along timeline (0-100)
  side: 'above' | 'below' // Position above or below timeline
  onResourceClick?: (resource: Resource) => void
}

const typeConfig: Record<string, { label: string; color: string; icon: string }> = {
  scholarship: {
    label: 'Scholarships',
    color: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700',
    icon: '💰',
  },
  paid: {
    label: 'Jobs & Paid',
    color: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700',
    icon: '💼',
  },
  'club-fair': {
    label: 'Club Fairs',
    color: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700',
    icon: '🎪',
  },
  event: {
    label: 'Events',
    color: 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700',
    icon: '📅',
  },
  afterschool: {
    label: 'Programs',
    color: 'bg-pink-100 dark:bg-pink-900 border-pink-300 dark:border-pink-700',
    icon: '🎨',
  },
}

export function ResourceGroupPreview({
  type,
  resources,
  position,
  side,
  onResourceClick,
}: ResourceGroupPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const config = typeConfig[type] || {
    label: type,
    color: 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700',
    icon: '📌',
  }

  return (
    <div
      className="absolute transform -translate-x-1/2"
      style={{ left: `${position}%`, [side]: '-120px' }}
    >
      <div className="relative">
        {/* Preview Card */}
        <Card
          className={`cursor-pointer hover:shadow-lg transition-all border-2 ${config.color} min-w-[200px] max-w-[250px]`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm">{config.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {resources.length} {resources.length === 1 ? 'opportunity' : 'opportunities'}
                  </p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expanded List */}
        {isExpanded && (
          <div className="absolute z-10 mt-2 w-[350px] max-h-[500px] overflow-y-auto bg-background border-2 rounded-lg shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{config.label}</h3>
              <Badge variant="secondary">{resources.length}</Badge>
            </div>
            <div className="space-y-3">
              {resources.map((resource) => (
                <ResourcePreviewCard
                  key={resource.id}
                  resource={resource}
                  onClick={() => {
                    setIsExpanded(false)
                    onResourceClick?.(resource)
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Connection Line */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 ${
            side === 'above' ? 'bottom-0' : 'top-0'
          } ${side === 'above' ? 'h-[120px]' : 'h-[120px]'} bg-primary/30`}
        />
      </div>
    </div>
  )
}

