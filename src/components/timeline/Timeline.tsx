import { useEffect, useRef, useMemo } from 'react'
import { ExperienceCard } from './ExperienceCard'
import { ResourceGroupPreview } from './ResourceGroupPreview'
import type { Experience, Resource } from '@/types'
import { alexProfile } from '@/data/alexProfile'

interface TimelineProps {
  experiences: Experience[]
  resources: Resource[]
  onExperienceClick?: (experience: Experience) => void
  onResourceClick?: (resource: Resource) => void
}

const grades = [9, 10, 11, 12] as const

export function Timeline({ experiences, resources, onExperienceClick, onResourceClick }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const currentGrade = alexProfile.grade

  // Scroll to current position on mount
  useEffect(() => {
    if (timelineRef.current) {
      // Scroll to show current grade (10th grade = index 1, so ~33% of width)
      const scrollPosition = (currentGrade - 9) * (100 / 4) - 15 // Offset to show some context
      timelineRef.current.scrollLeft = (timelineRef.current.scrollWidth * scrollPosition) / 100
    }
  }, [currentGrade])

  // Filter resources to show upcoming ones
  const upcomingResources = useMemo(() => {
    return resources.filter((res) => {
      if (!res.deadline) return true // Show ongoing opportunities
      const deadlineDate = new Date(res.deadline)
      return deadlineDate > new Date()
    })
  }, [resources])

  // Group resources by type
  const resourcesByType = useMemo(() => {
    const grouped: Record<string, Resource[]> = {}
    upcomingResources.forEach((res) => {
      if (!grouped[res.type]) {
        grouped[res.type] = []
      }
      grouped[res.type].push(res)
    })
    return grouped
  }, [upcomingResources])

  // Calculate positions for resource groups along timeline
  // Distribute them across grades 10-12 (future)
  const getResourceGroupPosition = (index: number): { position: number; side: 'above' | 'below' } => {
    // Position groups between grades 10-12 (positions 33%, 50%, 66%, 83%)
    const basePositions = [33, 50, 66, 83]
    const position = basePositions[index % basePositions.length]
    // Alternate above and below
    const side = index % 2 === 0 ? 'above' : 'below'
    return { position, side }
  }

  // Position experiences along timeline (past/current)
  const getExperiencePosition = (experience: Experience): number => {
    // Map grade level to position: 9th = 0%, 10th = 33%, etc.
    const gradePositions: Record<number, number> = {
      9: 0,
      10: 33,
      11: 66,
      12: 100,
    }
    return gradePositions[experience.gradeLevel] || 0
  }

  const resourceTypes = Object.keys(resourcesByType)

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Timeline</h2>
        <p className="text-muted-foreground">
          Track your progress from 9th grade through graduation
        </p>
      </div>

      <div
        ref={timelineRef}
        className="overflow-x-auto pb-32 pt-32 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="relative min-w-[1600px] h-[600px]">
          {/* Main Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary transform -translate-y-1/2" />

          {/* Grade Markers */}
          {grades.map((grade, index) => {
            const isCurrent = grade === currentGrade
            const position = (index / (grades.length - 1)) * 100

            return (
              <div
                key={grade}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-10"
                style={{ left: `${position}%` }}
              >
                {/* Marker Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-4 ${
                      isCurrent
                        ? 'bg-primary border-primary scale-125 shadow-lg'
                        : 'bg-background border-primary/60'
                    } transition-all`}
                  />
                  {/* Grade Label */}
                  <span
                    className={`mt-3 text-sm font-semibold whitespace-nowrap ${
                      isCurrent ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {grade === 9 && '9th Grade'}
                    {grade === 10 && '10th Grade'}
                    {grade === 11 && '11th Grade'}
                    {grade === 12 && '12th Grade'}
                  </span>
                  {/* Current Indicator */}
                  {isCurrent && (
                    <span className="mt-1 text-xs text-primary font-medium">You are here</span>
                  )}
                </div>
              </div>
            )
          })}

          {/* Experiences (Past/Current) - Positioned along timeline */}
          {experiences.map((experience, index) => {
            const position = getExperiencePosition(experience)
            const side = index % 2 === 0 ? 'above' : 'below'

            return (
              <div
                key={experience.id}
                className="absolute transform -translate-x-1/2 z-20"
                style={{
                  left: `${position}%`,
                  top: side === 'above' ? '20%' : '80%',
                }}
              >
                <div className="relative">
                  <ExperienceCard
                    experience={experience}
                    onClick={() => onExperienceClick?.(experience)}
                  />
                  {/* Connection Line */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 ${
                      side === 'above' ? 'bottom-0' : 'top-0'
                    } ${side === 'above' ? 'h-[80px]' : 'h-[80px]'} bg-primary/30`}
                    style={{
                      [side === 'above' ? 'bottom' : 'top']: '-80px',
                    }}
                  />
                </div>
              </div>
            )
          })}

          {/* Resource Groups - Positioned along timeline */}
          {resourceTypes.map((type, index) => {
            const groupResources = resourcesByType[type]
            const { position, side } = getResourceGroupPosition(index)

            return (
              <ResourceGroupPreview
                key={type}
                type={type}
                resources={groupResources}
                position={position}
                side={side}
                onResourceClick={onResourceClick}
              />
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary" />
            <span>Current Grade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-background border-2 border-primary/60" />
            <span>Other Grades</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-primary/30" />
            <span>Timeline</span>
          </div>
        </div>
      </div>
    </div>
  )
}
