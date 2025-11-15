import { useRef, useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface TimelineIndicatorProps {
  totalItems: number
  currentSection: 'experiences' | 'upcoming' | 'futures'
  itemIndex: number
  futuresStartIndex: number
  isDotted?: boolean
  isBranch?: boolean
  showArrow?: boolean
  gradeYear?: number
  dateLabel?: string
}

export function TimelineIndicator({
  currentSection,
  itemIndex,
  futuresStartIndex,
  isBranch = false,
  showArrow = false,
  gradeYear,
  dateLabel,
}: TimelineIndicatorProps) {
  const dotRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.5 }
    )

    if (dotRef.current) {
      observer.observe(dotRef.current)
    }

    return () => {
      if (dotRef.current) {
        observer.unobserve(dotRef.current)
      }
    }
  }, [])

  const isInFutures = itemIndex >= futuresStartIndex

  const getDotStyle = () => {
    if (isInFutures) {
      return 'border-[3px] border-dashed border-purple-500 bg-white dark:bg-gray-900 w-6 h-6'
    }
    if (currentSection === 'experiences') {
      return 'bg-purple-600 border-[3px] border-purple-700 shadow-xl w-6 h-6'
    }
    return 'bg-blue-500 border-[3px] border-blue-600 shadow-lg w-6 h-6'
  }


  return (
    <div className="relative flex flex-col items-center justify-center" ref={dotRef}>
      {/* Grade Year Label */}
      {gradeYear && (
        <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 z-30">
          <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap border-2 border-purple-700">
            {gradeYear === 9 && '9th Grade'}
            {gradeYear === 10 && '10th Grade'}
            {gradeYear === 11 && '11th Grade'}
            {gradeYear === 12 && '12th Grade'}
          </div>
        </div>
      )}

      {/* Date Label */}
      {dateLabel && !gradeYear && (
        <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 z-30">
          <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap border-2 border-blue-600">
            {dateLabel}
          </div>
        </div>
      )}

      {/* Branching line for career cards */}
      {isBranch && (
        <div className="absolute left-1/2 top-1/2 w-12 h-1.5 border-t-[3px] border-dashed border-purple-500 transform -translate-y-1/2 z-0" />
      )}

      {/* Dot - sits on the main continuous line */}
      <div
        className={`rounded-full ${getDotStyle()} transition-all duration-300 relative z-20 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
        }`}
      />

      {/* Arrow indicator pointing down */}
      {showArrow && (
        <div className="absolute top-full mt-2 z-20">
          <ChevronDown className="h-5 w-5 text-purple-600 animate-bounce" />
        </div>
      )}
    </div>
  )
}

// Main timeline line component that runs down the left side
interface TimelineLineProps {
  children?: React.ReactNode
}

export function TimelineLine({ children }: TimelineLineProps) {
  return (
    <div className="relative flex flex-col items-center w-full" style={{ minHeight: '100%' }}>
      {/* Continuous vertical line - solid purple line going all the way down */}
      <div 
        className="absolute left-1/2 top-0 transform -translate-x-1/2 z-0"
        style={{
          width: '4px',
          background: '#8B7EC8', // primary purple color
          height: '100%',
          minHeight: '100vh',
        }}
      />
      {children}
    </div>
  )
}

