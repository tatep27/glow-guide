import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Resource } from '@/types'

interface ResourceGroupPreviewProps {
  type: string
  resources: Resource[]
  position: number // Position along timeline (0-100)
  side: 'above' | 'below' // Position above or below timeline
  onResourceClick?: (resource: Resource) => void
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  scholarship: {
    label: 'Scholarships',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    icon: '💰',
  },
  paid: {
    label: 'Jobs & Paid',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-900',
    icon: '💼',
  },
  'club-fair': {
    label: 'Club Fairs',
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    icon: '🎪',
  },
  event: {
    label: 'Events',
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    icon: '📅',
  },
  afterschool: {
    label: 'Programs',
    color: 'text-pink-700 dark:text-pink-300',
    bgColor: 'bg-pink-100 dark:bg-pink-900',
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
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-900',
    icon: '📌',
  }

  return (
    <div
      className="absolute transform -translate-x-1/2 z-20"
      style={{
        left: `${position}%`,
        [side === 'above' ? 'bottom' : 'top']: side === 'above' ? 'calc(50% + 60px)' : 'calc(50% + 60px)',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Connection Line */}
        <div
          className={`w-0.5 h-12 ${
            side === 'above' ? 'mb-2' : 'mb-2'
          } bg-primary/30`}
        />

        {/* Compact Preview Bubble */}
        <div
          className={`${config.bgColor} ${config.color} rounded-full px-4 py-2 cursor-pointer hover:scale-110 transition-transform border-2 border-current/20 min-w-[140px] text-center`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold leading-tight">{config.label}</span>
              <span className="text-[10px] opacity-75">{resources.length}</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </div>
        </div>

        {/* Expanded List - Positioned to avoid cutoff */}
        {isExpanded && (
          <div
            className={`absolute z-30 mt-2 w-[320px] max-h-[400px] overflow-y-auto bg-background border-2 rounded-lg shadow-xl p-3 space-y-2 ${
              side === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b">
              <h3 className="font-bold text-sm">{config.label}</h3>
              <span className="text-xs text-muted-foreground">{resources.length} items</span>
            </div>
            <div className="space-y-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="p-2 border rounded hover:bg-muted cursor-pointer text-sm"
                  onClick={() => {
                    setIsExpanded(false)
                    onResourceClick?.(resource)
                  }}
                >
                  <div className="font-medium text-xs">{resource.title}</div>
                  {resource.deadline && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Due: {new Date(resource.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
