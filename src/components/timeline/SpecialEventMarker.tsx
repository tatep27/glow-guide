import { useState } from 'react'
import { Star } from 'lucide-react'
import type { SpecialEvent } from '@/types'
import { format } from 'date-fns'

interface SpecialEventMarkerProps {
  event: SpecialEvent
  position: { x: number; y: number }
  isAboveTimeline?: boolean
}

const eventTypeColors: Record<SpecialEvent['type'], { star: string; bg: string }> = {
  sat: {
    star: 'text-yellow-500',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  'counselor-note': {
    star: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  milestone: {
    star: 'text-purple-500',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
}

export function SpecialEventMarker({ event, position, isAboveTimeline = false }: SpecialEventMarkerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const colors = eventTypeColors[event.type]

  return (
    <div
      className="absolute z-20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Star Icon */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${colors.star} hover:scale-110 transition-transform cursor-pointer`}
      >
        <Star className="h-6 w-6 fill-current" />
      </button>

      {/* Label - position based on whether event is above or below timeline */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap z-10"
        style={{
          // If isAboveTimeline is true, put label above star (away from timeline)
          // If isAboveTimeline is false, put label below star (away from timeline)
          // Increased spacing to avoid overlap with grade labels
          top: isAboveTimeline ? 'auto' : 'calc(100% + 20px)',
          bottom: isAboveTimeline ? 'calc(100% + 20px)' : 'auto',
        }}
      >
        <div className={`${colors.bg} border-2 border-current rounded-lg px-2 py-1 text-xs font-semibold shadow-lg`}>
          {event.title}
        </div>
        <div className="text-xs text-muted-foreground text-center mt-1">
          {format(new Date(event.date), 'MMM yyyy')}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-16 w-64 bg-card border-3 border-primary/30 rounded-3xl p-4 shadow-2xl z-30">
          <h4 className="font-bold text-sm mb-2">{event.title}</h4>
          {event.description && (
            <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Date: {format(new Date(event.date), 'MMMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  )
}

